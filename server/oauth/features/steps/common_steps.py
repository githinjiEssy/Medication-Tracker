import json
from behave import given, when, then

# NO Django imports at the top level!
# All Django imports will happen inside functions or through context

# ========== Given Steps ==========

@given('the database is clean')
def step_clean_database(context):
    """Clean all users from database"""
    if hasattr(context, 'User'):
        context.User.objects.all().delete()
        if hasattr(context, 'BlacklistedToken'):
            context.BlacklistedToken.objects.all().delete()

@given('a user exists with:')
def step_create_user(context):
    """Create a single user from table"""
    for row in context.table:
        user_data = {
            'username': row.get('username', ''),
            'email': row.get('email', ''),
            'password': row.get('password', ''),
        }
        
        # Handle optional fields
        if 'first_name' in row:
            user_data['first_name'] = row['first_name']
        if 'last_name' in row:
            user_data['last_name'] = row['last_name']
        if 'phone_number' in row:
            user_data['phone_number'] = row['phone_number']
        if 'date_of_birth' in row:
            user_data['date_of_birth'] = row['date_of_birth']
        if 'gender' in row:
            user_data['gender'] = row['gender']
        if 'blood_group' in row:
            user_data['blood_group'] = row['blood_group']
        if 'is_active' in row:
            user_data['is_active'] = row['is_active'].lower() == 'true'
        if 'is_email_verified' in row:
            user_data['is_email_verified'] = row['is_email_verified'].lower() == 'true'
        if 'is_phone_verified' in row:
            user_data['is_phone_verified'] = row['is_phone_verified'].lower() == 'true'
        
        user = context.User.objects.create_user(**user_data)
        
        if not hasattr(context, 'users'):
            context.users = []
        context.users.append(user)

@given('the following users exist:')
def step_create_multiple_users(context):
    """Create multiple users from table"""
    for row in context.table:
        user_data = {
            'username': row['username'],
            'email': row['email'],
            'password': row['password'],
        }
        
        # Handle optional fields
        if 'first_name' in row:
            user_data['first_name'] = row['first_name']
        if 'last_name' in row:
            user_data['last_name'] = row['last_name']
        if 'is_active' in row:
            user_data['is_active'] = row['is_active'].lower() == 'true'
        
        user = context.User.objects.create_user(**user_data)
        
        if not hasattr(context, 'users'):
            context.users = []
        context.users.append(user)

@given('I am authenticated as "{username}"')
def step_authenticate_user(context, username):
    """Authenticate as a specific user"""
    # Import inside the function to avoid top-level import issues
    from rest_framework_simplejwt.tokens import RefreshToken
    
    try:
        user = context.User.objects.get(username=username)
        context.user = user
        refresh = RefreshToken.for_user(user)
        context.access_token = str(refresh.access_token)
        context.refresh_token = str(refresh)
        context.client.credentials(HTTP_AUTHORIZATION=f'Bearer {context.access_token}')
    except context.User.DoesNotExist:
        assert False, f"User {username} does not exist"

@given('I am not authenticated')
def step_not_authenticated(context):
    """Clear authentication"""
    context.client.credentials()
    context.user = None
    context.access_token = None
    context.refresh_token = None

# ========== When Steps ==========

@when('I send a GET request to "{url}"')
def step_send_get_request(context, url):
    """Send GET request"""
    context.response = context.client.get(url)
    if context.response.content:
        try:
            context.response_data = context.response.json()
        except:
            context.response_data = None

@when('I send a POST request to "{url}" with body:')
def step_send_post_request(context, url):
    """Send POST request with body"""
    body = context.text
    # Replace placeholder tokens
    if hasattr(context, 'refresh_token') and context.refresh_token:
        body = body.replace('$refresh_token', context.refresh_token)
    
    body_json = json.loads(body)
    context.response = context.client.post(url, body_json, format='json')
    if context.response.content:
        try:
            context.response_data = context.response.json()
        except:
            context.response_data = None

@when('I send a PATCH request to "{url}" with body:')
def step_send_patch_request(context, url):
    """Send PATCH request with body"""
    body = json.loads(context.text)
    context.response = context.client.patch(url, body, format='json')
    if context.response.content:
        try:
            context.response_data = context.response.json()
        except:
            context.response_data = None

@when('I send a PUT request to "{url}" with body:')
def step_send_put_request(context, url):
    """Send PUT request with body"""
    body = json.loads(context.text)
    context.response = context.client.put(url, body, format='json')
    if context.response.content:
        try:
            context.response_data = context.response.json()
        except:
            context.response_data = None

@when('I send a DELETE request to "{url}"')
def step_send_delete_request(context, url):
    """Send DELETE request"""
    context.response = context.client.delete(url)
    if context.response.content:
        try:
            context.response_data = context.response.json()
        except:
            context.response_data = None

@when('I send a DELETE request to "{url}" with body:')
def step_send_delete_with_body(context, url):
    """Send DELETE request with body"""
    body = json.loads(context.text)
    context.response = context.client.delete(url, body, format='json')
    if context.response.content:
        try:
            context.response_data = context.response.json()
        except:
            context.response_data = None

# ========== Then Steps ==========

@then('the response status code should be {status_code}')
def step_check_status_code(context, status_code):
    """Check response status code"""
    expected = int(status_code)
    actual = context.response.status_code
    assert actual == expected, f"Expected status {expected}, got {actual}"

@then('the response contains field "{key}"')
def step_response_contains_key(context, key):
    """Check if response contains a field"""
    assert context.response_data is not None, "No response data"
    assert key in context.response_data, f"Field '{key}' not found in response"

@then('the response field "{key}" equals "{value}"')
def step_response_key_equals(context, key, value):
    """Check if response field equals value"""
    assert context.response_data is not None, "No response data"
    assert key in context.response_data, f"Field '{key}' not found in response"
    actual = str(context.response_data[key])
    assert actual == value, f"Expected {key}={value}, got {actual}"

@then('the response contains message "{message}"')
def step_response_contains_message(context, message):
    """Check if response contains message"""
    assert context.response_data is not None, "No response data"
    assert 'message' in context.response_data, "No message in response"
    assert context.response_data['message'] == message, \
        f"Expected message '{message}', got '{context.response_data['message']}'"

@then('the response contains error for field "{field}"')
def step_response_contains_error_for_field(context, field):
    """Check if response contains error for specific field"""
    assert context.response_data is not None, "No response data"
    assert field in context.response_data, f"Error for field '{field}' not found"
    assert context.response_data[field], f"Error for field '{field}' is empty"

@then('the response contains error "{error_message}"')
def step_response_contains_error_message(context, error_message):
    """Check response contains specific error message"""
    assert context.response_data is not None, "No response data"
    
    error_found = False
    
    if 'non_field_errors' in context.response_data:
        if error_message in context.response_data['non_field_errors']:
            error_found = True
    elif 'error' in context.response_data:
        if error_message in context.response_data['error']:
            error_found = True
    else:
        # Check all field errors
        for field, errors in context.response_data.items():
            if isinstance(errors, list) and errors and error_message in str(errors[0]):
                error_found = True
                break
    
    assert error_found, f"Error message '{error_message}' not found"

@then('the error message is "{expected_message}"')
def step_error_message_equals(context, expected_message):
    """Check exact error message"""
    assert context.response_data is not None, "No response data"
    
    error_found = False
    
    if 'non_field_errors' in context.response_data:
        actual_message = context.response_data['non_field_errors'][0]
        assert actual_message == expected_message, \
            f"Expected error '{expected_message}', got '{actual_message}'"
        error_found = True
    elif 'error' in context.response_data:
        actual_message = context.response_data['error']
        assert actual_message == expected_message, \
            f"Expected error '{expected_message}', got '{actual_message}'"
        error_found = True
    else:
        # Check field-specific errors
        for field_errors in context.response_data.values():
            if isinstance(field_errors, list) and field_errors:
                if expected_message in str(field_errors[0]):
                    error_found = True
                    break
        
        if not error_found:
            assert False, f"Error message '{expected_message}' not found"

@then('the error message contains "{partial_message}"')
def step_error_message_contains(context, partial_message):
    """Check error message contains text"""
    assert context.response_data is not None, "No response data"
    
    error_found = False
    
    if 'non_field_errors' in context.response_data:
        error_text = str(context.response_data['non_field_errors'])
        if partial_message in error_text:
            error_found = True
    elif 'error' in context.response_data:
        error_text = str(context.response_data['error'])
        if partial_message in error_text:
            error_found = True
    else:
        # Check all field errors
        for field, errors in context.response_data.items():
            if isinstance(errors, list) and errors:
                error_text = str(errors[0])
                if partial_message in error_text:
                    error_found = True
                    break
    
    assert error_found, f"Error message containing '{partial_message}' not found"

@then('the response user has {field} "{value}"')
def step_response_user_has_field(context, field, value):
    """Check user field in response"""
    assert context.response_data is not None, "No response data"
    assert 'user' in context.response_data, "No user data in response"
    assert field in context.response_data['user'], f"Field '{field}' not found in user data"
    assert str(context.response_data['user'][field]) == value, \
        f"Expected {field}={value}, got {context.response_data['user'][field]}"

@then('the user "{username}" has {field} "{value}"')
def step_user_has_field_in_db(context, username, field, value):
    """Check user field in database"""
    user = context.User.objects.get(username=username)
    actual = str(getattr(user, field))
    assert actual == value, f"Expected {field}={value}, got {actual}"

@then('a user exists with username "{username}"')
def step_user_exists_with_username(context, username):
    """Check if user exists in database"""
    assert context.User.objects.filter(username=username).exists(), \
        f"User with username '{username}' does not exist"

@then('no user exists with username "{username}"')
def step_user_does_not_exist_with_username(context, username):
    """Check if user does not exist in database"""
    assert not context.User.objects.filter(username=username).exists(), \
        f"User with username '{username}' exists but shouldn't"

@then('the refresh token is blacklisted')
def step_token_blacklisted(context):
    """Check if refresh token is blacklisted"""
    assert hasattr(context, 'refresh_token'), "No refresh token in context"
    assert context.refresh_token is not None, "Refresh token is None"
    assert context.BlacklistedToken.objects.filter(token=context.refresh_token).exists(), \
        "Refresh token was not blacklisted"

@then('I cannot use the refresh token to get new access token')
def step_cannot_refresh_token(context):
    """Test that blacklisted token cannot refresh"""
    response = context.client.post('/api/auth/token/refresh/', {
        'refresh': context.refresh_token
    }, format='json')
    assert response.status_code in [400, 401], \
        f"Should not be able to refresh with blacklisted token, got {response.status_code}"

@then('I can login with username "{username}" and password "{password}"')
def step_can_login(context, username, password):
    """Test if user can login with credentials"""
    login_response = context.client.post('/api/auth/login/', {
        'username': username,
        'password': password
    }, format='json')
    assert login_response.status_code == 200, \
        f"Failed to login with credentials. Status: {login_response.status_code}, Response: {login_response.data}"

