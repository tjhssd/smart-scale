from django.db import models

class HealthRecord(models.Model):
    # Định danh thiết bị (phòng trường hợp sau này có nhiều cân)
    device_id = models.CharField(max_length=50, default="SCALE_01")
    
    # Các chỉ số đo đạc
    weight = models.FloatField(verbose_name="Cân nặng (kg)")
    height = models.FloatField(verbose_name="Chiều cao (cm)")
    temperature = models.FloatField(verbose_name="Nhiệt độ (°C)")
    heart_rate = models.IntegerField(verbose_name="Nhịp tim (bpm)")
    spo2 = models.IntegerField(verbose_name="Nồng độ Oxy (%)")
    
    # Thời gian đo (tự động lưu lúc tạo)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Record {self.id} - {self.device_id}"