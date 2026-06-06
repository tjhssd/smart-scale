from django.db import models
from django.contrib.auth.models import User

# BẢNG 1: Quản lý thiết bị
class Device(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='devices')
    mac_address = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    registered_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.mac_address})"

# BẢNG 2: Lịch sử đo lường
class HealthRecord(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='records', null=True, blank=True)
    weight = models.FloatField()
    height = models.FloatField()
    temperature = models.FloatField()
    heart_rate = models.IntegerField()
    spo2 = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.weight}kg"