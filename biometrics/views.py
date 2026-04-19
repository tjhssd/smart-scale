from rest_framework import viewsets, permissions
from .models import HealthRecord
from .serializers import HealthRecordSerializer

class HealthRecordViewSet(viewsets.ModelViewSet):
    queryset = HealthRecord.objects.all().order_by('-created_at')
    serializer_class = HealthRecordSerializer
    # Cho phép xem dữ liệu công khai không cần login
    permission_classes = [permissions.AllowAny]