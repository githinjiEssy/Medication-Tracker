from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.conf import settings
from datetime import date


class Medication(models.Model):
    """
    Model for tracking patient medications
    """
    FREQUENCY_CHOICES = [
        ('ONCE', 'Once daily'),
        ('TWICE', 'Twice daily'),
        ('THRICE', 'Three times daily'),
        ('FOUR', 'Four times daily'),
        ('EVERY_OTHER', 'Every other day'),
        ('WEEKLY', 'Once weekly'),
        ('BIWEEKLY', 'Twice weekly'),
        ('MONTHLY', 'Once monthly'),
        ('AS_NEEDED', 'As needed'),
        ('SPECIFIC', 'Specific times'),
        ('OTHER', 'Other')
    ]
    
    DOSAGE_FORM_CHOICES = [
        ('TABLET', 'Tablet'),
        ('CAPSULE', 'Capsule'),
        ('LIQUID', 'Liquid'),
        ('INJECTION', 'Injection'),
        ('INHALER', 'Inhaler'),
        ('CREAM', 'Cream/Ointment'),
        ('DROPS', 'Drops'),
        ('PATCH', 'Patch'),
        ('OTHER', 'Other')
    ]
    
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('DISCONTINUED', 'Discontinued'),
        ('PAUSED', 'Paused'),
        ('COMPLETED', 'Completed')
    ]
    
    ROUTE_CHOICES = [
        ('ORAL', 'Oral'),
        ('TOPICAL', 'Topical'),
        ('INHALATION', 'Inhalation'),
        ('INJECTION', 'Injection'),
        ('SUBLINGUAL', 'Sublingual'),
        ('RECTAL', 'Rectal'),
        ('OPHTHALMIC', 'Ophthalmic'),
        ('OTIC', 'Otic'),
        ('OTHER', 'Other')
    ]
    
    # Relationships
    patient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='medications',
        help_text="Patient taking this medication"
    )
    
    # Basic Information
    name = models.CharField(
        max_length=200,
        help_text="Medication name (brand or generic)"
    )
    
    generic_name = models.CharField(
        max_length=200,
        blank=True,
        help_text="Generic name if applicable"
    )
    
    dosage = models.CharField(
        max_length=100,
        help_text="Dosage (e.g., 10mg, 5ml)"
    )
    
    dosage_form = models.CharField(
        max_length=20,
        choices=DOSAGE_FORM_CHOICES,
        default='TABLET',
        help_text="Form of medication"
    )
    
    frequency = models.CharField(
        max_length=20,
        choices=FREQUENCY_CHOICES,
        help_text="How often to take"
    )
    
    frequency_other = models.CharField(
        max_length=100,
        blank=True,
        help_text="If frequency is 'OTHER', specify here"
    )
    
    route = models.CharField(
        max_length=20,
        choices=ROUTE_CHOICES,
        default='ORAL',
        help_text="Route of administration"
    )
    
    # Schedule Information
    prescribed_date = models.DateField(
        help_text="Date medication was prescribed"
    )
    
    start_date = models.DateField(
        help_text="Date to start taking medication"
    )
    
    end_date = models.DateField(
        null=True,
        blank=True,
        help_text="Date to stop taking medication (if applicable)"
    )
    
    # Specific times for medication (if frequency is SPECIFIC)
    specific_times = models.JSONField(
        default=list,
        blank=True,
        help_text="List of specific times for medication (e.g., ['09:00', '21:00'])"
    )
    
    # Prescriber Information
    prescribed_by = models.CharField(
        max_length=200,
        blank=True,
        help_text="Doctor who prescribed this medication"
    )
    
    prescription_number = models.CharField(
        max_length=100,
        blank=True,
        help_text="Prescription number"
    )
    
    # Pharmacy Information
    pharmacy_name = models.CharField(
        max_length=200,
        blank=True,
        help_text="Pharmacy where medication was filled"
    )
    
    pharmacy_phone = models.CharField(
        max_length=20,
        blank=True,
        help_text="Pharmacy phone number"
    )
    
    # Prescription Details
    refills_remaining = models.PositiveIntegerField(
        default=0,
        help_text="Number of refills remaining"
    )
    
    quantity = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Total quantity prescribed"
    )
    
    # Instructions and Notes
    instructions = models.TextField(
        blank=True,
        help_text="Special instructions (take with food, etc.)"
    )
    
    reason = models.CharField(
        max_length=200,
        blank=True,
        help_text="Reason for taking this medication"
    )
    
    # Status
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='ACTIVE',
        help_text="Current status of medication"
    )
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['patient', 'status']),
            models.Index(fields=['start_date']),
            models.Index(fields=['name']),
        ]
    
    def __str__(self):
        return f"{self.name} - {self.dosage}"
    
    @property
    def is_active(self):
        """Check if medication is currently active"""
        today = date.today()
        return (
            self.status == 'ACTIVE' and
            self.start_date <= today and
            (self.end_date is None or self.end_date >= today)
        )
    
    @property
    def duration_days(self):
        """Calculate total duration in days"""
        if self.end_date and self.start_date:
            return (self.end_date - self.start_date).days
        return None


class MedicationSchedule(models.Model):
    """
    Model for scheduling when to take medication
    """
    WEEKDAY_CHOICES = [
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    ]
    
    medication = models.ForeignKey(
        Medication,
        on_delete=models.CASCADE,
        related_name='schedules'
    )
    
    scheduled_time = models.TimeField(
        help_text="Time to take medication"
    )
    
    dosage = models.CharField(
        max_length=100,
        help_text="Dosage for this specific time"
    )
    
    days_of_week = models.JSONField(
        default=list,
        blank=True,
        help_text="List of days to take (0=Monday to 6=Sunday)"
    )
    
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this schedule is active"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['scheduled_time']
        unique_together = ['medication', 'scheduled_time']
    
    def __str__(self):
        return f"{self.medication.name} at {self.scheduled_time}"


class MedicationIntake(models.Model):
    """
    Model for tracking actual medication intake
    """
    STATUS_CHOICES = [
        ('TAKEN', 'Taken'),
        ('MISSED', 'Missed'),
        ('SKIPPED', 'Skipped'),
        ('LATE', 'Late'),
    ]
    
    medication = models.ForeignKey(
        Medication,
        on_delete=models.CASCADE,
        related_name='intakes'
    )
    
    schedule = models.ForeignKey(
        MedicationSchedule,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='intakes'
    )
    
    scheduled_time = models.DateTimeField(
        help_text="When the medication was supposed to be taken"
    )
    
    taken_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When medication was actually taken"
    )
    
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='MISSED'
    )
    
    dosage_taken = models.CharField(
        max_length=100,
        blank=True,
        help_text="Actual dosage taken (if different)"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-scheduled_time']
        indexes = [
            models.Index(fields=['medication', 'scheduled_time']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"{self.medication.name} - {self.scheduled_time}"


class MedicationComment(models.Model):
    """
    Model for tracking effects and comments about medication
    """
    medication = models.ForeignKey(
        Medication,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    
    intake = models.ForeignKey(
        MedicationIntake,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='comments'
    )
    
    comment_type = models.CharField(
        max_length=20,
        choices=[
            ('SIDE_EFFECT', 'Side Effect'),
            ('EFFECTIVENESS', 'Effectiveness'),
            ('NOTE', 'General Note'),
            ('QUESTION', 'Question for Doctor'),
            ('CONCERN', 'Concern')
        ],
        default='NOTE'
    )
    
    content = models.TextField(
        help_text="Comment content"
    )
    
    severity = models.IntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(10)],
        help_text="Severity rating (1-10) for side effects"
    )
    
    effectiveness = models.IntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(10)],
        help_text="Effectiveness rating (1-10)"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Comment on {self.medication.name} - {self.created_at.date()}"


class MedicationReminder(models.Model):
    """
    Model for push notifications/reminders
    """
    medication = models.ForeignKey(
        Medication,
        on_delete=models.CASCADE,
        related_name='reminders'
    )
    
    schedule = models.ForeignKey(
        MedicationSchedule,
        on_delete=models.CASCADE,
        related_name='reminders'
    )
    
    reminder_time = models.DateTimeField(
        help_text="When to send reminder"
    )
    
    sent_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When reminder was sent"
    )
    
    is_sent = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['reminder_time']
    
    def __str__(self):
        return f"Reminder for {self.medication.name} at {self.reminder_time}"