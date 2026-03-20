#!/usr/bin/env python
import os
import sys
import subprocess
from pathlib import Path

def run_behave_tests(app=None, tags=None, feature=None):
    """Run behave tests"""
    
    # Set Django settings module
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medical_tracking.settings')
    
    # Build behave command
    cmd = ['behave']
    
    # Add features directory
    if feature:
        cmd.append(feature)
    elif app:
        features_path = Path(__file__).parent / app / 'features'
        if features_path.exists():
            cmd.append(str(features_path))
        else:
            print(f"Features directory not found for app: {app}")
            return 1
    else:
        # Run all features
        cmd.append('oauth/features')
    
    # Add tags
    if tags:
        for tag in tags:
            cmd.append(f'--tags={tag}')
    
    # Add format for better output
    cmd.append('--format=pretty')
    
    # Add no-capture to see print statements
    cmd.append('--no-capture')
    
    # Add verbose output
    cmd.append('-v')
    
    # Run the tests
    print(f"Running: {' '.join(cmd)}")
    print("=" * 60)
    
    result = subprocess.run(cmd, cwd=Path(__file__).parent)
    return result.returncode

if __name__ == '__main__':
    import argparse
    
    parser = argparse.ArgumentParser(description='Run Behave tests')
    parser.add_argument('--app', help='App to test (e.g., oauth)')
    parser.add_argument('--tags', nargs='+', help='Tags to filter')
    parser.add_argument('--feature', help='Specific feature file')
    
    args = parser.parse_args()
    
    sys.exit(run_behave_tests(
        app=args.app,
        tags=args.tags,
        feature=args.feature
    ))