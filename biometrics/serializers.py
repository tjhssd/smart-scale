from rest_framework import serializers
from django.contrib.auth.models import User
from .models import HealthRecord, Device

# Serializer Đăng ký tài khoản
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'email')
        extra_kwargs = {'password': {'write_only': True}}
        
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

# Serializer Quản lý thiết bị
class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = ['id', 'name', 'mac_address', 'is_active', 'registered_at']
        # User sẽ được tự động gán trong views, không cho phép gửi từ client

# Serializer Hiển thị lịch sử (Dành cho React)
class HealthRecordSerializer(serializers.ModelSerializer):
    device_name = serializers.CharField(source='device.name', read_only=True)
    device_mac = serializers.CharField(source='device.mac_address', read_only=True)
    
    class Meta:
        model = HealthRecord
        fields = ['id', 'user', 'device', 'device_name', 'device_mac', 'weight', 'height', 'temperature', 'heart_rate', 'spo2', 'created_at']

# Serializer Hứng dữ liệu từ phần cứng (ESP32)
class DeviceUploadSerializer(serializers.Serializer):
    mac_address = serializers.CharField(max_length=50)
    weight = serializers.FloatField()
    height = serializers.FloatField()
    temperature = serializers.FloatField()
    heart_rate = serializers.IntegerField()
    spo2 = serializers.IntegerField()

    def create(self, validated_data):
        mac_address = validated_data.pop('mac_address')
        # Tìm thiết bị, nếu không có thì từ chối gói dữ liệu
        try:
            device = Device.objects.get(mac_address=mac_address, is_active=True)
        except Device.DoesNotExist:
            raise serializers.ValidationError({"mac_address": "Mã MAC không hợp lệ"})
        
        # Tự động lưu số đo cho đúng chủ nhân của cái cân đó
        record = HealthRecord.objects.create(
            user=device.user,
            device=device,
            **validated_data
        )
        return record