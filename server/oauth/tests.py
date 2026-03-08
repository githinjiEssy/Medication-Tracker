from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, BlacklistedToken

User = get_user_model()


class AuthenticationTests(APITestCase):
    """Test authentication endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('auth_register')
        self.login_url = reverse('auth_login')
        
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'TestPass123!',
            'password2': 'TestPass123!',
            'first_name': 'Test',
            'last_name': 'User',
            'phone_number': '+1234567890',
            'date_of_birth': '1990-01-01',
            'gender': 'M',
            'blood_group': 'O+'
        }
    
    def test_user_registration_data_flow(self):
        """Test user registration data flow"""
        response = self.client.post(self.register_url, self.user_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('user', response.data)
        
        # Verify user created in database
        user = User.objects.get(username='testuser')
        self.assertEqual(user.email, 'test@example.com')
        self.assertEqual(user.first_name, 'Test')
        self.assertEqual(user.phone_number, '+1234567890')
    
    def test_registration_password_mismatch_control_flow(self):
        """Test control flow for password mismatch"""
        self.user_data['password2'] = 'WrongPass123!'
        
        response = self.client.post(self.register_url, self.user_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)
        
        # Verify user not created
        self.assertFalse(User.objects.filter(username='testuser').exists())
    
    def test_user_login_data_flow(self):
        """Test login data flow"""
        # First register user
        self.client.post(self.register_url, self.user_data, format='json')
        
        # Then login
        login_data = {
            'username': 'testuser',
            'password': 'TestPass123!'
        }
        response = self.client.post(self.login_url, login_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('user', response.data)
    
    def test_login_invalid_credentials_control_flow(self):
        """Test control flow for invalid credentials"""
        login_data = {
            'username': 'nonexistent',
            'password': 'wrongpass'
        }
        
        response = self.client.post(self.login_url, login_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('non_field_errors', response.data)


class ProfileTests(APITestCase):
    """Test profile management endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        
        # Create user
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='TestPass123!',
            first_name='Test',
            last_name='User'
        )
        
        # Authenticate
        self.client.force_authenticate(user=self.user)
        
        self.profile_url = reverse('auth_profile')
        self.change_password_url = reverse('auth_change_password')
    
    def test_get_profile_data_flow(self):
        """Test retrieving profile data"""
        response = self.client.get(self.profile_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')
        self.assertEqual(response.data['email'], 'test@example.com')
        self.assertEqual(response.data['first_name'], 'Test')
    
    def test_update_profile_data_flow(self):
        """Test updating profile data"""
        update_data = {
            'first_name': 'Updated',
            'last_name': 'Name',
            'phone_number': '+9876543210'
        }
        
        response = self.client.patch(self.profile_url, update_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user']['first_name'], 'Updated')
        self.assertEqual(response.data['user']['last_name'], 'Name')
        
        # Verify database updated
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, 'Updated')
        self.assertEqual(self.user.phone_number, '+9876543210')
    
    def test_change_password_data_flow(self):
        """Test password change flow"""
        password_data = {
            'old_password': 'TestPass123!',
            'new_password': 'NewPass123!',
            'new_password2': 'NewPass123!'
        }
        
        response = self.client.post(self.change_password_url, password_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)
        self.assertIn('Password changed successfully', response.data['message'])
        
        # Verify can login with new password
        self.client.logout()
        login_data = {
            'username': 'testuser',
            'password': 'NewPass123!'
        }
        login_response = self.client.post(reverse('auth_login'), login_data, format='json')
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
    
    def test_change_password_wrong_old_control_flow(self):
        """Test control flow for wrong old password"""
        password_data = {
            'old_password': 'WrongPass123!',
            'new_password': 'NewPass123!',
            'new_password2': 'NewPass123!'
        }
        
        response = self.client.post(self.change_password_url, password_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('old_password', response.data)


class LogoutTests(APITestCase):
    """Test logout functionality"""
    
    def setUp(self):
        self.client = APIClient()
        
        # Create user
        self.user = User.objects.create_user(
            username='testuser',
            password='TestPass123!'
        )
        
        # Get tokens
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        self.refresh_token = str(refresh)
        
        self.logout_url = reverse('auth_logout')
    
    def test_logout_data_flow(self):
        """Test logout data flow"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        
        logout_data = {
            'refresh': self.refresh_token
        }
        
        response = self.client.post(self.logout_url, logout_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Logout successful')
        
        # Verify token blacklisted
        self.assertTrue(BlacklistedToken.objects.filter(token=self.refresh_token).exists())
    
    def test_logout_invalid_token_control_flow(self):
        """Test control flow for invalid token"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        
        logout_data = {
            'refresh': 'invalid_token'
        }
        
        response = self.client.post(self.logout_url, logout_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)


class AuthorizationTests(APITestCase):
    """Test authorization controls"""
    
    def setUp(self):
        self.client = APIClient()
        
        # Create two users
        self.user1 = User.objects.create_user(
            username='user1',
            password='pass123'
        )
        self.user2 = User.objects.create_user(
            username='user2',
            password='pass123'
        )
    
    def test_unauthenticated_access_control_flow(self):
        """Test control flow for unauthenticated access"""
        profile_url = reverse('auth_profile')
        
        response = self.client.get(profile_url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_user_cannot_access_others_data(self):
        """Test that users cannot access others' data"""
        # Authenticate as user1
        self.client.force_authenticate(user=self.user1)
        
        # Try to access user2's profile (should be their own due to get_object)
        profile_url = reverse('auth_profile')
        response = self.client.get(profile_url)
        
        # Should get user1's data, not user2's
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'user1')