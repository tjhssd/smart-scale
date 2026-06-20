from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Device, HealthRecord, MeasurementSession

# --- 1. SERIALIZER XÁC THỰC NGƯỜI DÙNG ---
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            validated_data['username'],
            validated_data.get('email', ''),
            validated_data['password']
        )
        return user


# --- 2. SERIALIZER THIẾT BỊ (DEVICE) ---
class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = '__all__'
        # Trường user và registered_at sẽ được tự động gán ở Backend, không cho phép React gửi lên
        read_only_fields = ('user', 'registered_at')


# --- 3. SERIALIZER LỊCH SỬ ĐO LƯỜNG (CHO REACT FRONTEND) ---
class HealthRecordSerializer(serializers.ModelSerializer):
    # Trích xuất thêm tên và mã MAC của thiết bị để hiển thị đẹp hơn trên Web
    device_name = serializers.CharField(source='device.name', read_only=True, default="Không xác định")
    device_mac = serializers.CharField(source='device.mac_address', read_only=True, default="N/A")
    
    # Định dạng lại thời gian cho dễ nhìn ở giao diện (VD: 20/06/2026 14:30)
    date_formatted = serializers.SerializerMethodField()

    class Meta:
        model = HealthRecord
        fields = [
            'id', 'device', 'device_name', 'device_mac',
            'weight', 'height', 'bmi', 'temperature', 'heart_rate', 'spo2',
            'created_at', 'date_formatted'
        ]
        read_only_fields = ('user', 'created_at')

    def get_date_formatted(self, obj):
        # Trả về giờ Việt Nam (bạn có thể tuỳ chỉnh format ở đây)
        return obj.created_at.strftime("%d/%m/%Y %H:%M")


# --- 4. SERIALIZER KIỂM TRA DỮ LIỆU TỪ ESP32 ---
class DeviceUploadSerializer(serializers.Serializer):
    mac_address = serializers.CharField(max_length=50)
    weight = serializers.FloatField()
    height = serializers.FloatField()
    bmi = serializers.FloatField()
    temperature = serializers.FloatField()
    heart_rate = serializers.IntegerField()
    spo2 = serializers.IntegerField()

    # Hàm validate này dùng để đảm bảo ESP32 gửi lên dữ liệu hợp lệ (VD: Cân nặng không thể âm)
    def validate_weight(self, value):
        if value < 0:
            raise serializers.ValidationError("Cân nặng không thể là số âm.")
        return value

    def validate_spo2(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError("Chỉ số SpO2 phải nằm trong khoảng 0 - 100%.")
        return value