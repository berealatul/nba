# NBA API Reference

**Base URL:** `http://localhost/nba/api/`  
**Authentication:** All endpoints (except login) require: `Authorization: Bearer <jwt_token>`

---

## Table of Contents

1. [Authentication](#authentication) - 4 endpoints
2. [Course Management](#course-management) - 2 endpoints
3. [Assessment Management](#assessment-management) - 2 endpoints
4. [Marks Management](#marks-management) - 6 endpoints
5. [Question Management](#question-management) - 2 endpoints
6. [Student Enrollment](#student-enrollment) - 2 endpoints
7. [Error Codes](#error-codes)

---

## Authentication

### 1. Login
**POST** `/login`

```json
// REQUEST
{
  "employeeIdOrEmail": "admin@nba.edu",
  "password": "admin123"
}

// RESPONSE (200)
{
  "success": true,
  "token": "eyJ0eXAiOiJKV1QiLCJhbGci...",
  "user": {
    "employee_id": 1,
    "username": "admin",
    "email": "admin@nba.edu",
    "role": "admin",
    "department_name": "Computer Science",  // null if admin
    "department_code": "CSE"                 // null if admin
  }
}

// ERROR (401)
{"success": false, "message": "Invalid credentials"}
```

---

### 2. Get Profile
**GET** `/profile`

```json
// RESPONSE (200)
{
  "success": true,
  "data": {
    "employee_id": 1,
    "username": "admin",
    "email": "admin@nba.edu",
    "role": "admin"
  }
}
```

---

### 3. Update Profile
**PUT** `/profile`

```json
// REQUEST (all optional)
{
  "username": "newusername",
  "email": "newemail@nba.edu",
  "password": "newpassword",
  "role": "faculty"
}

// RESPONSE (200)
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { /* updated user */ }
}
```

---

### 4. Logout
**POST** `/logout`

```json
// RESPONSE (200)
{"success": true, "message": "Logout successful"}
```

---

## Course Management

### 5. Get Faculty Courses
**GET** `/courses`

```json
// RESPONSE (200)
{
  "success": true,
  "data": [
    {
      "id": 1,
      "course_code": "CS101",
      "course_name": "Data Structures",
      "year": 2024,
      "semester": 3,
      "faculty_name": "Dr. Kumar"
    }
  ]
}
```

---

### 6. Get Course Tests
**GET** `/course-tests?course_id=1`

```json
// RESPONSE (200)
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Mid Semester",
      "full_marks": 50,
      "pass_marks": 20,
      "question_count": 10
    }
  ]
}
```

---

## Assessment Management

### 7. Create Assessment
**POST** `/assessment`

```json
// REQUEST
{
  "course_id": 1,
  "name": "Mid Semester",
  "full_marks": 50,
  "pass_marks": 20,
  "question_paper_pdf": "base64_string...",  // optional
  "questions": [
    {
      "question_number": 1,
      "sub_question": null,     // or "a", "b", etc.
      "co": 1,                  // 1-6
      "max_marks": 10.0,
      "is_optional": false
    }
  ]
}

// RESPONSE (201)
{
  "success": true,
  "message": "Assessment created successfully",
  "data": {
    "test_id": 1,
    "test_name": "Mid Semester",
    "question_paper_filename": "CS101_2024_3_MidSemester.pdf",
    "questions": [ /* array */ ]
  }
}

// NOTE: Filename format: courseCode_year_semester_testName.pdf
```

---

### 8. Get Assessment Details
**GET** `/assessment?test_id=1`

```json
// RESPONSE (200)
{
  "success": true,
  "data": {
    "test": {
      "id": 1,
      "name": "Mid Semester",
      "full_marks": 50,
      "question_paper_filename": "CS101_2024_3_MidSemester.pdf"
    },
    "course": {
      "id": 1,
      "course_code": "CS101",
      "course_name": "Data Structures"
    },
    "questions": [
      {
        "id": 1,
        "question_number": 1,
        "sub_question": null,
        "question_identifier": "1",
        "co": 1,
        "max_marks": 10.0,
        "is_optional": false
      }
    ]
  }
}
```

---

## Marks Management

### 9. Save Marks by Question
**POST** `/marks/by-question`

```json
// REQUEST
{
  "test_id": 1,
  "student_id": "CS101",
  "marks": [
    {"question_id": 1, "marks": 8.5},
    {"question_id": 2, "marks": 4.0}
  ]
}

// RESPONSE (200)
{
  "success": true,
  "message": "Marks saved successfully",
  "co_totals": {
    "CO1": 17.5,
    "CO2": 12.0
  }
}

// NOTE: CO totals auto-calculated
```

---

### 10. Save Marks by CO
**POST** `/marks/by-co`

```json
// REQUEST
{
  "test_id": 1,
  "student_id": "CS101",
  "CO1": 17.5,
  "CO2": 12.0,
  "CO3": 8.5,
  "CO4": 0,
  "CO5": 0,
  "CO6": 0
}

// RESPONSE (200)
{
  "success": true,
  "message": "Marks saved successfully"
}
```

---

### 11. Bulk Save Marks
**POST** `/marks/bulk`

```json
// REQUEST
{
  "test_id": 1,
  "marks_entries": [
    {
      "student_rollno": "CS101",
      "question_number": 1,
      "sub_question": null,
      "marks_obtained": 8.5
    }
  ]
}

// RESPONSE (200)
{
  "success": true,
  "message": "Marks entry completed: 1 successful, 0 failed",
  "data": {
    "successful": [ /* entries */ ],
    "failed": [ /* entries with reasons */ ],
    "total": 1,
    "success_count": 1,
    "failure_count": 0
  }
}

// NOTE: Handles partial failures
```

---

### 12. Get Student Marks
**GET** `/marks?test_id=1&student_id=CS101`

```json
// RESPONSE (200)
{
  "success": true,
  "data": {
    "marks": {
      "CO1": 17.5,
      "CO2": 12.0
    },
    "raw_marks": [
      {
        "question_number": 1,
        "marks_obtained": 8.5
      }
    ]
  }
}
```

---

### 13. Get Test Marks (All Students)
**GET** `/marks/test?test_id=1&include_raw=true`

```json
// RESPONSE (200)
{
  "success": true,
  "data": {
    "test": { "test_name": "Mid Semester" },
    "course": { "course_code": "CS101" },
    "students": [
      {
        "student_rollno": "CS101",
        "student_name": "John Doe",
        "marks": { "CO1": 17.5, "CO2": 12.0 },
        "raw_marks": [ /* if include_raw=true */ ]
      }
    ]
  }
}

// NOTE: Use ?include_raw=true for per-question marks
```

---

### 14. Update Raw Marks Entry
**PUT** `/marks/raw/{id}`

```json
// REQUEST
{
  "marks_obtained": 8.5
}

// RESPONSE (200)
{
  "success": true,
  "message": "Marks updated successfully",
  "data": {
    "raw_marks_id": 789,
    "marks_obtained": 8.5
  }
}

// ERROR (400)
{"success": false, "message": "Marks cannot exceed maximum"}

// NOTE: CO totals auto-recalculated
```

---

### 15. Delete Raw Marks Entry
**DELETE** `/marks/raw/{id}`

```json
// RESPONSE (200)
{"success": true, "message": "Marks entry deleted successfully"}

// NOTE: CO totals auto-recalculated
```

---

### 16. Delete All Student Marks
**DELETE** `/marks/student/{testId}/{studentId}`

```json
// RESPONSE (200)
{
  "success": true,
  "message": "All marks for student deleted successfully",
  "data": {
    "raw_marks_deleted": 10,
    "co_marks_deleted": 6
  }
}

// NOTE: Deletes both raw and aggregated marks
```

---

## Question Management

### 17. Update Question
**PUT** `/questions/{id}`

```json
// REQUEST (all optional)
{
  "co_number": 3,
  "max_marks": 10.0,
  "is_optional": false
}

// RESPONSE (200)
{
  "success": true,
  "message": "Question updated successfully",
  "data": {
    "question_id": 123,
    "co_number": 3,
    "max_marks": 10.0
  }
}
```

---

### 18. Delete Question
**DELETE** `/questions/{id}`

```json
// RESPONSE (200)
{"success": true, "message": "Question deleted successfully"}

// ⚠️ WARNING: Cascade deletes all raw marks
```

---

## Student Enrollment

### 19. Bulk Enroll Students
**POST** `/courses/{courseId}/enroll`

```json
// REQUEST
{
  "students": [
    {"rollno": "CS101", "name": "John Doe"},
    {"rollno": "CS102", "name": "Jane Smith"}
  ]
}

// RESPONSE (200)
{
  "success": true,
  "message": "Enrollment completed: 2 successful, 0 failed",
  "data": {
    "successful": [ /* entries */ ],
    "failed": [ /* entries with reasons */ ],
    "total": 2,
    "success_count": 2,
    "failure_count": 0
  }
}

// NOTE: Auto-creates students if they don't exist
```

---

### 20. Get Course Enrollments
**GET** `/courses/{courseId}/enrollments?test_id={testId}`

```json
// RESPONSE (200)
{
  "success": true,
  "data": {
    "course_id": 1,
    "course_code": "CS101",
    "enrollment_count": 3,
    "enrollments": [
      {
        "student_rollno": "CS101",
        "student_name": "John Doe",
        "enrolled_at": "2025-11-04 10:30:00"
      }
    ],
    "test_info": {  // only if test_id provided
      "test_id": 5,
      "test_name": "Mid Semester",
      "questions": [ /* array */ ]
    }
  }
}

// NOTE: Include test_id to get questions for marks entry
```

---

## Error Codes

| Code | Meaning | Common Fix |
|------|---------|-----------|
| 200 | Success | - |
| 400 | Bad Request | Check input format |
| 401 | Unauthorized | Add valid JWT token |
| 403 | Forbidden | Use account that owns resource |
| 404 | Not Found | Check resource ID |
| 409 | Conflict | Resource already exists |
| 500 | Server Error | Check database connection |

---

## Response Format

### Success
```json
{
  "success": true,
  "message": "Operation description",
  "data": { /* response data */ }
}
```

### Error
```json
{
  "success": false,
  "message": "Error description"
}
```

### Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["Field X required", "Field Y invalid"]
}
```

---

## Important Notes

- **Authentication**: JWT token required (except login)
- **Authorization**: Faculty can only modify their own courses
- **CO Aggregation**: Automatic after marks changes
- **Cascade Deletes**: Database handles related deletions
- **Bulk Operations**: Partial failures don't stop operation
- **PDF Filenames**: Format `courseCode_year_semester_testName.pdf`
- **Question IDs**: Format `"1"` (main) or `"2a"` (sub-question)

---

**Version**: 1.0 | **Last Updated**: January 2025
