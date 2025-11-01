# NBA API Documentation

## Overview

The NBA API is a RESTful web service built with PHP following SOLID principles. It provides user authentication and profile management functionality with JWT-based security.

**Base URL:** `http://localhost/nba/api/`

## Authentication

All API requests (except login) require JWT authentication via the `Authorization` header:
```
Authorization: Bearer <jwt_token>
```

## API Endpoints

### 1. User Login

**Endpoint:** `POST /login`

**Description:** Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "employeeIdOrEmail": "string",
  "password": "string"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": {
      "employee_id": 3001,
      "username": "Dr. Nityananda Sarma",
      "email": "nityananda@tezu.ernet.in",
      "role": "faculty",
      "department_id": 1,
      "department_name": "Computer Science & Engineering",
      "department_code": "CSE"
    }
  }
}
```

**Note:** If the user has no department (`department_id` is `null`), the `department_name` and `department_code` fields will not be included in the response.

**Example for Admin (no department):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": {
      "employee_id": 1001,
      "username": "System Administrator",
      "email": "admin@tezu.edu",
      "role": "admin",
      "department_id": null
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**Validation Error Response (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Employee ID or email is required",
    "Password is required"
  ]
}
```

### 2. Get User Profile

**Endpoint:** `GET /profile`

**Description:** Retrieve the authenticated user's profile information.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "employee_id": 1,
    "username": "admin",
    "email": "admin@nba.edu",
    "role": "admin",
    "department_id": null
  }
}
```

**Unauthorized Response (401):**
```json
{
  "success": false,
  "message": "Unauthorized access",
  "error": "Invalid or missing authentication token"
}
```

### 3. Update User Profile

**Endpoint:** `PUT /profile`

**Description:** Update the authenticated user's profile information.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body (all fields optional):**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "string"
}
```

**Important:** Users **cannot** change their `department_id`. Any attempt to include `department_id` in the request will result in a validation error.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "employee_id": 1,
    "username": "newusername",
    "email": "newemail@nba.edu",
    "role": "admin",
    "department_id": 2
  }
}
```

**Validation Error Response (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Username must be at least 3 characters long",
    "Invalid email format",
    "Department cannot be changed by user"
  ]
}
```

**Conflict Error Response (409):**
```json
{
  "success": false,
  "message": "Username already exists"
}
```

### 4. User Logout

**Endpoint:** `POST /logout`

**Description:** Logout the authenticated user (client-side token invalidation).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### 5. Get My Department

**Endpoint:** `GET /department`

**Description:** Retrieve department information for the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Department information retrieved successfully",
  "data": {
    "department_id": 1,
    "department_name": "Computer Science",
    "department_code": "CS"
  }
}
```

**Success Response (200) - No Department:**
```json
{
  "success": true,
  "message": "Department information retrieved successfully",
  "data": null
}
```

**Unauthorized Response (401):**
```json
{
  "success": false,
  "message": "Unauthorized access",
  "error": "Invalid or missing authentication token"
}
```

---

## Assessment API

### 6. Get Faculty Courses

**Endpoint:** `GET /courses`

**Description:** Get all courses assigned to the authenticated faculty member.

**Authentication:** Required (Faculty only)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Courses retrieved successfully",
  "data": [
    {
      "id": 1,
      "course_code": "CS101",
      "name": "Introduction to Programming",
      "credit": 4,
      "syllabus": "Basic programming concepts, variables, loops...",
      "faculty_id": 3001,
      "year": 1,
      "semester": 1
    },
    {
      "id": 2,
      "course_code": "CS201",
      "name": "Data Structures",
      "credit": 4,
      "syllabus": "Arrays, linked lists, trees, graphs...",
      "faculty_id": 3001,
      "year": 2,
      "semester": 1
    }
  ]
}
```

**Access Denied Response (403):**
```json
{
  "success": false,
  "message": "Access denied. Faculty only."
}
```

**Note:** The response includes year and semester for each course. Frontend can filter/group courses by these fields as needed without requiring additional API calls.

### 7. Create Assessment (Test + Questions)

**Endpoint:** `POST /assessment`

**Description:** Create a new assessment test with questions mapped to Course Outcomes (CO 1-6). The sum of all question marks must equal the full_marks of the test.

**Authentication:** Required (Faculty only)

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "course_id": 1,
  "name": "Mid Semester Examination",
  "full_marks": 50,
  "pass_marks": 20,
  "question_link": "https://example.com/questions/mid-sem.pdf",
  "questions": [
    {
      "question_number": 1,
      "co": 1,
      "max_marks": 5,
      "description": "Define data structures and algorithms"
    },
    {
      "question_number": 2,
      "sub_question": "a",
      "co": 2,
      "max_marks": 3,
      "description": "Explain arrays"
    },
    {
      "question_number": 2,
      "sub_question": "b",
      "co": 2,
      "max_marks": 3,
      "description": "Explain linked lists"
    },
    {
      "question_number": 5,
      "sub_question": "a",
      "is_optional": true,
      "co": 3,
      "max_marks": 10,
      "description": "Write algorithm for sorting (Attempt either 5a OR 5b)"
    },
    {
      "question_number": 5,
      "sub_question": "b",
      "is_optional": true,
      "co": 3,
      "max_marks": 10,
      "description": "Write algorithm for searching (Attempt either 5a OR 5b)"
    }
  ]
}
```

**Field Descriptions:**
- `course_id`: Course ID (must be a course assigned to the faculty)
- `name`: Test name (e.g., "Mid Semester", "End Semester", "Quiz 1")
- `full_marks`: Total marks for the test (must be > 0)
- `pass_marks`: Minimum marks to pass (must be >= 0 and <= full_marks)
- `question_link`: Optional URL to the question paper PDF
- `questions`: Array of questions with detailed structure
  - `question_number`: Main question number (1-20, required)
  - `sub_question`: Sub-question identifier ('a'-'h', optional)
  - `is_optional`: Boolean flag for optional questions (default: false)
  - `co`: Course Outcome number (1-6, required)
  - `max_marks`: Maximum marks (supports decimals like 2.5, min 0.5, required)
  - `description`: Question text/description (optional)

**Important Validation Rules:**
- Question numbers must be between 1 and 20
- Sub-questions must be between 'a' and 'h' (if provided)
- CO must be between 1 and 6
- Max marks must be at least 0.5
- Faculty can only create assessments for their own courses
- **No marks sum validation** - supports optional questions and flexible structures

**Question Identifier Format:**
- Main question: `"1"` (question_number only)
- Sub-question: `"2a"`, `"5b"` (question_number + sub_question)
- Used later for assigning student marks

**Success Response (201):**
```json
{
  "success": true,
  "message": "Assessment created successfully",
  "data": {
    "test": {
      "id": 1,
      "course_id": 1,
      "name": "Mid Semester Examination",
      "full_marks": 50,
      "pass_marks": 20,
      "question_link": "https://example.com/questions/mid-sem.pdf"
    },
    "questions": [
      {
        "id": 1,
        "test_id": 1,
        "question_number": 1,
        "sub_question": null,
        "question_identifier": "1",
        "is_optional": false,
        "co": 1,
        "max_marks": 5,
        "description": "Define data structures and algorithms"
      },
      {
        "id": 2,
        "test_id": 1,
        "question_number": 2,
        "sub_question": "a",
        "question_identifier": "2a",
        "is_optional": false,
        "co": 2,
        "max_marks": 3,
        "description": "Explain arrays"
      },
      {
        "id": 3,
        "test_id": 1,
        "question_number": 5,
        "sub_question": "a",
        "question_identifier": "5a",
        "is_optional": true,
        "co": 3,
        "max_marks": 10,
        "description": "Write algorithm for sorting"
      }
    ]
  }
}
```
        "co": 3,
        "max_marks": 10
      },
      {
        "id": 4,
        "test_id": 1,
        "co": 4,
        "max_marks": 15
      }
    ]
  }
}
```

**Validation Error Response (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Total marks of questions (40) does not match full marks (50)",
    "CO must be between 1 and 6"
  ]
}
```

**Access Denied Response (403):**
```json
{
  "success": false,
  "message": "Access denied. You can only create assessments for your own courses."
}
```

### 8. Get Assessment Details

**Endpoint:** `GET /assessment`

**Description:** Get complete details of a test including all questions and course information.

**Authentication:** Required (Faculty only)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `test_id` (required): Test ID to retrieve

**Example Request:**
```
GET /assessment?test_id=1
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Assessment retrieved successfully",
  "data": {
    "test": {
      "id": 1,
      "course_id": 1,
      "name": "Mid Semester Examination",
      "full_marks": 50,
      "pass_marks": 20,
      "question_link": "https://example.com/questions/mid-sem.pdf"
    },
    "course": {
      "id": 1,
      "course_code": "CS101",
      "name": "Introduction to Programming",
      "credit": 4,
      "year": 1,
      "semester": 1
    },
    "questions": [
      {
        "id": 1,
        "test_id": 1,
        "co": 1,
        "max_marks": 10
      },
      {
        "id": 2,
        "test_id": 1,
        "co": 2,
        "max_marks": 15
      },
      {
        "id": 3,
        "test_id": 1,
        "co": 3,
        "max_marks": 10
      },
      {
        "id": 4,
        "test_id": 1,
        "co": 4,
        "max_marks": 15
      }
    ]
  }
}
```

**Not Found Response (404):**
```json
{
  "success": false,
  "message": "Test not found"
}
```

### 9. Get Course Tests

**Endpoint:** `GET /course-tests`

**Description:** Get all tests for a specific course.

**Authentication:** Required (Faculty only)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `course_id` (required): Course ID to get tests for

**Example Request:**
```
GET /course-tests?course_id=1
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Tests retrieved successfully",
  "data": [
    {
      "id": 1,
      "course_id": 1,
      "name": "Mid Semester Examination",
      "full_marks": 50,
      "pass_marks": 20,
      "question_link": "https://example.com/questions/mid-sem.pdf"
    },
    {
      "id": 2,
      "course_id": 1,
      "name": "End Semester Examination",
      "full_marks": 100,
      "pass_marks": 40,
      "question_link": "https://example.com/questions/end-sem.pdf"
    }
  ]
}
```

**Access Denied Response (403):**
```json
{
  "success": false,
  "message": "Access denied. You can only view tests for your own courses."
}
```

---

## Data Models

### User Object
```json
{
  "employee_id": "number",
  "username": "string (full name)",
  "email": "string",
  "role": "string",
  "department_id": "number|null"
}
```

### Department Object
```json
{
  "department_id": "number",
  "department_name": "string",
  "department_code": "string"
}
```

### Course Object
```json
{
  "id": "number",
  "course_code": "string (max 20 characters)",
  "name": "string (max 255 characters)",
  "credit": "number (non-negative)",
  "syllabus": "string|null",
  "faculty_id": "number",
  "year": "number (1-5)",
  "semester": "number (1-2)"
}
```

### Test Object
```json
{
  "id": "number",
  "course_id": "number",
  "name": "string (max 255 characters)",
  "full_marks": "number (> 0)",
  "pass_marks": "number (>= 0)",
  "question_link": "string|null (URL)"
}
```

### Question Object
```json
{
  "id": "number",
  "test_id": "number",
  "question_number": "number (1-20, required)",
  "sub_question": "string ('a'-'h') | null (optional)",
  "question_identifier": "string (e.g., '1', '2a', '5b')",
  "is_optional": "boolean (default: false)",
  "co": "number (1-6, Course Outcome)",
  "max_marks": "decimal (>= 0.5, supports decimals)",
  "description": "string|null (question text)"
}
```

**Question Examples:**
- Main question without sub-parts: `{"question_number": 1, "sub_question": null}` → Identifier: `"1"`
- Sub-question: `{"question_number": 2, "sub_question": "a"}` → Identifier: `"2a"`
- Optional question: `{"question_number": 5, "sub_question": "a", "is_optional": true}` → For "Attempt either 5a OR 5b" scenarios

## Validation Rules

### Login Validation
- `employeeIdOrEmail`: Required
- `password`: Required

### Profile Update Validation
- `username`: Optional, minimum 2 characters (full name)
- `email`: Optional, valid email format
- `password`: Optional, minimum 6 characters
- `role`: Optional, must be one of: `admin`, `dean`, `hod`, `faculty`, `staff`
- `department_id`: Optional, positive number or null

### Course Validation
- `course_code`: Required, max 20 characters
- `name`: Required, max 255 characters
- `credit`: Required, non-negative number
- `syllabus`: Optional, text
- `faculty_id`: Required, must be a valid faculty member
- `year`: Required, must be between 1-5
- `semester`: Required, must be 1 or 2

### Test Validation
- `course_id`: Required, must be a course assigned to the faculty
- `name`: Required, max 255 characters
- `full_marks`: Required, must be greater than 0
- `pass_marks`: Required, must be >= 0 and <= full_marks
- `question_link`: Optional, valid URL format

### Question Validation
- `test_id`: Required, must be a valid test
- `question_number`: Required, must be between 1-20
- `sub_question`: Optional, must be 'a'-'h' if provided
- `is_optional`: Optional, boolean (default false)
- `co`: Required, must be between 1-6 (Course Outcome)
- `max_marks`: Required, must be >= 0.5 (supports decimals like 2.5)
- `description`: Optional, question text
- **No total marks validation** - System supports optional questions and flexible test structures

## User Roles

- `admin`: System administrator
- `dean`: Academic dean
- `hod`: Head of department
- `faculty`: Teaching faculty member
- `staff`: Administrative staff

## Sample Test Data

After running the database setup, the following test users are available:

| Employee ID | Full Name           | Email              | Role    | Department          |
|-------------|---------------------|--------------------|---------|---------------------|
| 1001        | System Administrator| admin@nba.edu      | admin   | None                |
| 2001        | John Doe            | john.doe@nba.edu   | faculty | Computer Science    |
| 3001        | Jane Doe            | jane.doe@nba.edu   | staff   | Administration      |
| 4001        | Bob Smith           | bob.smith@nba.edu  | hod     | Information Technology |

## Departments

| ID | Name                  | Code  |
|----|-----------------------|-------|
| 1  | Computer Science      | CS    |
| 2  | Information Technology| IT    |
| 3  | Mechanical Engineering| ME    |
| 4  | Electrical Engineering| EE    |
| 5  | Administration        | ADMIN |

## Error Handling

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "message": "string",
  "data": "object|array|null"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "string",
  "error": "string", // optional
  "errors": "array"  // optional, for validation errors
}
```

## HTTP Status Codes

- `200`: Success
- `400`: Bad Request (validation errors)
- `401`: Unauthorized
- `404`: Not Found
- `409`: Conflict (duplicate data)
- `500`: Internal Server Error

## CORS Support

The API includes CORS headers to support cross-origin requests from web applications:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With
```

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Input sanitization and validation
- SQL injection prevention with prepared statements
- XSS protection with input sanitization