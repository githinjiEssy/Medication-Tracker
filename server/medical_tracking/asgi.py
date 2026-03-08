"""
ASGI config for medical_tracking project.
"""
import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medical_tracking.settings')

application = get_asgi_application()