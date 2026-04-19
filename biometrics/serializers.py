from rest_framework import serializers
from .models import HealthRecord

class HealthRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthRecord
        fields = '__all__' # Lấy tất cả các cột trong db