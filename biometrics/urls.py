from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    HealthRecordViewSet, 
    DeviceViewSet, 
    HardwareUploadView, 
    RegisterView, 
    CustomLoginView,
    AdminStatsView, AdminUserListView, AdminDeviceListView, ToggleUserStatusView
)

# Router tự động tạo link GET/POST/PUT/DELETE cho ViewSet
router = DefaultRouter()
router.register(r'records', HealthRecordViewSet, basename='healthrecord')
router.register(r'devices', DeviceViewSet, basename='device')

urlpatterns = [
    # Nhóm API cho React kéo dữ liệu
    path('', include(router.urls)),
    
    # Nhóm API cho Đăng nhập/Đăng ký
    path('login/', CustomLoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    
    path('hardware-upload/', HardwareUploadView.as_view(), name='hardware-upload'),

    path('admin-api/stats/', AdminStatsView.as_view()),
    path('admin-api/users/', AdminUserListView.as_view()),
    path('admin-api/devices/', AdminDeviceListView.as_view()),
    path('admin-api/users/<int:user_id>/toggle/', ToggleUserStatusView.as_view()),
]