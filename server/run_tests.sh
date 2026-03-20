#!/bin/bash

# Activate virtual environment if not already activated
if [ -z "$VIRTUAL_ENV" ]; then
    source venv/bin/activate
fi

# Set Django settings
export DJANGO_SETTINGS_MODULE=medical_tracking.settings

# Run the tests
if [ "$1" == "--app" ]; then
    python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medical_tracking.settings')
import django
django.setup()
from django.core.management import call_command
call_command('behave', '$2')
"
else
    python run_cucumber_tests.py "$@"
fi