# Medication Tracker API Documentation

## Authentication Endpoints (`/api/auth/`)

### 1. Register User
**Endpoint:** `POST /api/auth/register/`

**Description:** Register a new user account

**Request Body:**
```json
{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "password2": "SecurePass123!",
    "first_name": "John",
    "last_name": "Doe",
    "phone_number": "+1234567890",
    "date_of_birth": "1990-01-01",
    "gender": "M",
    "blood_group": "O+",
    "emergency_contact_name": "Jane Doe",
    "emergency_contact_phone": "+0987654321",
    "allergies": "Penicillin, Peanuts",
    "chronic_conditions": "Asthma"
}
```

**Response (201 Created):**
```json
{
    "user": {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "full_name": "John Doe",
        "phone_number": "+1234567890",
        "date_of_birth": "1990-01-01",
        "age": 33,
        "gender": "M",
        "blood_group": "O+",
        "emergency_contact_name": "Jane Doe",
        "emergency_contact_phone": "+0987654321",
        "allergies": "Penicillin, Peanuts",
        "chronic_conditions": "Asthma",
        "is_email_verified": false,
        "is_phone_verified": false,
        "date_joined": "2024-01-15T10:30:00Z"
    },
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "message": "Registration successful"
}
```

**Response (400 Bad Request):**
```json
{
    "password": ["Password fields must match."]
}
```

---

### 2. Login
**Endpoint:** `POST /api/auth/login/`

**Description:** Authenticate user and get JWT tokens

**Request Body:**
```json
{
    "username": "john_doe",
    "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
    "user": {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "full_name": "John Doe",
        "phone_number": "+1234567890",
        "date_of_birth": "1990-01-01",
        "age": 33,
        "gender": "M",
        "blood_group": "O+",
        "is_email_verified": false,
        "is_phone_verified": false,
        "date_joined": "2024-01-15T10:30:00Z"
    },
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "message": "Login successful"
}
```

**Response (400 Bad Request):**
```json
{
    "non_field_errors": ["Invalid username or password."]
}
```

---

### 3. Logout
**Endpoint:** `POST /api/auth/logout/`

**Description:** Blacklist refresh token to logout

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response (200 OK):**
```json
{
    "message": "Logout successful"
}
```

**Response (400 Bad Request):**
```json
{
    "error": "Invalid token"
}
```

---

### 4. Refresh Token
**Endpoint:** `POST /api/auth/token/refresh/`

**Description:** Get new access token using refresh token

**Request Body:**
```json
{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response (200 OK):**
```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

---

### 5. Get Profile
**Endpoint:** `GET /api/auth/profile/`

**Description:** Get authenticated user's profile

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "full_name": "John Doe",
    "phone_number": "+1234567890",
    "date_of_birth": "1990-01-01",
    "age": 33,
    "gender": "M",
    "blood_group": "O+",
    "emergency_contact_name": "Jane Doe",
    "emergency_contact_phone": "+0987654321",
    "allergies": "Penicillin, Peanuts",
    "chronic_conditions": "Asthma",
    "is_email_verified": false,
    "is_phone_verified": false,
    "date_joined": "2024-01-15T10:30:00Z",
    "last_login": "2024-01-15T11:45:00Z"
}
```

---

### 6. Update Profile
**Endpoint:** `PATCH /api/auth/profile/`

**Description:** Update authenticated user's profile

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
    "first_name": "Jonathan",
    "last_name": "Smith",
    "phone_number": "+1234567899",
    "emergency_contact_name": "Jane Smith"
}
```

**Response (200 OK):**
```json
{
    "user": {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com",
        "first_name": "Jonathan",
        "last_name": "Smith",
        "full_name": "Jonathan Smith",
        "phone_number": "+1234567899",
        "date_of_birth": "1990-01-01",
        "age": 33,
        "gender": "M",
        "blood_group": "O+",
        "emergency_contact_name": "Jane Smith",
        "emergency_contact_phone": "+0987654321",
        "allergies": "Penicillin, Peanuts",
        "chronic_conditions": "Asthma",
        "is_email_verified": false,
        "is_phone_verified": false,
        "date_joined": "2024-01-15T10:30:00Z"
    },
    "message": "Profile updated successfully"
}
```

---

### 7. Change Password
**Endpoint:** `POST /api/auth/change-password/`

**Description:** Change authenticated user's password

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
    "old_password": "SecurePass123!",
    "new_password": "NewSecurePass456!",
    "new_password2": "NewSecurePass456!"
}
```

**Response (200 OK):**
```json
{
    "message": "Password changed successfully",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response (400 Bad Request):**
```json
{
    "old_password": ["Wrong password"]
}
```

---

### 8. Verify Email
**Endpoint:** `POST /api/auth/verify-email/`

**Description:** Mark email as verified

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
    "message": "Email verified successfully"
}
```

---

### 9. Verify Phone
**Endpoint:** `POST /api/auth/verify-phone/`

**Description:** Mark phone as verified

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
    "message": "Phone verified successfully"
}
```

---

### 10. Delete Account
**Endpoint:** `DELETE /api/auth/delete-account/`

**Description:** Delete user account (requires password confirmation)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
    "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
    "message": "Account deleted successfully"
}
```

**Response (400 Bad Request):**
```json
{
    "error": "Invalid password"
}
```

---

## Medication Endpoints (`/api/medications/`)

### 1. List Medications
**Endpoint:** `GET /api/medications/medications/`

**Description:** Get all medications for authenticated user

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `status` - Filter by status (ACTIVE, DISCONTINUED, PAUSED, COMPLETED)
- `active` - Filter by active status (true/false)
- `search` - Search by name, generic name, reason
- `start_date` - Filter by start date (YYYY-MM-DD)
- `end_date` - Filter by end date (YYYY-MM-DD)
- `page` - Page number for pagination
- `page_size` - Items per page (default: 20)

**Response (200 OK):**
```json
{
    "count": 2,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 1,
            "name": "Amoxicillin",
            "generic_name": "Amoxicillin",
            "dosage": "500mg",
            "dosage_form": "TABLET",
            "frequency": "TWICE",
            "frequency_display": "Twice daily",
            "route": "ORAL",
            "start_date": "2024-01-01",
            "end_date": "2024-01-14",
            "status": "ACTIVE",
            "status_display": "Active",
            "is_active": true,
            "refills_remaining": 2,
            "prescribed_by": "Dr. Smith",
            "schedule_count": 2,
            "adherence_rate": 85.5,
            "created_at": "2024-01-01T09:00:00Z"
        },
        {
            "id": 2,
            "name": "Ibuprofen",
            "generic_name": "Ibuprofen",
            "dosage": "400mg",
            "dosage_form": "TABLET",
            "frequency": "THRICE",
            "frequency_display": "Three times daily",
            "route": "ORAL",
            "start_date": "2024-01-10",
            "end_date": "2024-01-20",
            "status": "ACTIVE",
            "status_display": "Active",
            "is_active": true,
            "refills_remaining": 0,
            "prescribed_by": "Dr. Jones",
            "schedule_count": 3,
            "adherence_rate": 92.0,
            "created_at": "2024-01-10T14:30:00Z"
        }
    ]
}
```

---

### 2. Create Medication
**Endpoint:** `POST /api/medications/medications/`

**Description:** Create a new medication

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
    "name": "Amoxicillin",
    "generic_name": "Amoxicillin",
    "dosage": "500mg",
    "dosage_form": "TABLET",
    "frequency": "TWICE",
    "frequency_other": "",
    "route": "ORAL",
    "prescribed_date": "2024-01-15",
    "start_date": "2024-01-15",
    "end_date": "2024-01-29",
    "specific_times": ["09:00", "21:00"],
    "prescribed_by": "Dr. Smith",
    "prescription_number": "RX123456",
    "pharmacy_name": "CVS Pharmacy",
    "pharmacy_phone": "+1234567890",
    "refills_remaining": 2,
    "quantity": 30,
    "instructions": "Take with food",
    "reason": "Bacterial infection",
    "status": "ACTIVE"
}
```

**Response (201 Created):**
```json
{
    "id": 1,
    "name": "Amoxicillin",
    "generic_name": "Amoxicillin",
    "dosage": "500mg",
    "dosage_form": "TABLET",
    "frequency": "TWICE",
    "frequency_display": "Twice daily",
    "route": "ORAL",
    "prescribed_date": "2024-01-15",
    "start_date": "2024-01-15",
    "end_date": "2024-01-29",
    "specific_times": ["09:00", "21:00"],
    "prescribed_by": "Dr. Smith",
    "prescription_number": "RX123456",
    "pharmacy_name": "CVS Pharmacy",
    "pharmacy_phone": "+1234567890",
    "refills_remaining": 2,
    "quantity": 30,
    "instructions": "Take with food",
    "reason": "Bacterial infection",
    "status": "ACTIVE",
    "is_active": true,
    "duration_days": 14,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
}
```

---

### 3. Get Medication Details
**Endpoint:** `GET /api/medications/medications/{id}/`

**Description:** Get detailed information about a specific medication

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
    "id": 1,
    "patient": 1,
    "name": "Amoxicillin",
    "generic_name": "Amoxicillin",
    "dosage": "500mg",
    "dosage_form": "TABLET",
    "dosage_form_display": "Tablet",
    "frequency": "TWICE",
    "frequency_display": "Twice daily",
    "route": "ORAL",
    "route_display": "Oral",
    "prescribed_date": "2024-01-15",
    "start_date": "2024-01-15",
    "end_date": "2024-01-29",
    "specific_times": ["09:00", "21:00"],
    "prescribed_by": "Dr. Smith",
    "prescription_number": "RX123456",
    "pharmacy_name": "CVS Pharmacy",
    "pharmacy_phone": "+1234567890",
    "refills_remaining": 2,
    "quantity": 30,
    "instructions": "Take with food",
    "reason": "Bacterial infection",
    "status": "ACTIVE",
    "status_display": "Active",
    "is_active": true,
    "duration_days": 14,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z",
    "schedules": [
        {
            "id": 1,
            "scheduled_time": "09:00:00",
            "time_formatted": "09:00 AM",
            "dosage": "500mg",
            "days_of_week": [0, 1, 2, 3, 4, 5, 6],
            "days_display": "Mon, Tue, Wed, Thu, Fri, Sat, Sun",
            "is_active": true,
            "created_at": "2024-01-15T10:31:00Z"
        },
        {
            "id": 2,
            "scheduled_time": "21:00:00",
            "time_formatted": "09:00 PM",
            "dosage": "500mg",
            "days_of_week": [0, 1, 2, 3, 4, 5, 6],
            "days_display": "Mon, Tue, Wed, Thu, Fri, Sat, Sun",
            "is_active": true,
            "created_at": "2024-01-15T10:31:00Z"
        }
    ],
    "intakes": [
        {
            "id": 1,
            "scheduled_time": "2024-01-15T09:00:00Z",
            "scheduled_time_formatted": "2024-01-15 09:00 AM",
            "taken_at": "2024-01-15T09:05:00Z",
            "taken_at_formatted": "2024-01-15 09:05 AM",
            "status": "TAKEN",
            "status_display": "Taken",
            "dosage_taken": "500mg",
            "created_at": "2024-01-15T09:05:00Z"
        }
    ],
    "comments": [
        {
            "id": 1,
            "comment_type": "SIDE_EFFECT",
            "content": "Mild nausea after taking",
            "severity": 3,
            "effectiveness": null,
            "time_ago": "2 hours ago",
            "created_at": "2024-01-15T11:30:00Z"
        }
    ]
}
```

---

### 4. Update Medication
**Endpoint:** `PUT/PATCH /api/medications/medications/{id}/`

**Description:** Update a medication

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body (PATCH - partial update):**
```json
{
    "dosage": "250mg",
    "instructions": "Take with food and plenty of water"
}
```

**Response (200 OK):**
```json
{
    "id": 1,
    "name": "Amoxicillin",
    "dosage": "250mg",
    "instructions": "Take with food and plenty of water",
    "status": "ACTIVE",
    "updated_at": "2024-01-16T09:15:00Z"
}
```

---

### 5. Delete Medication
**Endpoint:** `DELETE /api/medications/medications/{id}/`

**Description:** Delete a medication

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (204 No Content)**

---

### 6. Add Schedule to Medication
**Endpoint:** `POST /api/medications/medications/{id}/add_schedule/`

**Description:** Add a schedule to a medication

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
    "scheduled_time": "14:00:00",
    "dosage": "500mg",
    "days_of_week": [0, 1, 2, 3, 4]
}
```

**Response (201 Created):**
```json
{
    "id": 3,
    "scheduled_time": "14:00:00",
    "time_formatted": "02:00 PM",
    "dosage": "500mg",
    "days_of_week": [0, 1, 2, 3, 4],
    "days_display": "Mon, Tue, Wed, Thu, Fri",
    "is_active": true,
    "created_at": "2024-01-16T10:00:00Z",
    "updated_at": "2024-01-16T10:00:00Z"
}
```

---

### 7. Get Medication Schedules
**Endpoint:** `GET /api/medications/medications/{id}/schedules/`

**Description:** Get all schedules for a medication

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
[
    {
        "id": 1,
        "scheduled_time": "09:00:00",
        "time_formatted": "09:00 AM",
        "dosage": "500mg",
        "days_of_week": [0, 1, 2, 3, 4, 5, 6],
        "days_display": "Mon, Tue, Wed, Thu, Fri, Sat, Sun",
        "is_active": true,
        "created_at": "2024-01-15T10:31:00Z"
    },
    {
        "id": 2,
        "scheduled_time": "21:00:00",
        "time_formatted": "09:00 PM",
        "dosage": "500mg",
        "days_of_week": [0, 1, 2, 3, 4, 5, 6],
        "days_display": "Mon, Tue, Wed, Thu, Fri, Sat, Sun",
        "is_active": true,
        "created_at": "2024-01-15T10:31:00Z"
    }
]
```

---

### 8. Record Medication Intake
**Endpoint:** `POST /api/medications/medications/{id}/record_intake/`

**Description:** Record a medication intake

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
    "scheduled_time": "2024-01-16T09:00:00Z",
    "taken_at": "2024-01-16T09:10:00Z",
    "status": "TAKEN",
    "dosage_taken": "500mg"
}
```

**Response (201 Created):**
```json
{
    "id": 5,
    "scheduled_time": "2024-01-16T09:00:00Z",
    "scheduled_time_formatted": "2024-01-16 09:00 AM",
    "taken_at": "2024-01-16T09:10:00Z",
    "taken_at_formatted": "2024-01-16 09:10 AM",
    "status": "TAKEN",
    "status_display": "Taken",
    "dosage_taken": "500mg",
    "created_at": "2024-01-16T09:10:00Z"
}
```

---

### 9. Mark Medication as Taken
**Endpoint:** `POST /api/medications/medications/{id}/mark_taken/`

**Description:** Mark medication as taken for current time (with optional notes)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
    "dosage_taken": "500mg",
    "notes": "Took with breakfast"
}
```

**Response (200 OK):**
```json
{
    "id": 6,
    "scheduled_time": "2024-01-16T09:00:00Z",
    "scheduled_time_formatted": "2024-01-16 09:00 AM",
    "taken_at": "2024-01-16T09:15:00Z",
    "taken_at_formatted": "2024-01-16 09:15 AM",
    "status": "TAKEN",
    "status_display": "Taken",
    "dosage_taken": "500mg",
    "created_at": "2024-01-16T09:15:00Z"
}
```

---

### 10. Get Medication Intakes
**Endpoint:** `GET /api/medications/medications/{id}/intakes/`

**Description:** Get all intakes for a medication

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `start_date` - Filter by start date (YYYY-MM-DD)
- `end_date` - Filter by end date (YYYY-MM-DD)

**Response (200 OK):**
```json
{
    "count": 30,
    "next": "http://localhost:8000/api/medications/medications/1/intakes/?page=2",
    "previous": null,
    "results": [
        {
            "id": 6,
            "scheduled_time": "2024-01-16T09:00:00Z",
            "scheduled_time_formatted": "2024-01-16 09:00 AM",
            "taken_at": "2024-01-16T09:15:00Z",
            "taken_at_formatted": "2024-01-16 09:15 AM",
            "status": "TAKEN",
            "status_display": "Taken",
            "dosage_taken": "500mg",
            "created_at": "2024-01-16T09:15:00Z"
        },
        {
            "id": 5,
            "scheduled_time": "2024-01-15T21:00:00Z",
            "scheduled_time_formatted": "2024-01-15 09:00 PM",
            "taken_at": "2024-01-15T21:30:00Z",
            "taken_at_formatted": "2024-01-15 09:30 PM",
            "status": "LATE",
            "status_display": "Late",
            "dosage_taken": "500mg",
            "created_at": "2024-01-15T21:30:00Z"
        }
    ]
}
```

---

### 11. Add Comment to Medication
**Endpoint:** `POST /api/medications/medications/{id}/add_comment/`

**Description:** Add a comment to track effects, side effects, etc.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body (Side Effect):**
```json
{
    "comment_type": "SIDE_EFFECT",
    "content": "Mild headache after taking",
    "severity": 4
}
```

**Request Body (Effectiveness):**
```json
{
    "comment_type": "EFFECTIVENESS",
    "content": "Symptoms improving",
    "effectiveness": 8
}
```

**Request Body (General Note):**
```json
{
    "comment_type": "NOTE",
    "content": "Remember to pick up refill tomorrow"
}
```

**Response (201 Created):**
```json
{
    "id": 3,
    "comment_type": "SIDE_EFFECT",
    "content": "Mild headache after taking",
    "severity": 4,
    "effectiveness": null,
    "time_ago": "Just now",
    "created_at": "2024-01-16T11:30:00Z"
}
```

---

### 12. Get Medication Comments
**Endpoint:** `GET /api/medications/medications/{id}/comments/`

**Description:** Get all comments for a medication

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `type` - Filter by comment type (SIDE_EFFECT, EFFECTIVENESS, NOTE, QUESTION, CONCERN)

**Response (200 OK):**
```json
[
    {
        "id": 3,
        "comment_type": "SIDE_EFFECT",
        "content": "Mild headache after taking",
        "severity": 4,
        "effectiveness": null,
        "time_ago": "2 hours ago",
        "created_at": "2024-01-16T11:30:00Z"
    },
    {
        "id": 2,
        "comment_type": "EFFECTIVENESS",
        "content": "Feeling much better today",
        "severity": null,
        "effectiveness": 9,
        "time_ago": "1 day ago",
        "created_at": "2024-01-15T14:20:00Z"
    }
]
```

---

### 13. Get Medication Adherence Statistics
**Endpoint:** `GET /api/medications/medications/{id}/adherence/`

**Description:** Get adherence statistics for a specific medication

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `days` - Number of days to analyze (default: 30)

**Response (200 OK):**
```json
{
    "total_scheduled": 60,
    "total_taken": 52,
    "total_missed": 8,
    "adherence_rate": 86.67,
    "daily_trend": [
        {
            "date": "2024-01-16",
            "taken": 2,
            "total": 2,
            "rate": 100.0
        },
        {
            "date": "2024-01-15",
            "taken": 2,
            "total": 2,
            "rate": 100.0
        },
        {
            "date": "2024-01-14",
            "taken": 1,
            "total": 2,
            "rate": 50.0
        }
    ]
}
```

---

### 14. Refill Medication
**Endpoint:** `POST /api/medications/medications/{id}/refill/`

**Description:** Increment refill count for a medication

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
    "message": "Refill count updated",
    "refills_remaining": 3
}
```

---

### 15. Get Active Medications
**Endpoint:** `GET /api/medications/medications/active/`

**Description:** Get all active medications for the user

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
    "count": 2,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 1,
            "name": "Amoxicillin",
            "dosage": "500mg",
            "frequency_display": "Twice daily",
            "status": "ACTIVE",
            "is_active": true
        },
        {
            "id": 2,
            "name": "Ibuprofen",
            "dosage": "400mg",
            "frequency_display": "Three times daily",
            "status": "ACTIVE",
            "is_active": true
        }
    ]
}
```

---

## Schedule Endpoints (`/api/medications/schedules/`)

### 1. List All Schedules
**Endpoint:** `GET /api/medications/schedules/`

**Description:** Get all medication schedules for the user

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
[
    {
        "id": 1,
        "medication": 1,
        "scheduled_time": "09:00:00",
        "time_formatted": "09:00 AM",
        "dosage": "500mg",
        "days_of_week": [0, 1, 2, 3, 4, 5, 6],
        "days_display": "Mon, Tue, Wed, Thu, Fri, Sat, Sun",
        "is_active": true,
        "created_at": "2024-01-15T10:31:00Z"
    }
]
```

---

### 2. Update Schedule
**Endpoint:** `PUT/PATCH /api/medications/schedules/{id}/`

**Description:** Update a schedule

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
    "scheduled_time": "10:00:00",
    "dosage": "250mg"
}
```

**Response (200 OK):**
```json
{
    "id": 1,
    "scheduled_time": "10:00:00",
    "time_formatted": "10:00 AM",
    "dosage": "250mg",
    "days_of_week": [0, 1, 2, 3, 4, 5, 6],
    "days_display": "Mon, Tue, Wed, Thu, Fri, Sat, Sun",
    "is_active": true,
    "updated_at": "2024-01-16T12:00:00Z"
}
```

---

### 3. Delete Schedule
**Endpoint:** `DELETE /api/medications/schedules/{id}/`

**Description:** Delete a schedule

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (204 No Content)**

---

## Intake Endpoints (`/api/medications/intakes/`)

### 1. List All Intakes
**Endpoint:** `GET /api/medications/intakes/`

**Description:** Get all medication intakes for the user

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `date` - Filter by date (YYYY-MM-DD)
- `status` - Filter by status (TAKEN, MISSED, SKIPPED, LATE)

**Response (200 OK):**
```json
[
    {
        "id": 6,
        "medication": 1,
        "scheduled_time": "2024-01-16T09:00:00Z",
        "scheduled_time_formatted": "2024-01-16 09:00 AM",
        "taken_at": "2024-01-16T09:15:00Z",
        "taken_at_formatted": "2024-01-16 09:15 AM",
        "status": "TAKEN",
        "status_display": "Taken",
        "dosage_taken": "500mg",
        "created_at": "2024-01-16T09:15:00Z"
    }
]
```

---

### 2. Add Comment to Intake
**Endpoint:** `POST /api/medications/intakes/{id}/add_comment/`

**Description:** Add a comment to a specific intake

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
    "comment_type": "NOTE",
    "content": "Felt dizzy after taking this dose"
}
```

**Response (201 Created):**
```json
{
    "id": 4,
    "comment_type": "NOTE",
    "content": "Felt dizzy after taking this dose",
    "severity": null,
    "effectiveness": null,
    "time_ago": "Just now",
    "created_at": "2024-01-16T14:30:00Z"
}
```

---

## Comment Endpoints (`/api/medications/comments/`)

### 1. List All Comments
**Endpoint:** `GET /api/medications/comments/`

**Description:** Get all comments for the user

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
[
    {
        "id": 4,
        "medication": 1,
        "comment_type": "NOTE",
        "content": "Felt dizzy after taking this dose",
        "severity": null,
        "effectiveness": null,
        "time_ago": "5 minutes ago",
        "created_at": "2024-01-16T14:30:00Z"
    }
]
```

---

### 2. Update Comment
**Endpoint:** `PUT/PATCH /api/medications/comments/{id}/`

**Description:** Update a comment

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
    "content": "Updated comment content"
}
```

**Response (200 OK):**
```json
{
    "id": 4,
    "content": "Updated comment content",
    "updated_at": "2024-01-16T14:35:00Z"
}
```

---

### 3. Delete Comment
**Endpoint:** `DELETE /api/medications/comments/{id}/`

**Description:** Delete a comment

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (204 No Content)**

---

## Dashboard and Statistics Endpoints

### 1. Dashboard
**Endpoint:** `GET /api/medications/dashboard/`

**Description:** Get dashboard summary data

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
    "date": "2024-01-16",
    "summary": {
        "total_medications": 3,
        "today_intakes": {
            "total": 6,
            "taken": 4,
            "pending": 2,
            "completion_rate": 66.67
        },
        "overall_adherence_7d": 85.5
    },
    "upcoming_intakes": [
        {
            "id": 7,
            "medication": 1,
            "scheduled_time": "2024-01-16T21:00:00Z",
            "scheduled_time_formatted": "2024-01-16 09:00 PM",
            "status": "MISSED",
            "medication_name": "Amoxicillin",
            "dosage": "500mg"
        }
    ],
    "recent_comments": [
        {
            "id": 4,
            "medication": 1,
            "comment_type": "NOTE",
            "content": "Felt dizzy after taking",
            "time_ago": "2 hours ago",
            "medication_name": "Amoxicillin"
        }
    ],
    "low_refills": [
        {
            "id": 2,
            "name": "Ibuprofen",
            "refills_remaining": 1,
            "status": "ACTIVE"
        }
    ]
}
```

---

### 2. Statistics
**Endpoint:** `GET /api/medications/statistics/`

**Description:** Get comprehensive medication statistics

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `days` - Number of days to analyze (default: 30)

**Response (200 OK):**
```json
{
    "period_days": 30,
    "medications": {
        "total": 5,
        "active": 3,
        "discontinued": 1,
        "paused": 0,
        "completed": 1
    },
    "intakes": {
        "total": 120,
        "taken": 102,
        "missed": 18,
        "adherence_rate": 85.0
    },
    "adherence_by_medication": [
        {
            "medication_id": 1,
            "name": "Amoxicillin",
            "adherence_rate": 92.5,
            "total_doses": 40,
            "taken_doses": 37
        },
        {
            "medication_id": 2,
            "name": "Ibuprofen",
            "adherence_rate": 78.0,
            "total_doses": 50,
            "taken_doses": 39
        }
    ],
    "comments": {
        "total": 15,
        "side_effects": 8,
        "effectiveness_notes": 4,
        "general_notes": 3
    },
    "refills": {
        "low_refills": 2,
        "no_refills": 1,
        "with_refills": 2
    }
}
```

---

### 3. Today's Intakes
**Endpoint:** `GET /api/medications/today/`

**Description:** Get all intakes scheduled for today

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
    "date": "2024-01-16",
    "total": 6,
    "taken": 4,
    "pending": 2,
    "completion_rate": 66.67,
    "intakes": [
        {
            "id": 1,
            "medication": 1,
            "medication_name": "Amoxicillin",
            "scheduled_time": "2024-01-16T09:00:00Z",
            "scheduled_time_formatted": "2024-01-16 09:00 AM",
            "status": "TAKEN",
            "dosage": "500mg"
        },
        {
            "id": 7,
            "medication": 1,
            "medication_name": "Amoxicillin",
            "scheduled_time": "2024-01-16T21:00:00Z",
            "scheduled_time_formatted": "2024-01-16 09:00 PM",
            "status": "MISSED",
            "dosage": "500mg"
        }
    ]
}
```

---

### 4. Upcoming Intakes
**Endpoint:** `GET /api/medications/upcoming/`

**Description:** Get upcoming intakes for the next specified hours

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `hours` - Number of hours to look ahead (default: 24)

**Response (200 OK):**
```json
[
    {
        "id": 7,
        "medication": 1,
        "medication_name": "Amoxicillin",
        "scheduled_time": "2024-01-16T21:00:00Z",
        "scheduled_time_formatted": "2024-01-16 09:00 PM",
        "status": "MISSED",
        "dosage": "500mg"
    },
    {
        "id": 8,
        "medication": 2,
        "medication_name": "Ibuprofen",
        "scheduled_time": "2024-01-17T08:00:00Z",
        "scheduled_time_formatted": "2024-01-17 08:00 AM",
        "status": "MISSED",
        "dosage": "400mg"
    }
]
```

---

## Error Responses

### 400 Bad Request
```json
{
    "field_name": ["Error message"]
}
```

### 401 Unauthorized
```json
{
    "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
    "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
    "detail": "Not found."
}
```

### 500 Internal Server Error
```json
{
    "error": "Internal server error"
}
```

---

## Authentication Header Format
For all authenticated endpoints, include the JWT token in the Authorization header:
```
Authorization: Bearer <your_access_token>
```

## Pagination
List endpoints support pagination with the following query parameters:
- `page` - Page number (default: 1)
- `page_size` - Items per page (default: 20, max: 100)

Pagination response format:
```json
{
    "count": 100,
    "next": "http://localhost:8000/api/endpoint/?page=2",
    "previous": null,
    "results": [...]
}
```

## Filtering
Many endpoints support filtering via query parameters. Common filters:
- `?status=ACTIVE` - Filter by status
- `?search=amoxicillin` - Search by name/text
- `?start_date=2024-01-01` - Filter by start date
- `?end_date=2024-01-31` - Filter by end date