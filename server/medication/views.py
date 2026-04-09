from rest_framework import generics, permissions, status, viewsets, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Q, Count, Avg
from datetime import datetime, timedelta, date, time
from .models import (
    Medication, MedicationSchedule, MedicationIntake,
    MedicationComment, MedicationReminder
)
from .serializers import (
    MedicationListSerializer, MedicationDetailSerializer,
    MedicationCreateUpdateSerializer, MedicationScheduleSerializer,
    ScheduleCreateSerializer, MedicationIntakeSerializer,
    IntakeCreateSerializer, MedicationCommentSerializer,
    CommentCreateSerializer, IntakeMarkTakenSerializer,
    AdherenceStatsSerializer
)
from .models import MedicationNotification

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_unalerted_notifications(request):
    """Get all unalerted notifications for the user"""
    
    now = timezone.now()
    notifications = MedicationNotification.objects.filter(
        patient=request.user, 
        is_alerted=False,
        scheduled_time__lte=now
    )
    data = [{
        'id': n.id,
        'title': n.title,      
        'message': n.message,  
    } for n in notifications]
    
    return Response(data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_notification_alerted(request, id):
    """Mark a notification as alerted"""
    try:
        notification = MedicationNotification.objects.get(id=id, patient=request.user)
        notification.is_alerted = True
        notification.save()
        return Response({'status': 'success'})
    except MedicationNotification.DoesNotExist:
        return Response({'error': 'Notification not found'}, status=404)


class IsOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to access it.
    """
    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'patient'):
            return obj.patient == request.user
        elif hasattr(obj, 'medication'):
            return obj.medication.patient == request.user
        return False


class MedicationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Medication CRUD operations.
    
    Provides:
    - List all medications
    - Create new medication
    - Retrieve medication details
    - Update medication
    - Delete medication
    - Custom actions for schedules, intakes, comments
    """
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'generic_name', 'reason', 'prescribed_by']
    ordering_fields = ['created_at', 'start_date', 'name']
    ordering = ['-created_at']

    def perform_create(self, serializer):
        medication = serializer.save()
        self._sync_specific_times_to_schedule(medication)

    def perform_update(self, serializer):
        medication = serializer.save()
        # Clean up future missed intakes to prevent duplicates if times changed
        MedicationIntake.objects.filter(
            medication=medication,
            scheduled_time__gte=timezone.now(),
            status__in=['PENDING', 'MISSED']
        ).delete()
        
        self._sync_specific_times_to_schedule(medication)

    def _sync_specific_times_to_schedule(self, medication):
        if medication.frequency != 'SPECIFIC' or not medication.specific_times:
            return

        for time_str in medication.specific_times:
            try:
                # FIX: Convert the string "HH:MM" into a Python time object
                # This ensures the database TimeField accepts the value
                if isinstance(time_str, str):
                    parsed_time = datetime.strptime(time_str, "%H:%M").time()
                else:
                    parsed_time = time_str

                # Step 2: Create the MedicationSchedule record
                schedule, created = MedicationSchedule.objects.get_or_create(
                    medication=medication,
                    scheduled_time=parsed_time, # Use the parsed object here
                    defaults={'dosage': medication.dosage, 'is_active': True}
                )

                # Step 3: Generate the 30-day calendar
                existing_intakes = MedicationIntake.objects.filter(
                    medication=medication,
                    scheduled_time__date__gte=date.today()
                ).exists()

                if created or not existing_intakes:self._create_future_intakes(medication, schedule)
                
            except Exception as e:
                print(f"Error syncing schedule for {time_str}: {e}")

    
    # ============original code===============
    
    def get_queryset(self):
        """
        Filter queryset to show only user's medications
        """
        user = self.request.user
        queryset = Medication.objects.filter(patient=user)
        
        # Filter by status
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)
        
        # Filter by active status
        active = self.request.query_params.get('active')
        if active and active.lower() == 'true':
            today = date.today()
            queryset = queryset.filter(
                status='ACTIVE',
                start_date__lte=today
            ).filter(
                Q(end_date__isnull=True) | Q(end_date__gte=today)
            )
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        if start_date:
            queryset = queryset.filter(start_date__gte=start_date)
        
        end_date = self.request.query_params.get('end_date')
        if end_date:
            queryset = queryset.filter(end_date__lte=end_date)
        
        return queryset
    
    def get_serializer_class(self):
        """
        Return different serializers based on action
        """
        if self.action == 'list':
            return MedicationListSerializer
        elif self.action == 'retrieve':
            return MedicationDetailSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return MedicationCreateUpdateSerializer
        return MedicationListSerializer

    @action(detail=True, methods=['post'])
    def sync_existing(self, request, pk=None):
        """
        Manually trigger a sync for an existing medication 
        that has specific_times but no database schedules.
        """
        medication = self.get_object()
        self._sync_specific_times_to_schedule(medication)
        return Response({'status': 'Schedule synced successfully'})
    
    @action(detail=True, methods=['get'])
    def schedules(self, request, pk=None):
        """
        Get all schedules for a medication
        """
        medication = self.get_object()
        schedules = medication.schedules.filter(is_active=True)
        serializer = MedicationScheduleSerializer(schedules, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def add_schedule(self, request, pk=None):
        """
        Add a schedule to a medication
        """
        medication = self.get_object()
        serializer = ScheduleCreateSerializer(
            data=request.data,
            context={'medication_id': medication.id}
        )
        
        if serializer.is_valid():
            schedule = serializer.save(medication=medication)
            
            # Create future intakes based on schedule
            self._create_future_intakes(medication, schedule)
            
            return Response(
                MedicationScheduleSerializer(schedule).data,
                status=status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def intakes(self, request, pk=None):
        """
        Get all intakes for a medication
        """
        medication = self.get_object()
        
        # Filter by date range
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        intakes = medication.intakes.all()
        
        if start_date:
            intakes = intakes.filter(scheduled_time__date__gte=start_date)
        if end_date:
            intakes = intakes.filter(scheduled_time__date__lte=end_date)
        
        # Paginate results
        page = self.paginate_queryset(intakes)
        if page is not None:
            serializer = MedicationIntakeSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = MedicationIntakeSerializer(intakes, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def record_intake(self, request, pk=None):
        """
        Record a medication intake
        """
        medication = self.get_object()
        serializer = IntakeCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            intake = serializer.save(medication=medication)
            
            # Update reminder if exists
            self._update_reminder(medication, intake)
            
            return Response(
                MedicationIntakeSerializer(intake).data,
                status=status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def comments(self, request, pk=None):
        """
        Get all comments for a medication
        """
        medication = self.get_object()
        comment_type = request.query_params.get('type')
        
        comments = medication.comments.all()
        if comment_type:
            comments = comments.filter(comment_type=comment_type)
        
        serializer = MedicationCommentSerializer(comments, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def add_comment(self, request, pk=None):
        """
        Add a comment to a medication
        """
        medication = self.get_object()
        serializer = CommentCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            comment = serializer.save(medication=medication)
            return Response(
                MedicationCommentSerializer(comment).data,
                status=status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def mark_taken(self, request, pk=None):
        """
        Mark medication as taken for current time
        """
        medication = self.get_object()
        serializer = IntakeMarkTakenSerializer(data=request.data)
        
        if serializer.is_valid():
            # Find or create intake for current time
            intake_id = request.data.get('intake_id')
            now = timezone.now()
            # scheduled_time = now.replace(second=0, microsecond=0)

            # Use the status from the serializer, which allows for more flexible logging (e.g., marking as MISSED or LATE if needed)
            new_status = serializer.validated_data.get('status')

            # Use data from serializer, fallback to 'now' or medication defaults
            taken_at = serializer.validated_data.get('taken_at', now)
            dosage_taken = serializer.validated_data.get('dosage_taken', medication.dosage)

            if intake_id:
                # TARGETED LOGGING: Update the exact slot the user clicked (e.g., the 7:00 AM slot)
                intake = get_object_or_404(MedicationIntake, id=intake_id, medication=medication)
                intake.status = new_status
                intake.taken_at = serializer.validated_data.get('taken_at', now)
                intake.dosage_taken = serializer.validated_data.get('dosage_taken', medication.dosage)
                intake.save()
            else:
                # DEFAULT LOGGING: If no specific slot, log for the current time (rounding to nearest minute)
                scheduled_time = now.replace(second=0, microsecond=0)
                intake, created = MedicationIntake.objects.get_or_create(
                    medication=medication,
                    scheduled_time=scheduled_time,
                    defaults={
                        'status': 'TAKEN',
                        'taken_at': serializer.validated_data.get('taken_at', now),
                        'dosage_taken': serializer.validated_data.get('dosage_taken', medication.dosage)
                    }
                )

                if not created:
                    intake.status = 'TAKEN'
                    intake.taken_at = taken_at
                    intake.dosage_taken = dosage_taken
                    intake.save()
            
            # Add comment if notes provided
            if serializer.validated_data.get('notes'):
                MedicationComment.objects.create(
                    medication=medication,
                    intake=intake,
                    comment_type='NOTE',
                    content=serializer.validated_data['notes']
                )
            
            return Response(MedicationIntakeSerializer(intake).data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def adherence(self, request, pk=None):
        """
        Get adherence statistics for a medication
        """
        medication = self.get_object()
        
        # Get date range (default: last 30 days)
        days = int(request.query_params.get('days', 30))
        start_date = timezone.now() - timedelta(days=days)
        
        # filter intakes
        intakes = medication.intakes.filter(scheduled_time__gte=start_date)
        
        # Calculate overall stats
        taken = intakes.filter(status='TAKEN').count()
        missed = intakes.filter(status='MISSED').count()
        late = intakes.filter(status='LATE').count()

        total_evaluated = taken + late + missed
        
        # Calculate daily trend
        trend = []
        for i in range(days):
            day = start_date + timedelta(days=i)
            day_intakes = intakes.filter(
                scheduled_time__date=day.date()
            )
            day_taken = day_intakes.filter(status='TAKEN').count()
            day_missed = day_intakes.filter(status='MISSED').count()
            day_late = day_intakes.filter(status='LATE').count()
            day_total = day_taken + day_late + day_missed
            
            trend.append({
                'date': day.date(),
                'taken': day_taken,
                'total': day_total,
                'missed': day_missed,
                'late': day_late,
                'rate': round(((day_taken + day_late) / day_total * 100) if day_total > 0 else 0, 2)
            })
        
        stats = {
            'total_scheduled': total_evaluated,
            'total_taken': taken,
            'total_missed': missed,
            'total_late': late,
            'adherence_rate': round(((taken + late) / total_evaluated * 100) if total_evaluated > 0 else 0, 2),
            'daily_trend': trend
        }
        
        serializer = AdherenceStatsSerializer(stats)
        return Response(serializer.data)
    
    def _create_future_intakes(self, medication, schedule):
        """
        Create future intakes based on schedule
        """
        # Create intakes for next 30 days
        start_date = max(medication.start_date, date.today())
        end_date = medication.end_date or (date.today() + timedelta(days=30))
        end_date = min(end_date, date.today() + timedelta(days=30))
        
        current_date = start_date
        while current_date <= end_date:
            # Check if this day is in schedule
            weekday = current_date.weekday()
            if not schedule.days_of_week or weekday in schedule.days_of_week:
                scheduled_datetime = datetime.combine(
                    current_date,
                    schedule.scheduled_time
                )
                scheduled_datetime = timezone.make_aware(scheduled_datetime)
                
                intake, created = MedicationIntake.objects.get_or_create(medication=medication,scheduled_time=scheduled_datetime,defaults={'status':'PENDING','dosage_taken':schedule.dosage}
                                                                )
                
                #create notificationwhen intake is created
                if created:
                    MedicationNotification.objects.get_or_create(
                        patient=medication.patient,
                        medication=medication,
                        scheduled_time = scheduled_datetime,
                        defaults={'is_alerted': False}
                    )
                
            
            current_date += timedelta(days=1)
    
    def _update_reminder(self, medication, intake):
        """
        Update reminder when intake is recorded
        """
        try:
            reminder = MedicationReminder.objects.get(
                medication=medication,
                reminder_time=intake.scheduled_time,
                is_sent=False
            )
            reminder.is_sent = True
            reminder.sent_at = timezone.now()
            reminder.save()
        except MedicationReminder.DoesNotExist:
            pass

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """
        Update medication status (ACTIVE, DISCONTINUED, PAUSED, COMPLETED)
        """
        medication = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in ['ACTIVE', 'DISCONTINUED', 'PAUSED', 'COMPLETED']:
            return Response(
                {'error': 'Invalid status value'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        medication.status = new_status
        medication.save()
        
        return Response({
            'status': 'success',
            'medication_id': medication.id,
            'new_status': medication.status,
            'status_display': medication.get_status_display()
        })


class ScheduleViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing medication schedules
    """
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    serializer_class = MedicationScheduleSerializer
    
    def get_queryset(self):
        user = self.request.user
        return MedicationSchedule.objects.filter(
            medication__patient=user
        ).select_related('medication')
    
    def perform_update(self, serializer):
        schedule = serializer.save()
        # Update future intakes when schedule changes
        self._update_future_intakes(schedule)
    
    def perform_destroy(self, instance):
        # Delete future intakes for this schedule
        future_intakes = MedicationIntake.objects.filter(
            medication=instance.medication,
            scheduled_time__gte=timezone.now(),
            status='PENDING'
        )
        future_intakes.delete()
        instance.delete()
    
    def _update_future_intakes(self, schedule):
        """
        Update future intakes when schedule changes
        """
        # Delete future intakes
        future_intakes = MedicationIntake.objects.filter(
            medication=schedule.medication,
            scheduled_time__gte=timezone.now(),
            status='PENDING'
        )
        future_intakes.delete()
        
        # Recreate with new schedule
        medication = schedule.medication
        view = MedicationViewSet()
        view._create_future_intakes(medication, schedule)


class IntakeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing medication intakes
    """
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    serializer_class = MedicationIntakeSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = MedicationIntake.objects.filter(
            medication__patient=user
        ).select_related('medication')
        
        # Filter by date
        date_param = self.request.query_params.get('date')
        if date_param:
            queryset = queryset.filter(scheduled_time__date=date_param)
        
        # Filter by status
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def add_comment(self, request, pk=None):
        """
        Add a comment to an intake
        """
        intake = self.get_object()
        serializer = CommentCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            comment = serializer.save(
                medication=intake.medication,
                intake=intake
            )
            return Response(
                MedicationCommentSerializer(comment).data,
                status=status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, *args, **kwargs):
        """
        Explicitly handle the PATCH request to update status/taken_at
        """
        instance = self.get_object()
        
        # Log for debugging - check your terminal to see if this triggers
        print(f"DEBUG: Updating Intake ID {instance.id}. Data: {request.data}")

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CommentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing medication comments
    """
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    serializer_class = MedicationCommentSerializer
    
    def get_queryset(self):
        user = self.request.user
        return MedicationComment.objects.filter(
            medication__patient=user
        ).select_related('medication', 'intake')
    
    def perform_create(self, serializer):
        medication_id = self.request.data.get('medication')
        medication = get_object_or_404(
            Medication,
            id=medication_id,
            patient=self.request.user
        )
        serializer.save(medication=medication)


class DashboardView(generics.GenericAPIView):
    """
    Get dashboard summary data
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        today = date.today()
        
        # Get today's medications
        today_medications = Medication.objects.filter(
            patient=user,
            status='ACTIVE',
            start_date__lte=today
        ).filter(
            Q(end_date__isnull=True) | Q(end_date__gte=today)
        )
        
        # Get today's intakes
        today_start = timezone.make_aware(datetime.combine(today, datetime.min.time()))
        today_end = timezone.make_aware(datetime.combine(today, datetime.max.time()))
        
        today_intakes = MedicationIntake.objects.filter(
            medication__patient=user,
            scheduled_time__range=[today_start, today_end]
        ).select_related('medication')
        
        taken_count = today_intakes.filter(status='TAKEN').count()
        total_count = today_intakes.count()
        pending_count = today_intakes.filter(status='PENDING').count()
        missed_count = today_intakes.filter(status='MISSED').count()
        late_count = today_intakes.filter(status='LATE').count()
        
        # Get upcoming intakes (next 24 hours)
        upcoming = MedicationIntake.objects.filter(
            medication__patient=user,
            scheduled_time__gt=timezone.now(),
            scheduled_time__lt=timezone.now() + timedelta(days=1),
            status='PENDING'
        ).select_related('medication')[:10]
        
        # Get recent comments
        recent_comments = MedicationComment.objects.filter(
            medication__patient=user
        ).select_related('medication')[:10]
        
        # Get low refills
        low_refills = Medication.objects.filter(
            patient=user,
            status='ACTIVE',
            refills_remaining__lte=2
        )[:5]
        
        # Calculate overall adherence (last 7 days)
        week_ago = timezone.now() - timedelta(days=7)
        week_intakes = MedicationIntake.objects.filter(
            medication__patient=user,
            scheduled_time__gte=week_ago
        )
        
        week_total = week_intakes.count()
        week_taken = week_intakes.filter(status='TAKEN').count()
        adherence_rate = round((week_taken / week_total * 100) if week_total > 0 else 0, 2)
        
        response_data = {
            'date': today,
            'summary': {
                'total_medications': today_medications.count(),
                'today_intakes': {
                    'total': total_count,
                    'taken': taken_count,
                    'pending': pending_count,
                    'missed': missed_count,
                    'late': late_count,
                    'completion_rate': round((taken_count / total_count * 100) if total_count > 0 else 0, 2)
                },
                'overall_adherence_7d': adherence_rate
            },
            'today_intakes_list': MedicationIntakeSerializer(today_intakes, many=True).data,
            'upcoming_intakes': MedicationIntakeSerializer(upcoming, many=True).data,
            'recent_comments': MedicationCommentSerializer(recent_comments, many=True).data,
            'low_refills': MedicationListSerializer(low_refills, many=True).data
        }
        
        return Response(response_data)


class StatisticsView(generics.GenericAPIView):
    """
    Get comprehensive statistics
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # Date range parameters
        days = int(request.query_params.get('days', 30))
        start_date = timezone.now() - timedelta(days=days)
        
        # Get all medications
        medications = Medication.objects.filter(patient=user)
        
        # Intakes in date range
        intakes = MedicationIntake.objects.filter(
            medication__patient=user,
            scheduled_time__gte=start_date
        )
        
        # Overall stats
        total_medications = medications.count()
        active_medications = medications.filter(
            status='ACTIVE',
            start_date__lte=date.today()
        ).filter(
            Q(end_date__isnull=True) | Q(end_date__gte=date.today())
        ).count()
        
        total_intakes = intakes.count()
        taken_intakes = intakes.filter(status='TAKEN').count()
        missed_intakes = intakes.filter(status='MISSED').count()
        pending_intakes = intakes.filter(status='PENDING').count()
        
        # Adherence by medication
        adherence_by_med = []
        for med in medications:
            med_intakes = intakes.filter(medication=med)
            if med_intakes.exists():
                med_taken = med_intakes.filter(status='TAKEN').count()
                med_total = med_intakes.count()
                adherence_by_med.append({
                    'medication_id': med.id,
                    'name': med.name,
                    'adherence_rate': round((med_taken / med_total * 100), 2),
                    'total_doses': med_total,
                    'taken_doses': med_taken
                })
        
        # Comments statistics
        comments = MedicationComment.objects.filter(
            medication__patient=user,
            created_at__gte=start_date
        )
        
        side_effects = comments.filter(comment_type='SIDE_EFFECT').count()
        effectiveness_notes = comments.filter(comment_type='EFFECTIVENESS').count()
        
        # Refills status
        low_refills = medications.filter(refills_remaining__lte=2).count()
        no_refills = medications.filter(refills_remaining=0).count()
        
        response_data = {
            'period_days': days,
            'medications': {
                'total': total_medications,
                'active': active_medications,
                'discontinued': medications.filter(status='DISCONTINUED').count(),
                'paused': medications.filter(status='PAUSED').count(),
                'completed': medications.filter(status='COMPLETED').count()
            },
            'intakes': {
                'total': total_intakes,
                'taken': taken_intakes,
                'missed': missed_intakes,
                'pending': pending_intakes,
                'adherence_rate': round((taken_intakes / total_intakes * 100) if total_intakes > 0 else 0, 2)
            },
            'adherence_by_medication': adherence_by_med,
            'comments': {
                'total': comments.count(),
                'side_effects': side_effects,
                'effectiveness_notes': effectiveness_notes,
                'general_notes': comments.filter(comment_type='NOTE').count()
            },
            'refills': {
                'low_refills': low_refills,
                'no_refills': no_refills,
                'with_refills': medications.filter(refills_remaining__gt=2).count()
            }
        }
        
        return Response(response_data)


class DailyIntakeView(generics.ListAPIView):
    """
    Get intakes for a specific date (defaults to today)
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MedicationIntakeSerializer
    
    def get_queryset(self):
        user = self.request.user
        # Grab date from query params, default to today
        date_param = self.request.query_params.get('date')
        
        try:
            if date_param:
                target_date = datetime.strptime(date_param, '%Y-%m-%d').date()
            else:
                target_date = date.today()
        except ValueError:
            target_date = date.today()

        # Create time-aware range for the full 24-hour period
        day_start = timezone.make_aware(datetime.combine(target_date, time.min))
        day_end = timezone.make_aware(datetime.combine(target_date, time.max))
        
        return MedicationIntake.objects.filter(
            medication__patient=user,
            scheduled_time__range=[day_start, day_end]
        ).select_related('medication').order_by('scheduled_time')
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        
        # Calculate stats for the specific day
        taken = queryset.filter(status='TAKEN')
        # Note: Use exclude(status='TAKEN') to capture both PENDING and MISSED
        pending = queryset.exclude(status='TAKEN')
        
        serializer = self.get_serializer(queryset, many=True)
        
        # Determine the date used for the response header
        date_param = self.request.query_params.get('date')
        resp_date = date_param if date_param else date.today()
        
        return Response({
            'date': resp_date,
            'total': queryset.count(),
            'taken': taken.count(),
            'pending': pending.count(),
            'completion_rate': round((taken.count() / queryset.count() * 100) if queryset.exists() else 0, 2),
            'intakes': serializer.data
        })

# class TodayIntakesView(generics.ListAPIView):
#     """
#     Get today's intakes
#     """
#     permission_classes = [permissions.IsAuthenticated]
#     serializer_class = MedicationIntakeSerializer
    
#     def get_queryset(self):
#         user = self.request.user
#         today = date.today()
#         today_start = timezone.make_aware(datetime.combine(today, datetime.min.time()))
#         today_end = timezone.make_aware(datetime.combine(today, datetime.max.time()))
        
#         return MedicationIntake.objects.filter(
#             medication__patient=user,
#             scheduled_time__range=[today_start, today_end]
#         ).select_related('medication').order_by('scheduled_time')
    
#     def list(self, request, *args, **kwargs):
#         queryset = self.get_queryset()
        
#         # Group by status
#         taken = queryset.filter(status='TAKEN')
#         pending = queryset.filter(status='MISSED')
        
#         serializer = self.get_serializer(queryset, many=True)
        
#         return Response({
#             'date': date.today(),
#             'total': queryset.count(),
#             'taken': taken.count(),
#             'pending': pending.count(),
#             'completion_rate': round((taken.count() / queryset.count() * 100) if queryset.exists() else 0, 2),
#             'intakes': serializer.data
#         })


class UpcomingIntakesView(generics.ListAPIView):
    """
    Get upcoming intakes
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MedicationIntakeSerializer
    
    def get_queryset(self):
        user = self.request.user
        hours = int(self.request.query_params.get('hours', 24))
        
        return MedicationIntake.objects.filter(
            medication__patient=user,
            scheduled_time__gt=timezone.now(),
            scheduled_time__lt=timezone.now() + timedelta(hours=hours),
            status='PENDING'
        ).select_related('medication').order_by('scheduled_time')
        
from .models import MedicationNotification
from .serializers import NotificationSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for fetching and reading in-app notifications
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NotificationSerializer
    
    def get_queryset(self):
        # Only return notifications for the currently logged-in user
        return MedicationNotification.objects.filter(patient=self.request.user)
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark a single notification as read"""
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'marked as read'})
    
    def perform_create(self, serializer):
        # 1. Save the new medication
        medication = serializer.save()
        
        # 2. Automatically generate Intakes and Reminders based on specific_times
        if medication.specific_times:
            start = max(medication.start_date, date.today())
            end = medication.end_date or (date.today() + timedelta(days=30))
            end = min(end, date.today() + timedelta(days=30))
            
            curr = start
            while curr <= end:
                for time_str in medication.specific_times:
                    hour, minute = map(int, time_str.split(':'))
                    dt = datetime.combine(curr, datetime.min.time()).replace(hour=hour, minute=minute)
                    dt = timezone.make_aware(dt)
                    
                    # Only schedule future reminders
                    if dt >= timezone.now() - timedelta(minutes=5):
                        # Create the Intake (So it shows up on your React Dashboard)
                        MedicationIntake.objects.get_or_create(
                            medication=medication,
                            scheduled_time=dt,
                            defaults={'status': 'PENDING', 'dosage_taken': medication.dosage}
                        )
                        # Create the Reminder (So Celery can find it and send a Notification)
                        MedicationReminder.objects.get_or_create(
                            medication=medication,
                            reminder_time=dt,
                            defaults={'is_sent': False}
                        )
                curr += timedelta(days=1)
                
                
