from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken import views as auth_views
from biometrics import views as biometrics_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('biometrics.urls')),
    
    path('api-token-auth/', auth_views.obtain_auth_token),
    
    path('claim-record/<str:token>/', biometrics_views.ClaimMeasurementView.as_view(), name='claim-record')]