from rest_framework import serializers
from django.utils import timezone
from datetime import datetime, date
from .models import (
    Medication, MedicationSchedule, MedicationIntake,
    MedicationComment, MedicationReminder
)


class MedicationScheduleSerializer(serializers.ModelSerializer):
    """
    Serializer for MedicationSchedule
    """
    time_formatted = serializers.SerializerMethodField()
    days_display = serializers.SerializerMethodField()
    
    class Meta:
        model = MedicationSchedule
        fields = [
            'id', 'scheduled_time', 'time_formatted', 'dosage',
            'days_of_week', 'days_display', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_time_formatted(self, obj):
        return obj.scheduled_time.strftime('%I:%M %p')
    
    def get_days_display(self, obj):
        if not obj.days_of_week:
            return "Every day"
        
        days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        return ", ".join([days[d] for d in obj.days_of_week])


class MedicationCommentSerializer(serializers.ModelSerializer):
    """
    Serializer for MedicationComment
    """
    time_ago = serializers.SerializerMethodField()
    
    class Meta:
        model = MedicationComment
        fields = [
            'id', 'comment_type', 'content', 'severity',
            'effectiveness', 'time_ago', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_time_ago(self, obj):
        delta = timezone.now() - obj.created_at
        if delta.days > 0:
            return f"{delta.days} days ago"
        elif delta.seconds > 3600:
            return f"{delta.seconds // 3600} hours ago"
        elif delta.seconds > 60:
            return f"{delta.seconds // 60} minutes ago"
        else:
            return "Just now"


class MedicationIntakeSerializer(serializers.ModelSerializer):
    """
    Serializer for MedicationIntake
    """
    scheduled_time_formatted = serializers.SerializerMethodField()
    taken_at_formatted = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = MedicationIntake
        fields = [
            'id', 'scheduled_time', 'scheduled_time_formatted',
            'taken_at', 'taken_at_formatted', 'status', 'status_display',
            'dosage_taken', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_scheduled_time_formatted(self, obj):
        return obj.scheduled_time.strftime('%Y-%m-%d %I:%M %p')
    
    def get_taken_at_formatted(self, obj):
        if obj.taken_at:
            return obj.taken_at.strftime('%Y-%m-%d %I:%M %p')
        return None


class MedicationListSerializer(serializers.ModelSerializer):
    """
    Serializer for Medication list view
    """
    frequency_display = serializers.CharField(
        source='get_frequency_display',
        read_only=True
    )
    status_display = serializers.CharField(
        source='get_status_display',
        read_only=True
    )
    is_active = serializers.BooleanField(read_only=True)
    schedule_count = serializers.SerializerMethodField()
    adherence_rate = serializers.SerializerMethodField()
    
    class Meta:
        model = Medication
        fields = [
            'id', 'name', 'generic_name', 'dosage', 'dosage_form',
            'frequency', 'frequency_display', 'route',
            'start_date', 'end_date', 'status', 'status_display',
            'is_active', 'refills_remaining', 'prescribed_by',
            'schedule_count', 'adherence_rate', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_schedule_count(self, obj):
        return obj.schedules.filter(is_active=True).count()
    
    def get_adherence_rate(self, obj):
        intakes = obj.intakes.all()
        if not intakes.exists():
            return None
        
        total = intakes.count()
        taken = intakes.filter(status='TAKEN').count()
        return round((taken / total) * 100, 2)


class MedicationDetailSerializer(serializers.ModelSerializer):
    """
    Detailed serializer for Medication
    """
    frequency_display = serializers.CharField(
        source='get_frequency_display',
        read_only=True
    )
    status_display = serializers.CharField(
        source='get_status_display',
        read_only=True
    )
    dosage_form_display = serializers.CharField(
        source='get_dosage_form_display',
        read_only=True
    )
    route_display = serializers.CharField(
        source='get_route_display',
        read_only=True
    )
    is_active = serializers.BooleanField(read_only=True)
    duration_days = serializers.IntegerField(read_only=True)
    
    schedules = MedicationScheduleSerializer(
        many=True,
        read_only=True,
        source='schedules'
    )
    intakes = MedicationIntakeSerializer(
        many=True,
        read_only=True
    )
    comments = MedicationCommentSerializer(
        many=True,
        read_only=True
    )
    
    class Meta:
        model = Medication
        fields = '__all__'
        read_only_fields = ['id', 'patient', 'created_at', 'updated_at']


class MedicationCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and updating medications
    """
    class Meta:
        model = Medication
        fields = [
            'name', 'generic_name', 'dosage', 'dosage_form',
            'frequency', 'frequency_other', 'route',
            'prescribed_date', 'start_date', 'end_date',
            'specific_times', 'prescribed_by', 'prescription_number',
            'pharmacy_name', 'pharmacy_phone', 'refills_remaining',
            'quantity', 'instructions', 'reason', 'status'
        ]
    
    def validate(self, data):
        """
        Validate medication data
        """
        # Validate dates
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        
        if start_date and end_date and end_date < start_date:
            raise serializers.ValidationError({
                'end_date': 'End date cannot be before start date.'
            })
        
        # Validate frequency
        frequency = data.get('frequency')
        frequency_other = data.get('frequency_other')
        
        if frequency == 'OTHER' and not frequency_other:
            raise serializers.ValidationError({
                'frequency_other': 'Please specify frequency when "Other" is selected.'
            })
        
        # Validate specific times
        if frequency == 'SPECIFIC':
            specific_times = data.get('specific_times', [])
            if not specific_times:
                raise serializers.ValidationError({
                    'specific_times': 'Please specify times for medication.'
                })
        
        return data
    
    def create(self, validated_data):
        validated_data['patient'] = self.context['request'].user
        return super().create(validated_data)


class ScheduleCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating medication schedules
    """
    class Meta:
        model = MedicationSchedule
        fields = ['scheduled_time', 'dosage', 'days_of_week', 'is_active']
    
    def validate(self, data):
        medication_id = self.context.get('medication_id')
        if medication_id:
            # Check if schedule already exists for this time
            existing = MedicationSchedule.objects.filter(
                medication_id=medication_id,
                scheduled_time=data['scheduled_time']
            ).exists()
            
            if existing:
                raise serializers.ValidationError({
                    'scheduled_time': 'A schedule already exists for this time.'
                })
        
        return data


class IntakeCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for recording medication intake
    """
    class Meta:
        model = MedicationIntake
        fields = ['scheduled_time', 'taken_at', 'status', 'dosage_taken']
    
    def validate(self, data):
        if data.get('taken_at') and data.get('status') == 'MISSED':
            raise serializers.ValidationError({
                'status': 'Cannot mark as missed if taken_at is provided.'
            })
        
        if not data.get('taken_at') and data.get('status') == 'TAKEN':
            data['taken_at'] = timezone.now()
        
        return data


class CommentCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating medication comments
    """
    class Meta:
        model = MedicationComment
        fields = ['comment_type', 'content', 'severity', 'effectiveness']
    
    def validate(self, data):
        comment_type = data.get('comment_type')
        
        if comment_type == 'SIDE_EFFECT' and not data.get('severity'):
            raise serializers.ValidationError({
                'severity': 'Severity is required for side effects.'
            })
        
        if comment_type == 'EFFECTIVENESS' and not data.get('effectiveness'):
            raise serializers.ValidationError({
                'effectiveness': 'Effectiveness rating is required.'
            })
        
        return data


class IntakeMarkTakenSerializer(serializers.Serializer):
    """
    Serializer for marking intake as taken
    """
    taken_at = serializers.DateTimeField(required=False)
    dosage_taken = serializers.CharField(required=False, allow_blank=True)
    notes = serializers.CharField(required=False, allow_blank=True)


class AdherenceStatsSerializer(serializers.Serializer):
    """
    Serializer for adherence statistics
    """
    total_scheduled = serializers.IntegerField()
    total_taken = serializers.IntegerField()
    total_missed = serializers.IntegerField()
    adherence_rate = serializers.FloatField()
    by_medication = serializers.DictField()
    weekly_trend = serializers.ListField()