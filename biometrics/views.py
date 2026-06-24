from rest_framework import viewsets, permissions, generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAdminUser
from django.contrib.auth.models import User
from django.utils import timezone
from django.shortcuts import get_object_or_404
from datetime import timedelta
from .models import HealthRecord, Device, MeasurementSession
from .serializers import (
    HealthRecordSerializer, 
    DeviceSerializer, 
    DeviceUploadSerializer, 
    RegisterSerializer
)


# --- 1. XÁC THỰC NGƯỜI DÙNG ---

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

class CustomLoginView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)

        # Trả về Admin để React biết đường ẩn/hiện trang quản trị
        return Response({
            'token': token.key,
            'username': user.username,
            'is_admin': user.is_superuser or user.is_staff
        })
    

# --- 2. API GIAO DIỆN REACT ---

class HealthRecordViewSet(viewsets.ModelViewSet):
    serializer_class = HealthRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # User nào đăng nhập thì chỉ thấy số đo của user đó!
        return HealthRecord.objects.filter(user=self.request.user).order_by('-created_at')

class DeviceViewSet(viewsets.ModelViewSet):
    serializer_class = DeviceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Chỉ hiển thị danh sách cân của user đang đăng nhập
        return Device.objects.filter(user=self.request.user).order_by('-registered_at')

    def perform_create(self, serializer):
        # Khi thêm cân mới, nó thuộc về người vừa bấm nút "Thêm"
        serializer.save(user=self.request.user)


# --- 2.5 API NHẬN VÀ LƯU DỮ LIỆU TỪ MÃ QR ---

class ClaimMeasurementView(APIView):
    # Chỉ user đã đăng nhập mới được lưu dữ liệu
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, token):
        # 1. Tìm phiên đo lường tạm thời theo token từ mã QR
        session = get_object_or_404(MeasurementSession, token=token, is_saved=False)
        
        # 2. Tìm kiếm thiết bị (Device) dựa trên mac_address để link vào bản ghi
        device = Device.objects.filter(mac_address=session.mac_address).first()
        
        # 3. Tạo bản ghi chính thức vào bảng HealthRecord cho User này với đầy đủ 6 thông số
        record = HealthRecord.objects.create(
            user=request.user,
            device=device,
            weight=session.weight,
            height=session.height,
            bmi=session.bmi,
            temperature=session.temperature,
            heart_rate=session.heart_rate,
            spo2=session.spo2,
        )
        
        # 4. Đánh dấu phiên QR này đã được sử dụng (chống quét lại lần 2)
        session.is_saved = True
        session.user = request.user
        session.save()
        
        # 5. Trả kết quả về cho React để in ra file PDF
        return Response({
            "message": "Dữ liệu đã được lưu thành công vào hồ sơ!",
            "data": {
                "weight": record.weight,
                "height": record.height,
                "bmi": record.bmi,
                "temperature": record.temperature,
                "heart_rate": record.heart_rate,
                "spo2": record.spo2,
                "date": record.created_at.strftime("%d/%m/%Y %H:%M")
            }
        }, status=status.HTTP_200_OK)


# --- 3. API PHẦN CỨNG ESP32 (TẠO MÃ QR) ---

class HardwareUploadView(APIView):
    # Cho phép ESP32 gửi dữ liệu mà không cần đăng nhập
    permission_classes = [permissions.AllowAny] 

    def post(self, request):
        
        # Xóa các phiên đo lường tạm thời chưa được lưu mà đã quá 10 phút
        expiration_time = timezone.now() - timedelta(minutes=10)
        MeasurementSession.objects.filter(
            is_saved=False, 
            created_at__lt=expiration_time
        ).delete()

        data = request.data
        
        # 1. Khởi tạo một bản ghi tạm thời trong MeasurementSession với đầy đủ 6 thông số
        try:
            session = MeasurementSession.objects.create(
                weight=data.get('weight'),
                height=data.get('height'),
                bmi=data.get('bmi'),
                temperature=data.get('temperature'),
                heart_rate=data.get('heart_rate'),
                spo2=data.get('spo2'),
                mac_address=data.get('mac_address')
            )
            
            # 2. Tạo đường link chứa Token để ESP32 vẽ QR
            # LƯU Ý: Khi deploy thật, nhớ đổi http://localhost:3000 thành Domain của Web-app
            qr_url = f"http://localhost:3000/claim-record/{session.token}/"      
            return Response({"qr_url": qr_url}, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    
# --- 4. API QUẢN TRỊ VIÊN ---

# Lấy số liệu thống kê cho Dashboard có lọc theo thiết bị
class AdminStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        today = timezone.now().date()
        device_id = request.GET.get('device_id', 'all')
        
        # Lọc dữ liệu đo lường theo thiết bị hoặc lấy tất cả thiết bị
        if device_id != 'all':
            records_qs = HealthRecord.objects.filter(device_id=device_id)
        else:
            records_qs = HealthRecord.objects.all()
        
        # 1. Tính toán thẻ KPI
        total_users = User.objects.count()
        active_devices = Device.objects.filter(is_active=True).count()
        offline_devices = Device.objects.filter(is_active=False).count()
        today_records = records_qs.filter(created_at__date=today).count()

        # 2. Tính toán biểu đồ 7 ngày theo bộ lọc thiết bị
        chart_data = []
        for i in range(6, -1, -1):
            d = today - timedelta(days=i)
            count = records_qs.filter(created_at__date=d).count()
            chart_data.append({"day": d.strftime("%d/%m"), "count": count})

        return Response({
            "kpi": {
                "total_users": total_users,
                "active_devices": active_devices,
                "offline_devices": offline_devices,
                "today_records": today_records
            },
            "chart": chart_data
        })
    
# Lấy danh sách Người Dùng
class AdminUserListView(APIView):
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        users = User.objects.all().values('id', 'username', 'email', 'date_joined', 'is_active', 'is_superuser')
        return Response(list(users))

# Lấy danh sách Toàn bộ Thiết bị
class AdminDeviceListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        devices = Device.objects.all().select_related('user')
        data = []
        for d in devices:
            data.append({
                "id": d.id, "mac": d.mac_address, "name": d.name, 
                "owner": d.user.username, "is_active": d.is_active,
                "registered_at": d.registered_at.strftime("%d/%m/%Y")
            })
        return Response(data)

# Khóa/Mở Khóa Tài khoản
class ToggleUserStatusView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            if not user.is_superuser: # Không cho Admin tự khóa mình
                user.is_active = not user.is_active
                user.save()
            return Response({"status": "success", "is_active": user.is_active})
        except User.DoesNotExist:
            return Response({"error": "Không tìm thấy user"}, status=404)