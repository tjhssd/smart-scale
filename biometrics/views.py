from rest_framework import viewsets, permissions
from .models import HealthRecord
from .serializers import HealthRecordSerializer

class HealthRecordViewSet(viewsets.ModelViewSet):
    queryset = HealthRecord.objects.all().order_by('-created_at')
    serializer_class = HealthRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
   
    def get_queryset(self):
        # CHỈ lấy bản ghi của người dùng đang thực hiện request
        return HealthRecord.objects.filter(user=self.request.user).order_by('-created_at')
    
    def perform_create(self, serializer):
        # Tự động gán user hiện tại khi lưu bản ghi mới
        serializer.save(user=self.request.user)