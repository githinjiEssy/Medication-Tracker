from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from datetime import date

class User(AbstractUser):
    """
    Custom User model for patients
    """
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]
    
    BLOOD_GROUP_CHOICES = [
        ('A+', 'A+'), ('A-', 'A-'), ('B+', 'B+'), ('B-', 'B-'),
        ('AB+', 'AB+'), ('AB-', 'AB-'), ('O+', 'O+'), ('O-', 'O-'),
        ('UNKNOWN', 'Unknown')
    ]

    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Phone number must be in format: '+999999999'. Up to 15 digits allowed."
    )
    
    phone_number = models.CharField(
        validators=[phone_regex],
        max_length=17,
        blank=True,
        help_text="Contact phone number"
    )
    
    date_of_birth = models.DateField(
        null=True,
        blank=True,
        help_text="Patient's date of birth"
    )
    
    gender = models.CharField(
        max_length=1,
        choices=GENDER_CHOICES,
        blank=True,
        help_text="Gender"
    )
    
    blood_group = models.CharField(
        max_length=10,
        choices=BLOOD_GROUP_CHOICES,
        default='UNKNOWN',
        help_text="Blood group for medical purposes"
    )
    
    emergency_contact_name = models.CharField(
        max_length=100,
        blank=True,
        help_text="Name of emergency contact person"
    )
    
    emergency_contact_phone = models.CharField(
        validators=[phone_regex],
        max_length=17,
        blank=True,
        help_text="Emergency contact phone number"
    )
    
    allergies = models.TextField(
        blank=True,
        help_text="List any known allergies (especially to medications)"
    )
    
    chronic_conditions = models.TextField(
        blank=True,
        help_text="List any chronic medical conditions"
    )
    
    is_email_verified = models.BooleanField(default=False)
    is_phone_verified = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return f"{self.get_full_name() or self.username}"
    
    @property
    def age(self):
        if self.date_of_birth:
            today = date.today()
            return today.year - self.date_of_birth.year - (
                (today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day)
            )
        return None


class BlacklistedToken(models.Model):
    """
    Model for blacklisted JWT tokens
    """
    token = models.TextField(unique=True)
    blacklisted_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blacklisted_tokens')
    
    class Meta:
        verbose_name = 'Blacklisted Token'
        verbose_name_plural = 'Blacklisted Tokens'
    
    def __str__(self):
        return f"Blacklisted token for {self.user.username}"