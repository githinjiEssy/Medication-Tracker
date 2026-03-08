from django.contrib import admin
from .models import (
    Medication, MedicationSchedule, MedicationIntake,
    MedicationComment, MedicationReminder
)


class MedicationScheduleInline(admin.TabularInline):
    model = MedicationSchedule
    extra = 1


class MedicationCommentInline(admin.TabularInline):
    model = MedicationComment
    extra = 0
    readonly_fields = ['created_at']


@admin.register(Medication)
class MedicationAdmin(admin.ModelAdmin):
    list_display = ['name', 'patient', 'dosage', 'frequency', 'status', 'start_date', 'end_date', 'is_active']
    list_filter = ['status', 'frequency', 'dosage_form', 'created_at']
    search_fields = ['name', 'generic_name', 'patient__username', 'patient__email']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [MedicationScheduleInline, MedicationCommentInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('patient', 'name', 'generic_name', 'dosage', 'dosage_form')
        }),
        ('Schedule', {
            'fields': ('frequency', 'frequency_other', 'route', 'specific_times')
        }),
        ('Dates', {
            'fields': ('prescribed_date', 'start_date', 'end_date')
        }),
        ('Prescriber & Pharmacy', {
            'fields': ('prescribed_by', 'prescription_number', 'pharmacy_name', 'pharmacy_phone')
        }),
        ('Prescription Details', {
            'fields': ('refills_remaining', 'quantity')
        }),
        ('Instructions', {
            'fields': ('instructions', 'reason')
        }),
        ('Status', {
            'fields': ('status',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at')
        })
    )


@admin.register(MedicationSchedule)
class MedicationScheduleAdmin(admin.ModelAdmin):
    list_display = ['medication', 'scheduled_time', 'dosage', 'is_active']
    list_filter = ['is_active', 'days_of_week']
    search_fields = ['medication__name']


@admin.register(MedicationIntake)
class MedicationIntakeAdmin(admin.ModelAdmin):
    list_display = ['medication', 'scheduled_time', 'taken_at', 'status']
    list_filter = ['status', 'scheduled_time']
    search_fields = ['medication__name']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(MedicationComment)
class MedicationCommentAdmin(admin.ModelAdmin):
    list_display = ['medication', 'comment_type', 'content', 'created_at']
    list_filter = ['comment_type', 'created_at']
    search_fields = ['medication__name', 'content']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(MedicationReminder)
class MedicationReminderAdmin(admin.ModelAdmin):
    list_display = ['medication', 'reminder_time', 'is_sent', 'sent_at']
    list_filter = ['is_sent', 'reminder_time']
    search_fields = ['medication__name']