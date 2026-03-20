import os
import sys
from pathlib import Path

# Add the project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

# Set Django settings module BEFORE any Django imports
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medical_tracking.settings')

# Initialize Django BEFORE loading step definitions
import django
django.setup()

# Now we can import Django models and utilities
from django.db import connection
from django.core.management import call_command
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from oauth.models import BlacklistedToken

def before_all(context):
    """Setup before all tests run"""
    # Store in context for later use
    context.User = get_user_model()
    context.BlacklistedToken = BlacklistedToken
    context.client = APIClient()
    
    # Initialize context variables
    context.response = None
    context.response_data = None
    context.user = None
    context.access_token = None
    context.refresh_token = None
    
    print("Django initialized successfully")

def before_scenario(context, scenario):
    """Setup before each scenario"""
    # Reset database
    call_command('flush', interactive=False, verbosity=0)
    
    # Reset client and context
    context.client = APIClient()
    context.response = None
    context.response_data = None
    context.user = None
    context.access_token = None
    context.refresh_token = None

def after_all(context):
    """Cleanup after all tests"""
    connection.close()