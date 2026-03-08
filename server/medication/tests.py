from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from datetime import datetime, timedelta, date, time
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import (
    Medication, MedicationSchedule, MedicationIntake,
    MedicationComment, MedicationReminder
)

User = get_user_model()


class MedicationModelTests(TestCase):
    """Test Medication model"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        
        self.medication = Medication.objects.create(
            patient=self.user,
            name='Test Med',
            dosage='10mg',
            frequency='ONCE',
            dosage_form='TABLET',
            route='ORAL',
            prescribed_date=date.today(),
            start_date=date.today(),
            end_date=date.today() + timedelta(days=10),
            status='ACTIVE'
        )
    
    def test_medication_creation(self):
        """Test medication creation"""
        self.assertEqual(self.medication.name, 'Test Med')
        self.assertEqual(self.medication.patient, self.user)
        self.assertEqual(str(self.medication), 'Test Med - 10mg')
    
    def test_is_active_property(self):
        """Test is_active property"""
        # Active medication
        self.assertTrue(self.medication.is_active)
        
        # Not started yet
        self.medication.start_date = date.today() + timedelta(days=1)
        self.medication.save()
        self.assertFalse(self.medication.is_active)
        
        # Expired
        self.medication.start_date = date.today() - timedelta(days=20)
        self.medication.end_date = date.today() - timedelta(days=10)
        self.medication.save()
        self.assertFalse(self.medication.is_active)
        
        # Discontinued
        self.medication.status = 'DISCONTINUED'
        self.medication.save()
        self.assertFalse(self.medication.is_active)
    
    def test_duration_days_property(self):
        """Test duration_days property"""
        self.assertEqual(self.medication.duration_days, 10)
        
        # No end date
        self.medication.end_date = None
        self.medication.save()
        self.assertIsNone(self.medication.duration_days)


class MedicationAPITests(APITestCase):
    """Test Medication API endpoints"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        
        self.medication = Medication.objects.create(
            patient=self.user,
            name='Test Med',
            dosage='10mg',
            frequency='ONCE',
            dosage_form='TABLET',
            route='ORAL',
            prescribed_date=date.today(),
            start_date=date.today(),
            status='ACTIVE'
        )
        
        self.list_url = reverse('medication-list')
        self.detail_url = reverse('medication-detail', args=[self.medication.id])
    
    def test_list_medications(self):
        """Test listing medications"""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
    
    def test_create_medication(self):
        """Test creating medication"""
        data = {
            'name': 'New Med',
            'dosage': '20mg',
            'frequency': 'TWICE',
            'dosage_form': 'CAPSULE',
            'route': 'ORAL',
            'prescribed_date': date.today().isoformat(),
            'start_date': date.today().isoformat(),
            'status': 'ACTIVE'
        }
        
        response = self.client.post(self.list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verify created
        self.assertEqual(Medication.objects.count(), 2)
        new_med = Medication.objects.get(name='New Med')
        self.assertEqual(new_med.patient, self.user)
    
    def test_retrieve_medication(self):
        """Test retrieving medication details"""
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Med')
        self.assertIn('schedules', response.data)
        self.assertIn('intakes', response.data)
        self.assertIn('comments', response.data)
    
    def test_update_medication(self):
        """Test updating medication"""
        data = {'name': 'Updated Med'}
        response = self.client.patch(self.detail_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.medication.refresh_from_db()
        self.assertEqual(self.medication.name, 'Updated Med')
    
    def test_delete_medication(self):
        """Test deleting medication"""
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Medication.objects.count(), 0)
    
    def test_add_schedule(self):
        """Test adding schedule to medication"""
        url = reverse('medication-add-schedule', args=[self.medication.id])
        data = {
            'scheduled_time': '09:00:00',
            'dosage': '10mg',
            'days_of_week': [0, 1, 2, 3, 4]  # Weekdays
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verify schedule created
        self.assertEqual(self.medication.schedules.count(), 1)
        schedule = self.medication.schedules.first()
        self.assertEqual(str(schedule.scheduled_time), '09:00:00')
    
    def test_add_comment(self):
        """Test adding comment to medication"""
        url = reverse('medication-add-comment', args=[self.medication.id])
        data = {
            'comment_type': 'NOTE',
            'content': 'Feeling better today'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verify comment created
        self.assertEqual(self.medication.comments.count(), 1)
        comment = self.medication.comments.first()
        self.assertEqual(comment.content, 'Feeling better today')
    
    def test_add_side_effect_comment(self):
        """Test adding side effect comment"""
        url = reverse('medication-add-comment', args=[self.medication.id])
        data = {
            'comment_type': 'SIDE_EFFECT',
            'content': 'Mild headache',
            'severity': 3
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        comment = self.medication.comments.first()
        self.assertEqual(comment.comment_type, 'SIDE_EFFECT')
        self.assertEqual(comment.severity, 3)
    
    def test_record_intake(self):
        """Test recording intake"""
        url = reverse('medication-record-intake', args=[self.medication.id])
        now = timezone.now()
        data = {
            'scheduled_time': now.isoformat(),
            'status': 'TAKEN',
            'dosage_taken': '10mg'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verify intake created
        self.assertEqual(self.medication.intakes.count(), 1)
        intake = self.medication.intakes.first()
        self.assertEqual(intake.status, 'TAKEN')
    
    def test_mark_taken(self):
        """Test mark medication as taken"""
        url = reverse('medication-mark-taken', args=[self.medication.id])
        data = {
            'dosage_taken': '10mg',
            'notes': 'Took with food'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify intake created
        self.assertEqual(self.medication.intakes.count(), 1)
        
        # Verify comment created from notes
        self.assertEqual(self.medication.comments.count(), 1)
        comment = self.medication.comments.first()
        self.assertEqual(comment.content, 'Took with food')
    
    def test_adherence_stats(self):
        """Test adherence statistics"""
        # Create some intakes
        now = timezone.now()
        for i in range(5):
            scheduled = now - timedelta(days=i)
            taken = scheduled if i < 3 else None
            MedicationIntake.objects.create(
                medication=self.medication,
                scheduled_time=scheduled,
                taken_at=taken,
                status='TAKEN' if taken else 'MISSED'
            )
        
        url = reverse('medication-adherence', args=[self.medication.id])
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_scheduled'], 5)
        self.assertEqual(response.data['total_taken'], 3)
        self.assertEqual(response.data['total_missed'], 2)
        self.assertEqual(response.data['adherence_rate'], 60.0)
        self.assertEqual(len(response.data['daily_trend']), 30)  # Default 30 days


class ScheduleAPITests(APITestCase):
    """Test Schedule API endpoints"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        
        self.medication = Medication.objects.create(
            patient=self.user,
            name='Test Med',
            dosage='10mg',
            frequency='ONCE',
            dosage_form='TABLET',
            route='ORAL',
            prescribed_date=date.today(),
            start_date=date.today(),
            status='ACTIVE'
        )
        
        self.schedule = MedicationSchedule.objects.create(
            medication=self.medication,
            scheduled_time=time(9, 0),
            dosage='10mg',
            days_of_week=[0, 1, 2, 3, 4, 5, 6]
        )
        
        self.list_url = reverse('schedule-list')
        self.detail_url = reverse('schedule-detail', args=[self.schedule.id])
    
    def test_list_schedules(self):
        """Test listing schedules"""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
    
    def test_update_schedule(self):
        """Test updating schedule"""
        data = {
            'scheduled_time': '10:00:00',
            'dosage': '20mg'
        }
        response = self.client.patch(self.detail_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.schedule.refresh_from_db()
        self.assertEqual(str(self.schedule.scheduled_time), '10:00:00')
        self.assertEqual(self.schedule.dosage, '20mg')
    
    def test_delete_schedule(self):
        """Test deleting schedule"""
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(MedicationSchedule.objects.count(), 0)


class IntakeAPITests(APITestCase):
    """Test Intake API endpoints"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        
        self.medication = Medication.objects.create(
            patient=self.user,
            name='Test Med',
            dosage='10mg',
            frequency='ONCE',
            dosage_form='TABLET',
            route='ORAL',
            prescribed_date=date.today(),
            start_date=date.today(),
            status='ACTIVE'
        )
        
        self.intake = MedicationIntake.objects.create(
            medication=self.medication,
            scheduled_time=timezone.now(),
            status='MISSED'
        )
        
        self.list_url = reverse('intake-list')
        self.detail_url = reverse('intake-detail', args=[self.intake.id])
    
    def test_list_intakes(self):
        """Test listing intakes"""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
    
    def test_filter_intakes_by_date(self):
        """Test filtering intakes by date"""
        today = date.today().isoformat()
        response = self.client.get(self.list_url, {'date': today})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
    
    def test_add_comment_to_intake(self):
        """Test adding comment to intake"""
        url = reverse('intake-add-comment', args=[self.intake.id])
        data = {
            'comment_type': 'NOTE',
            'content': 'Felt dizzy after taking'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verify comment created
        comment = MedicationComment.objects.get(intake=self.intake)
        self.assertEqual(comment.content, 'Felt dizzy after taking')


class DashboardTests(APITestCase):
    """Test Dashboard endpoints"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        
        # Create medication
        self.medication = Medication.objects.create(
            patient=self.user,
            name='Test Med',
            dosage='10mg',
            frequency='ONCE',
            dosage_form='TABLET',
            route='ORAL',
            prescribed_date=date.today(),
            start_date=date.today(),
            status='ACTIVE',
            refills_remaining=1
        )
        
        # Create schedule
        self.schedule = MedicationSchedule.objects.create(
            medication=self.medication,
            scheduled_time=time(9, 0),
            dosage='10mg',
            days_of_week=[0, 1, 2, 3, 4, 5, 6]
        )
        
        # Create intake for today
        today = timezone.now()
        self.intake = MedicationIntake.objects.create(
            medication=self.medication,
            scheduled_time=today.replace(hour=9, minute=0, second=0),
            status='MISSED'
        )
        
        # Create comment
        self.comment = MedicationComment.objects.create(
            medication=self.medication,
            comment_type='NOTE',
            content='Test comment'
        )
    
    def test_dashboard(self):
        """Test dashboard endpoint"""
        url = reverse('medication_dashboard')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('summary', response.data)
        self.assertIn('upcoming_intakes', response.data)
        self.assertIn('recent_comments', response.data)
        self.assertIn('low_refills', response.data)
        
        # Verify summary data
        self.assertEqual(response.data['summary']['total_medications'], 1)
        self.assertEqual(response.data['summary']['today_intakes']['total'], 1)
        self.assertEqual(response.data['summary']['today_intakes']['pending'], 1)
        
        # Verify comments
        self.assertEqual(len(response.data['recent_comments']), 1)
        
        # Verify low refills
        self.assertEqual(len(response.data['low_refills']), 1)
    
    def test_today_intakes(self):
        """Test today intakes endpoint"""
        url = reverse('today_intakes')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total'], 1)
        self.assertEqual(response.data['pending'], 1)
        self.assertEqual(len(response.data['intakes']), 1)
    
    def test_upcoming_intakes(self):
        """Test upcoming intakes endpoint"""
        url = reverse('upcoming_intakes')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should include today's pending intake if it's in the future
        if timezone.now().time() < time(9, 0):
            self.assertEqual(len(response.data), 1)
    
    def test_statistics(self):
        """Test statistics endpoint"""
        url = reverse('medication_statistics')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('medications', response.data)
        self.assertIn('intakes', response.data)
        self.assertIn('comments', response.data)
        self.assertIn('refills', response.data)
        
        # Verify medications stats
        self.assertEqual(response.data['medications']['total'], 1)
        self.assertEqual(response.data['medications']['active'], 1)
        
        # Verify refills
        self.assertEqual(response.data['refills']['low_refills'], 1)


class AuthorizationTests(APITestCase):
    """Test authorization controls"""
    
    def setUp(self):
        self.user1 = User.objects.create_user(
            username='user1',
            password='testpass123'
        )
        self.user2 = User.objects.create_user(
            username='user2',
            password='testpass123'
        )
        
        # Create medication for user1
        self.medication = Medication.objects.create(
            patient=self.user1,
            name='User1 Med',
            dosage='10mg',
            frequency='ONCE',
            dosage_form='TABLET',
            route='ORAL',
            prescribed_date=date.today(),
            start_date=date.today(),
            status='ACTIVE'
        )
        
        self.client = APIClient()
    
    def test_user_cannot_access_others_medications(self):
        """Test user cannot access other user's medications"""
        self.client.force_authenticate(user=self.user2)
        
        url = reverse('medication-detail', args=[self.medication.id])
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_user_cannot_modify_others_medications(self):
        """Test user cannot modify other user's medications"""
        self.client.force_authenticate(user=self.user2)
        
        url = reverse('medication-detail', args=[self.medication.id])
        data = {'name': 'Hacked Name'}
        response = self.client.patch(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
        # Verify unchanged
        self.medication.refresh_from_db()
        self.assertEqual(self.medication.name, 'User1 Med')
    
    def test_user_cannot_access_others_schedules(self):
        """Test user cannot access other user's schedules"""
        self.client.force_authenticate(user=self.user2)
        
        schedule = MedicationSchedule.objects.create(
            medication=self.medication,
            scheduled_time=time(9, 0),
            dosage='10mg'
        )
        
        url = reverse('schedule-detail', args=[schedule.id])
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_unauthenticated_access(self):
        """Test unauthenticated users cannot access endpoints"""
        self.client.force_authenticate(user=None)
        
        url = reverse('medication-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)