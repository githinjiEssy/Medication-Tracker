from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any authenticated request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to the owner
        return obj == request.user


class IsTokenValid(permissions.BasePermission):
    """
    Custom permission to check if token is not blacklisted
    """
    def has_permission(self, request, view):
        # This will be implemented with middleware
        return True