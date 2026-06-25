from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ChangePasswordView,
    HealthRecordViewSet, 
    DeviceViewSet, 
    HardwareUploadView, 
    ClaimMeasurementView,
    PasswordResetConfirmView,
    PasswordResetRequestView,
    RegisterView, 
    CustomLoginView,
    AdminStatsView, 
    AdminUserListView, 
    AdminDeviceListView, 
    ToggleUserStatusView,
    UserProfileView
)

# Router tự động tạo link GET/POST/PUT/DELETE cho ViewSet
router = DefaultRouter()
router.register(r'records', HealthRecordViewSet, basename='healthrecord')
router.register(r'devices', DeviceViewSet, basename='device')

urlpatterns = [
    # --- Nhóm API cho React kéo dữ liệu ---
    path('', include(router.urls)),
    
    # --- Nhóm API cho Đăng nhập/Đăng ký ---
    path('login/', CustomLoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    
    # --- Nhóm API cho thiết bị ESP32 và Quét QR ---
    path('hardware-upload/', HardwareUploadView.as_view(), name='hardware-upload'),
    path('claim-record/<uuid:token>/', ClaimMeasurementView.as_view(), name='claim-record'),

    # --- Nhóm API cho Quản trị viên (Admin) ---
    path('admin-api/stats/', AdminStatsView.as_view()),
    path('admin-api/users/', AdminUserListView.as_view()),
    path('admin-api/devices/', AdminDeviceListView.as_view()),
    path('admin-api/users/<int:user_id>/toggle/', ToggleUserStatusView.as_view()),
    path('admin/stats/', AdminStatsView.as_view(), name='admin-stats'),
    path('admin/users/', AdminUserListView.as_view(), name='admin-users'),
    path('admin/devices/', AdminDeviceListView.as_view(), name='admin-devices'),
    path('admin/users/<int:user_id>/toggle/', ToggleUserStatusView.as_view(), name='admin-toggle-user'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset'),
    path('password-reset-confirm/<str:uidb64>/<str:token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]