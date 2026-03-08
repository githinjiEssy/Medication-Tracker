from django.urls import path
from rest_framework_simplejwt.views import TokenVerifyView
from . import views

urlpatterns = [
    # Authentication
    path('register/', views.RegisterView.as_view(), name='auth_register'),
    path('login/', views.LoginView.as_view(), name='auth_login'),
    path('logout/', views.LogoutView.as_view(), name='auth_logout'),
    path('token/refresh/', views.CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # Profile management
    path('profile/', views.ProfileView.as_view(), name='auth_profile'),
    path('change-password/', views.ChangePasswordView.as_view(), name='auth_change_password'),
    path('verify-email/', views.VerifyEmailView.as_view(), name='auth_verify_email'),
    path('verify-phone/', views.VerifyPhoneView.as_view(), name='auth_verify_phone'),
    path('delete-account/', views.DeleteAccountView.as_view(), name='auth_delete_account'),
]