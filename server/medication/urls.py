# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MedicationViewSet, ScheduleViewSet, IntakeViewSet, CommentViewSet,
    DashboardView, StatisticsView, DailyIntakeView, UpcomingIntakesView,
    NotificationViewSet
)
from . import views

router = DefaultRouter()
router.register(r'medications', MedicationViewSet, basename='medication')
router.register(r'schedules', ScheduleViewSet, basename='schedule')
router.register(r'intakes', IntakeViewSet, basename='intake')
router.register(r'comments', CommentViewSet, basename='comment')
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    path('', include(router.urls)),
    
    # Dashboard and Statistics
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('statistics/', StatisticsView.as_view(), name='statistics'),
    
    # Daily and Upcoming Intakes
    path('daily-intakes/', DailyIntakeView.as_view(), name='daily-intakes'),
    path('today/', DailyIntakeView.as_view(), name='today-intakes'),  # Same view, defaults to today
    path('upcoming-intakes/', UpcomingIntakesView.as_view(), name='upcoming-intakes'),
    path('notifications/unalerted/', views.get_unalerted_notifications, name='unalerted_notifications'),
    path('notifications/<int:id>/mark_alerted/', views.mark_notification_alerted, name='mark_alerted'),
]