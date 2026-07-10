from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Device, HealthRecord, MeasurementSession, UserProfile

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

class UserProfileSerializer(serializers.ModelSerializer):
    fullName = serializers.CharField(source='full_name', allow_blank=True, required=False)
    defaultHeight = serializers.FloatField(source='default_height', required=False, allow_null=True)
    targetWeight = serializers.FloatField(source='target_weight', required=False, allow_null=True)

    class Meta:
        model = UserProfile
        fields = ['fullName', 'phone', 'gender', 'dob', 'defaultHeight', 'targetWeight']

class ChangePasswordSerializer(serializers.Serializer):
    oldPassword = serializers.CharField(required=True)
    newPassword = serializers.CharField(required=True)


class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = '__all__'
        read_only_fields = ('user', 'registered_at')


class HealthRecordSerializer(serializers.ModelSerializer):
    device_name = serializers.CharField(source='device.name', read_only=True, default="Không xác định")
    device_mac = serializers.CharField(source='device.mac_address', read_only=True, default="N/A")
    
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
        return obj.created_at.strftime("%d/%m/%Y %H:%M")


class DeviceUploadSerializer(serializers.Serializer):
    mac_address = serializers.CharField(max_length=50)
    weight = serializers.FloatField()
    height = serializers.FloatField()
    bmi = serializers.FloatField()
    temperature = serializers.FloatField()
    heart_rate = serializers.IntegerField()
    spo2 = serializers.IntegerField()

    def validate_weight(self, value):
        if value < 0:
            raise serializers.ValidationError("Cân nặng không thể là số âm.")
        return value

    def validate_spo2(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError("Chỉ số SpO2 phải nằm trong khoảng 0 - 100%.")
        return value

class MeasurementSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeasurementSession
        exclude = ['is_saved']