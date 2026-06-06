from rest_framework import viewsets, permissions, generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAdminUser
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

from .models import HealthRecord, Device
from .serializers import (
    HealthRecordSerializer, 
    DeviceSerializer, 
    DeviceUploadSerializer, 
    RegisterSerializer
)

# =======================================================
# --- 1. XÁC THỰC NGƯỜI DÙNG ---
# =======================================================

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

        # Trả về cờ Admin để React biết đường ẩn/hiện trang quản trị
        return Response({
            'token': token.key,
            'username': user.username,
            'is_admin': user.is_superuser or user.is_staff
        })

# =======================================================
# --- 2. API DÀNH CHO GIAO DIỆN REACT ---
# =======================================================

class HealthRecordViewSet(viewsets.ModelViewSet):
    serializer_class = HealthRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Mở comment: User nào đăng nhập thì chỉ thấy số đo của user đó!
        return HealthRecord.objects.filter(user=self.request.user).order_by('-created_at')

class DeviceViewSet(viewsets.ModelViewSet):
    serializer_class = DeviceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Chỉ hiển thị danh sách cân của user đang đăng nhập
        return Device.objects.filter(user=self.request.user).order_by('-registered_at')

    def perform_create(self, serializer):
        # Khi thêm cân mới, mặc định nó thuộc về người vừa bấm nút "Thêm"
        serializer.save(user=self.request.user)

# =======================================================
# --- 3. API DÀNH CHO PHẦN CỨNG ESP32 ---
# =======================================================

class HardwareUploadView(APIView):
    permission_classes = [permissions.AllowAny] # ESP32 không có Token

    def post(self, request):
        serializer = DeviceUploadSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()   # Đối chiếu kiểm dữ liệu với DeviceUploadSerializer,
                                # nếu hợp lệ thì lưu vào DB
            return Response({"message": "Data received and saved successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# =======================================================
# --- 4. API DÀNH RIÊNG CHO QUẢN TRỊ VIÊN ---
# =======================================================

# API 1: Lấy số liệu thống kê cho Dashboard có lọc theo thiết bị
class AdminStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        today = timezone.now().date()
        device_id = request.GET.get('device_id', 'all')
        
        # Lọc dữ liệu đo lường theo thiết bị nếu Admin có chọn
        if device_id != 'all':
            records_qs = HealthRecord.objects.filter(device_id=device_id)
        else:
            records_qs = HealthRecord.objects.all()
        
        # 1. Tính toán thẻ KPI
        total_users = User.objects.count()
        active_devices = Device.objects.filter(is_active=True).count()
        offline_devices = Device.objects.filter(is_active=False).count()
        today_records = records_qs.filter(created_at__date=today).count() # Đếm theo bộ lọc

        # 2. Tính toán biểu đồ 7 ngày qua theo bộ lọc
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
            if not user.is_superuser: # Không cho phép Admin tự khóa mình
                user.is_active = not user.is_active
                user.save()
            return Response({"status": "success", "is_active": user.is_active})
        except User.DoesNotExist:
            return Response({"error": "Không tìm thấy user"}, status=404)