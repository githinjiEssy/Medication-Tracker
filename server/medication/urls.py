from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'medications', views.MedicationViewSet, basename='medication')
router.register(r'schedules', views.ScheduleViewSet, basename='schedule')
router.register(r'intakes', views.IntakeViewSet, basename='intake')
router.register(r'comments', views.CommentViewSet, basename='comment')

urlpatterns = [
    # Dashboard and statistics
    path('dashboard/', views.DashboardView.as_view(), name='medication_dashboard'),
    path('statistics/', views.StatisticsView.as_view(), name='medication_statistics'),
    path('today/', views.TodayIntakesView.as_view(), name='today_intakes'),
    path('upcoming/', views.UpcomingIntakesView.as_view(), name='upcoming_intakes'),
    
    # Include router URLs
    path('', include(router.urls)),
]