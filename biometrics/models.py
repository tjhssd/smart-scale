import uuid
from django.db import models
from django.contrib.auth.models import User
from rest_framework import serializers
from django.db.models.signals import post_save
from django.dispatch import receiver

# --- BẢNG 1: Quản lý thiết bị ---
class Device(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='devices')
    mac_address = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    registered_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.mac_address})"

# --- BẢNG 2: Lịch sử đo lường (Lưu trữ chính thức) ---
class HealthRecord(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='records', null=True, blank=True)
    
    # Toàn bộ 6 chỉ số sức khỏe
    weight = models.FloatField()
    height = models.FloatField()
    bmi = models.FloatField()
    temperature = models.FloatField()
    heart_rate = models.IntegerField()
    spo2 = models.IntegerField()
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.weight}kg - {self.heart_rate}bpm"

# --- BẢNG 3: Phiên đo lường tạm thời (Dành cho quét QR) ---
class MeasurementSession(models.Model):
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    mac_address = models.CharField(max_length=50)
    
    # Dữ liệu đo đạc tạm thời từ ESP32
    weight = models.FloatField()
    height = models.FloatField()
    bmi = models.FloatField()
    temperature = models.FloatField()
    heart_rate = models.IntegerField()
    spo2 = models.IntegerField()
    
    # Quản lý trạng thái lưu
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    is_saved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        status = "Đã lưu" if self.is_saved else "Chưa lưu"
        return f"Session: {self.token} | {self.weight}kg | Trạng thái: {status}"
    
class UserProfile(models.Model):
    GENDER_CHOICES = [
        ('Nam', 'Nam'),
        ('Nữ', 'Nữ'),
        ('Khác', 'Khác'),
    ]
    # Kết nối 1-1 với bảng User mặc định của Django
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default='Nam')
    dob = models.DateField(blank=True, null=True)
    default_height = models.FloatField(blank=True, null=True)
    target_weight = models.FloatField(blank=True, null=True)

    def __str__(self):
        return f"Hồ sơ của {self.user.username}"

# --- TỰ ĐỘNG TẠO PROFILE KHI ĐĂNG KÝ TÀI KHOẢN ---
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    if hasattr(instance, 'profile'):
        instance.profile.save()