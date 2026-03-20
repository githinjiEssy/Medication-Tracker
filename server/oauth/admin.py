from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

# Tell Django to show our custom User table on the admin dashboard
admin.site.register(User, UserAdmin)