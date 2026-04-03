from celery import shared_task
from django.utils import timezone
from .models import MedicationReminder, Notification

@shared_task
def check_due_reminders():
    """
    Finds all reminders that are due and marks them as sent.
    
    """
    now = timezone.now()
    
    # Find reminders where the time is in the past, and we haven't sent them yet
    due_reminders = MedicationReminder.objects.filter(
        reminder_time__lte=now,
        is_sent=False
    ).select_related('medication', 'medication__patient', 'schedule')
    
    count = 0
    for reminder in due_reminders:
        #create the in-app notification
        Notification.objects.create(
            patient=reminder.medication.patient,
            medication = reminder.medication,
            title = "Time to take your medication",
            message = f"It's time to take your medication: {reminder.medication.name}({reminder.medication.dosage})."
        )
        
        # Mark as sent so we don't spam the user every minute
        reminder.is_sent = True
        reminder.sent_at = now
        reminder.save()
        count += 1
        
    return f"Processed and generated {count} notifications"