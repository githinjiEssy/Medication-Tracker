"""
WSGI config for medical_tracking project.
"""
import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medical_tracking.settings')

application = get_wsgi_application()