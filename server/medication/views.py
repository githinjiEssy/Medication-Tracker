from rest_framework import generics, permissions, status, viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Q, Count, Avg
from datetime import datetime, timedelta, date
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
            now = timezone.now()
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
                intake.taken_at = serializer.validated_data.get('taken_at', now)
                intake.dosage_taken = serializer.validated_data.get('dosage_taken', medication.dosage)
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
        
        intakes = medication.intakes.filter(scheduled_time__gte=start_date)
        
        total = intakes.count()
        taken = intakes.filter(status='TAKEN').count()
        missed = intakes.filter(status='MISSED').count()
        
        # Calculate daily trend
        trend = []
        for i in range(days):
            day = start_date + timedelta(days=i)
            day_intakes = intakes.filter(
                scheduled_time__date=day.date()
            )
            day_taken = day_intakes.filter(status='TAKEN').count()
            day_total = day_intakes.count()
            
            trend.append({
                'date': day.date(),
                'taken': day_taken,
                'total': day_total,
                'rate': round((day_taken / day_total * 100) if day_total > 0 else 0, 2)
            })
        
        stats = {
            'total_scheduled': total,
            'total_taken': taken,
            'total_missed': missed,
            'adherence_rate': round((taken / total * 100) if total > 0 else 0, 2),
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
                
                MedicationIntake.objects.get_or_create(
                    medication=medication,
                    scheduled_time=scheduled_datetime,
                    defaults={
                        'status': 'MISSED',
                        'dosage_taken': schedule.dosage
                    }
                )
            
            current_date += timedelta(days=1)
    
    def _update_reminder(self, medication, intake):
        """
        Update reminder when intake is recorded
        """
        try:
            reminder = MedicationReminder.objects.get(
                medication=medication,
                scheduled_time=intake.scheduled_time,
                is_sent=False
            )
            reminder.is_sent = True
            reminder.sent_at = timezone.now()
            reminder.save()
        except MedicationReminder.DoesNotExist:
            pass


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
            status='MISSED'
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
            status='MISSED'
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
        pending_count = today_intakes.filter(status='MISSED').count()
        
        # Get upcoming intakes (next 24 hours)
        upcoming = MedicationIntake.objects.filter(
            medication__patient=user,
            scheduled_time__gt=timezone.now(),
            scheduled_time__lt=timezone.now() + timedelta(days=1),
            status='MISSED'
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
                    'completion_rate': round((taken_count / total_count * 100) if total_count > 0 else 0, 2)
                },
                'overall_adherence_7d': adherence_rate
            },
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


class TodayIntakesView(generics.ListAPIView):
    """
    Get today's intakes
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MedicationIntakeSerializer
    
    def get_queryset(self):
        user = self.request.user
        today = date.today()
        today_start = timezone.make_aware(datetime.combine(today, datetime.min.time()))
        today_end = timezone.make_aware(datetime.combine(today, datetime.max.time()))
        
        return MedicationIntake.objects.filter(
            medication__patient=user,
            scheduled_time__range=[today_start, today_end]
        ).select_related('medication').order_by('scheduled_time')
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        
        # Group by status
        taken = queryset.filter(status='TAKEN')
        pending = queryset.filter(status='MISSED')
        
        serializer = self.get_serializer(queryset, many=True)
        
        return Response({
            'date': date.today(),
            'total': queryset.count(),
            'taken': taken.count(),
            'pending': pending.count(),
            'completion_rate': round((taken.count() / queryset.count() * 100) if queryset.exists() else 0, 2),
            'intakes': serializer.data
        })


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
            status='MISSED'
        ).select_related('medication').order_by('scheduled_time')