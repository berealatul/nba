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
      "syllabus_filename": "CS101_2024_1.pdf",
      "has_syllabus_pdf": true,
      "faculty_id": 3001,
      "year": 2024,
      "semester": 1
    },
    {
      "id": 2,
      "course_code": "CS201",
      "name": "Data Structures",
      "credit": 4,
      "syllabus_filename": null,
      "has_syllabus_pdf": false,
      "faculty_id": 3001,
      "year": 2024,
      "semester": 2
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
  "question_paper_pdf": "base64_encoded_pdf_string_here...",
  "questions": [
    {
      "question_number": 1,
      "co": 1,
      "max_marks": 5
    },
    {
      "question_number": 2,
      "sub_question": "a",
      "co": 2,
      "max_marks": 3
    },
    {
      "question_number": 2,
      "sub_question": "b",
      "co": 2,
      "max_marks": 3
    },
    {
      "question_number": 5,
      "sub_question": "a",
      "is_optional": true,
      "co": 3,
      "max_marks": 10
    },
    {
      "question_number": 5,
      "sub_question": "b",
      "is_optional": true,
      "co": 3,
      "max_marks": 10
    }
  ]
}
```

**Field Descriptions:**
- `course_id`: Course ID (must be a course assigned to the faculty)
- `name`: Test name (e.g., "Mid Semester", "End Semester", "Quiz 1")
- `full_marks`: Total marks for the test (must be > 0)
- `pass_marks`: Minimum marks to pass (must be >= 0 and <= full_marks)
- `question_paper_pdf`: Optional base64-encoded PDF file
- `questions`: Array of questions with detailed structure
  - `question_number`: Main question number (1-20, required)
  - `sub_question`: Sub-question identifier ('a'-'h', optional)
  - `is_optional`: Boolean flag for optional questions (default: false)
  - `co`: Course Outcome number (1-6, required)
  - `max_marks`: Maximum marks (supports decimals like 2.5, min 0.5, required)

**Note**: The `question_paper_filename` is automatically generated as `courseCode_year_semester_testName.pdf` and returned in responses.

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
      "question_paper_filename": "CS101_2024_1_Mid_Semester_Examination.pdf",
      "has_question_paper_pdf": true
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
        "max_marks": 5
      },
      {
        "id": 2,
        "test_id": 1,
        "question_number": 2,
        "sub_question": "a",
        "question_identifier": "2a",
        "is_optional": false,
        "co": 2,
        "max_marks": 3
      },
      {
        "id": 3,
        "test_id": 1,
        "question_number": 5,
        "sub_question": "a",
        "question_identifier": "5a",
        "is_optional": true,
        "co": 3,
        "max_marks": 10
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
      "question_paper_filename": "CS101_2024_1_Mid_Semester_Examination.pdf",
      "has_question_paper_pdf": true
    },
    "course": {
      "id": 1,
      "course_code": "CS101",
      "name": "Introduction to Programming",
      "credit": 4,
      "syllabus_filename": "CS101_2024_1.pdf",
      "has_syllabus_pdf": true,
      "faculty_id": 3001,
      "year": 2024,
      "semester": 1
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
        "max_marks": 10
      },
      {
        "id": 2,
        "test_id": 1,
        "question_number": 2,
        "sub_question": null,
        "question_identifier": "2",
        "is_optional": false,
        "co": 2,
        "max_marks": 15
      },
      {
        "id": 3,
        "test_id": 1,
        "question_number": 3,
        "sub_question": null,
        "question_identifier": "3",
        "is_optional": false,
        "co": 3,
        "max_marks": 10
      },
      {
        "id": 4,
        "test_id": 1,
        "question_number": 4,
        "sub_question": null,
        "question_identifier": "4",
        "is_optional": false,
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
      "question_paper_filename": "CS101_2024_1_Mid_Semester_Examination.pdf",
      "has_question_paper_pdf": true
    },
    {
      "id": 2,
      "course_id": 1,
      "name": "End Semester Examination",
      "full_marks": 100,
      "pass_marks": 40,
      "question_paper_filename": "CS101_2024_1_End_Semester_Examination.pdf",
      "has_question_paper_pdf": true
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

### 10. Save Marks by Question

**Endpoint:** `POST /marks/by-question`

**Description:** Save marks per question for a student in a test. Automatically calculates CO-aggregated totals and stores them in the marks table.

**Authentication:** Required (Faculty only)

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "test_id": 1,
  "student_id": "CS101",
  "marks": [
    {
      "question_identifier": "1",
      "marks": 5
    },
    {
      "question_identifier": "2a",
      "marks": 3
    },
    {
      "question_identifier": "2b",
      "marks": 2.5
    },
    {
      "question_identifier": "5a",
      "marks": 8
    }
  ]
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Marks saved successfully",
  "data": {
    "student_id": "CS101",
    "test_id": 1,
    "co_totals": {
      "CO1": 5,
      "CO2": 5.5,
      "CO3": 8,
      "CO4": 0,
      "CO5": 0,
      "CO6": 0
    }
  }
}
```

**Validation Error Response (400):**
```json
{
  "success": false,
  "message": "Marks for question '2a' exceed maximum (3)"
}
```

**Note:** 
- Question identifiers match the format: `{question_number}` or `{question_number}{sub_question}` (e.g., "1", "2a", "5b")
- Marks are validated against the max_marks for each question
- CO totals are automatically calculated by summing marks for all questions mapped to each CO
- Raw marks (per-question) and aggregated marks (per-CO) are both stored

---

### 11. Save Marks by CO

**Endpoint:** `POST /marks/by-co`

**Description:** Directly save CO-aggregated marks for a student. Use this when faculty manually calculates CO totals. Does NOT store per-question raw marks.

**Authentication:** Required (Faculty only)

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "test_id": 1,
  "student_id": "CS101",
  "CO1": 10,
  "CO2": 8.5,
  "CO3": 15,
  "CO4": 7,
  "CO5": 0,
  "CO6": 0
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Marks saved successfully",
  "data": {
    "id": 1,
    "student_id": "CS101",
    "test_id": 1,
    "CO1": 10,
    "CO2": 8.5,
    "CO3": 15,
    "CO4": 7,
    "CO5": 0,
    "CO6": 0
  }
}
```

**Note:**
- All CO values default to 0 if not provided
- CO marks must be non-negative
- Useful when faculty has already grouped marks by CO manually
- No per-question data stored in rawMarks table

---

### 12. Get Student Marks

**Endpoint:** `GET /marks`

**Description:** Get marks (both raw per-question and CO-aggregated) for a specific student in a test.

**Authentication:** Required

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `test_id` (required): Test ID
- `student_id` (required): Student roll number

**Example Request:**
```
GET /marks?test_id=1&student_id=CS101
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "marks": {
      "id": 1,
      "student_id": "CS101",
      "test_id": 1,
      "CO1": 5,
      "CO2": 5.5,
      "CO3": 8,
      "CO4": 0,
      "CO5": 0,
      "CO6": 0
    },
    "raw_marks": [
      {
        "question_identifier": "1",
        "marks": 5,
        "co": 1
      },
      {
        "question_identifier": "2a",
        "marks": 3,
        "co": 2
      },
      {
        "question_identifier": "2b",
        "marks": 2.5,
        "co": 2
      },
      {
        "question_identifier": "5a",
        "marks": 8,
        "co": 3
      }
    ]
  }
}
```

**Note:**
- Returns `null` for `marks` if no CO-aggregated data exists
- Returns empty array for `raw_marks` if no per-question data exists
- Useful for viewing student's detailed performance

---

### 13. Get All Marks for a Test

**Endpoint:** `GET /marks/test`

**Description:** Get marks for all students who have taken a specific test. Returns CO-aggregated marks by default. Add `include_raw=true` to also get per-question raw marks.

**Authentication:** Required (Faculty only - must be the course faculty)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `test_id` (required): Test ID
- `include_raw` (optional): Set to `true` to include raw marks (per-question scores). Default: `false`

**Example Requests:**
```
GET /marks/test?test_id=1
GET /marks/test?test_id=1&include_raw=true
```

**Success Response - Without raw marks (200):**
```json
{
  "success": true,
  "data": {
    "test": {
      "id": 1,
      "course_id": 1,
      "name": "Mid Semester Examination",
      "full_marks": 50,
      "pass_marks": 20,
      "question_paper_filename": "CS101_2024_1_Mid_Semester_Examination.pdf",
      "has_question_paper_pdf": true
    },
    "course": {
      "id": 1,
      "course_code": "CS101",
      "name": "Introduction to Programming"
    },
    "marks": [
      {
        "student_id": "CS101",
        "student_name": "Rajesh Kumar",
        "CO1": 5.0,
        "CO2": 5.5,
        "CO3": 8.0,
        "CO4": 0.0,
        "CO5": 0.0,
        "CO6": 0.0
      },
      {
        "student_id": "CS102",
        "student_name": "Priya Sharma",
        "CO1": 4.0,
        "CO2": 6.0,
        "CO3": 9.0,
        "CO4": 0.0,
        "CO5": 0.0,
        "CO6": 0.0
      }
    ]
  }
}
```

**Success Response - With raw marks (200):**
```json
{
  "success": true,
  "data": {
    "test": {
      "id": 1,
      "course_id": 1,
      "name": "Mid Semester Examination",
      "full_marks": 50,
      "pass_marks": 20,
      "question_paper_filename": "CS101_2024_1_Mid_Semester_Examination.pdf",
      "has_question_paper_pdf": true
    },
    "course": {
      "id": 1,
      "course_code": "CS101",
      "name": "Introduction to Programming"
    },
    "marks": [
      {
        "student_id": "CS101",
        "student_name": "Rajesh Kumar",
        "CO1": 5.0,
        "CO2": 5.5,
        "CO3": 8.0,
        "CO4": 0.0,
        "CO5": 0.0,
        "CO6": 0.0
      }
    ],
    "raw_marks": [
      {
        "student_id": "CS101",
        "student_name": "Rajesh Kumar",
        "raw_marks": [
          {
            "question_id": 1,
            "question_number": 1,
            "sub_question": null,
            "question_identifier": "1",
            "marks_obtained": 5.0,
            "max_marks": 5.0,
            "co": 1
          },
          {
            "question_id": 2,
            "question_number": 2,
            "sub_question": "a",
            "question_identifier": "2a",
            "marks_obtained": 3.5,
            "max_marks": 4.0,
            "co": 2
          },
          {
            "question_id": 3,
            "question_number": 2,
            "sub_question": "b",
            "question_identifier": "2b",
            "marks_obtained": 2.0,
            "max_marks": 3.0,
            "co": 2
          }
        ]
      }
    ],
    "questions": [
      {
        "id": 1,
        "question_number": 1,
        "sub_question": null,
        "question_identifier": "1",
        "max_marks": 5.0,
        "co": 1,
        "is_optional": false
      },
      {
        "id": 2,
        "question_number": 2,
        "sub_question": "a",
        "question_identifier": "2a",
        "max_marks": 4.0,
        "co": 2,
        "is_optional": false
      },
      {
        "id": 3,
        "question_number": 2,
        "sub_question": "b",
        "question_identifier": "2b",
        "max_marks": 3.0,
        "co": 2,
        "is_optional": false
      }
    ]
  }
}
```

**Error Responses:**

**400 - Bad Request:**
```json
{
  "success": false,
  "message": "Missing test_id parameter"
}
```

**401 - Unauthorized:**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

**403 - Forbidden:**
```json
{
  "success": false,
  "message": "You are not authorized to view marks for this test"
}
```

**404 - Not Found:**
```json
{
  "success": false,
  "message": "Test not found"
}
```

**Features:**
- Returns only students who have marks saved
- Faculty authorization: only course faculty can view marks
- Optional raw marks for detailed per-question breakdown
- Includes course information for context
- Questions list when raw marks included
- Useful for generating reports and detailed analysis

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
  "syllabus_filename": "string|null (auto-generated: courseCode_year_semester.pdf)",
  "has_syllabus_pdf": "boolean (true if PDF stored)",
  "faculty_id": "number",
  "year": "number (4-digit calendar year: 1000-9999)",
  "semester": "number (positive integer)"
}
```

**Note**: Syllabus is stored as a PDF in the database (LONGBLOB). The filename is automatically generated from course code, year, and semester (e.g., "CS101_2024_1.pdf"). Use a separate endpoint to download the PDF if needed.

### Test Object
```json
{
  "id": "number",
  "course_id": "number",
  "name": "string (max 255 characters)",
  "full_marks": "number (> 0)",
  "pass_marks": "number (>= 0)",
  "question_paper_filename": "string|null (auto-generated: courseCode_year_semester_testName.pdf)",
  "has_question_paper_pdf": "boolean (true if PDF stored)"
}
```

**Note**: Question paper is stored as a PDF in the database (LONGBLOB). The filename is automatically generated from course code, year, semester, and test name (e.g., "CS101_2024_1_Mid_Semester.pdf"). Use a separate endpoint to download the PDF if needed.

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
  "max_marks": "decimal (>= 0.5, supports decimals)"
}
```

**Note:** Question details (text, images, etc.) are expected to be in the question paper PDF. No separate description field is stored per question.

**Question Examples:**
- Main question without sub-parts: `{"question_number": 1, "sub_question": null}` → Identifier: `"1"`
- Sub-question: `{"question_number": 2, "sub_question": "a"}` → Identifier: `"2a"`
- Optional question: `{"question_number": 5, "sub_question": "a", "is_optional": true}` → For "Attempt either 5a OR 5b" scenarios

### Student Object
```json
{
  "rollno": "string (primary key)",
  "name": "string (max 100 characters)",
  "dept": "number (department_id)"
}
```

### RawMarks Object
```json
{
  "id": "number",
  "test_id": "number",
  "student_id": "string (rollno)",
  "question_id": "number",
  "marks": "decimal (>= 0)"
}
```

### Marks Object (CO-Aggregated)
```json
{
  "id": "number",
  "student_id": "string (rollno)",
  "test_id": "number",
  "CO1": "decimal (>= 0, default: 0)",
  "CO2": "decimal (>= 0, default: 0)",
  "CO3": "decimal (>= 0, default: 0)",
  "CO4": "decimal (>= 0, default: 0)",
  "CO5": "decimal (>= 0, default: 0)",
  "CO6": "decimal (>= 0, default: 0)"
}
```

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
- `year`: Required, must be a 4-digit calendar year (1000-9999)
- `semester`: Required, must be a positive integer

### Test Validation
- `course_id`: Required, must be a course assigned to the faculty
- `name`: Required, max 255 characters
- `full_marks`: Required, must be greater than 0
- `pass_marks`: Required, must be >= 0 and <= full_marks
- `question_paper_pdf`: Optional, base64-encoded PDF string

### Question Validation
- `test_id`: Required, must be a valid test
- `question_number`: Required, must be between 1-20
- `sub_question`: Optional, must be 'a'-'h' if provided
- `is_optional`: Optional, boolean (default false)
- `co`: Required, must be between 1-6 (Course Outcome)
- `max_marks`: Required, must be >= 0.5 (supports decimals like 2.5)
- **No total marks validation** - System supports optional questions and flexible test structures

### Marks Validation (by-question)
- `test_id`: Required, must be a valid test
- `student_id`: Required, must be a valid student rollno
- `marks`: Required, array of per-question marks
  - `question_identifier`: Required, must match existing question (e.g., "1", "2a", "5b")
  - `marks`: Required, must be >= 0 and <= question's max_marks

### Marks Validation (by-co)
- `test_id`: Required, must be a valid test
- `student_id`: Required, must be a valid student rollno
- `CO1-CO6`: Optional, all must be >= 0 (default to 0 if not provided)

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

---

## 13. Bulk Enroll Students

**Endpoint:** `POST /courses/{courseId}/enroll`

**Description:** Bulk enroll students into a course. Only the faculty assigned to the course can enroll students. If a student doesn't exist in the system, they will be automatically created.

**Authentication:** Required (Faculty only for their courses)

**URL Parameters:**
- `courseId` (integer): The course ID

**Request Body:**
```json
{
  "students": [
    {
      "rollno": "CS101",
      "name": "Rajesh Kumar"
    },
    {
      "rollno": "CS102",
      "name": "Priya Sharma"
    },
    {
      "rollno": "CS103",
      "name": "Amit Patel"
    }
  ]
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Enrollment completed: 3 successful, 0 failed",
  "data": {
    "successful": [
      {
        "rollno": "CS101",
        "name": "Rajesh Kumar",
        "enrollment_id": 1
      },
      {
        "rollno": "CS102",
        "name": "Priya Sharma",
        "enrollment_id": 2
      },
      {
        "rollno": "CS103",
        "name": "Amit Patel",
        "enrollment_id": 3
      }
    ],
    "failed": [],
    "total": 3,
    "success_count": 3,
    "failure_count": 0
  }
}
```

**Partial Success Response (200):**
```json
{
  "success": true,
  "message": "Enrollment completed: 2 successful, 1 failed",
  "data": {
    "successful": [
      {
        "rollno": "CS101",
        "name": "Rajesh Kumar",
        "enrollment_id": 1
      },
      {
        "rollno": "CS102",
        "name": "Priya Sharma",
        "enrollment_id": 2
      }
    ],
    "failed": [
      {
        "rollno": "CS103",
        "name": "Amit Patel",
        "reason": "Already enrolled in this course"
      }
    ],
    "total": 3,
    "success_count": 2,
    "failure_count": 1
  }
}
```

**Error Responses:**

**400 - Bad Request (Empty students array):**
```json
{
  "success": false,
  "message": "students array cannot be empty"
}
```

**400 - Bad Request (Missing fields):**
```json
{
  "success": false,
  "message": "Student at index 0 missing rollno or name"
}
```

**403 - Forbidden:**
```json
{
  "success": false,
  "message": "You are not authorized to enroll students in this course"
}
```

**404 - Not Found:**
```json
{
  "success": false,
  "message": "Course not found"
}
```

---

## 14. Get Course Enrollments

**Endpoint:** `GET /courses/{courseId}/enrollments`

**Description:** Get list of all students enrolled in a specific course. Only the faculty assigned to the course can view enrollments. Optionally include `test_id` query parameter to get test information and questions for marks entry.

**Authentication:** Required (Faculty only for their courses)

**URL Parameters:**
- `courseId` (integer): The course ID

**Query Parameters (Optional):**
- `test_id` (integer): Test ID to include test information and questions

**Success Response (200):**
```json
{
  "success": true,
  "message": "Found 3 enrolled students",
  "data": {
    "course_id": 1,
    "course_code": "CS101",
    "course_name": "Introduction to Programming",
    "enrollment_count": 3,
    "enrollments": [
      {
        "id": 1,
        "course_id": 1,
        "student_rollno": "CS101",
        "student_name": "Rajesh Kumar",
        "enrolled_at": "2025-11-04 10:30:00"
      },
      {
        "id": 2,
        "course_id": 1,
        "student_rollno": "CS102",
        "student_name": "Priya Sharma",
        "enrolled_at": "2025-11-04 10:30:05"
      },
      {
        "id": 3,
        "course_id": 1,
        "student_rollno": "CS103",
        "student_name": "Amit Patel",
        "enrolled_at": "2025-11-04 10:30:10"
      }
    ],
    "test_info": {
      "test_id": 1,
      "test_name": "Mid Semester",
      "full_marks": 50,
      "questions": [
        {
          "id": 1,
          "question_number": 1,
          "sub_question": null,
          "question_identifier": "1",
          "max_marks": 5.0,
          "co": 1,
          "is_optional": false
        },
        {
          "id": 2,
          "question_number": 2,
          "sub_question": "a",
          "question_identifier": "2a",
          "max_marks": 3.0,
          "co": 2,
          "is_optional": false
        }
      ]
    }
  }
}
```

**Note:** The `test_info` field is only included when `test_id` query parameter is provided.

**Error Responses:**

**403 - Forbidden:**
```json
{
  "success": false,
  "message": "You are not authorized to view enrollments for this course"
}
```

**404 - Not Found:**
```json
{
  "success": false,
  "message": "Course not found"
}
```

---

## 15. Remove Student from Course

**Endpoint:** `DELETE /courses/{courseId}/enroll/{rollno}`

**Description:** Remove a student from a course. Only the faculty assigned to the course can remove enrollments.

**Authentication:** Required (Faculty only for their courses)

**URL Parameters:**
- `courseId` (integer): The course ID
- `rollno` (string): The student's roll number

**Success Response (200):**
```json
{
  "success": true,
  "message": "Student removed from course successfully"
}
```

**Error Responses:**

**403 - Forbidden:**
```json
{
  "success": false,
  "message": "You are not authorized to remove enrollments from this course"
}
```

**404 - Not Found (Course):**
```json
{
  "success": false,
  "message": "Course not found"
}
```

**404 - Not Found (Enrollment):**
```json
{
  "success": false,
  "message": "Student is not enrolled in this course"
}
```

---

## 16. Bulk Save Marks

**Endpoint:** `POST /marks/bulk`

**Description:** Save marks for multiple students and questions in a single request. Automatically aggregates CO marks after saving. This is the recommended method for bulk marks entry as it's more efficient than individual submissions.

**Authentication:** Required (Faculty)

**Request Body:**
```json
{
  "test_id": 1,
  "marks_entries": [
    {
      "student_rollno": "CS101",
      "question_number": 1,
      "sub_question": null,
      "marks_obtained": 5.0
    },
    {
      "student_rollno": "CS101",
      "question_number": 2,
      "sub_question": "a",
      "marks_obtained": 3.5
    },
    {
      "student_rollno": "CS101",
      "question_number": 2,
      "sub_question": "b",
      "marks_obtained": 2.0
    },
    {
      "student_rollno": "CS102",
      "question_number": 1,
      "sub_question": null,
      "marks_obtained": 4.0
    },
    {
      "student_rollno": "CS102",
      "question_number": 2,
      "sub_question": "a",
      "marks_obtained": 3.0
    }
  ]
}
```

**Field Descriptions:**
- `test_id` (integer, required): The test ID
- `marks_entries` (array, required): Array of marks entries
  - `student_rollno` (string, required): Student roll number
  - `question_number` (integer, required): Question number (1-20)
  - `sub_question` (string, optional): Sub-question letter (a-h) or null
  - `marks_obtained` (decimal, required): Marks scored (must be ≤ max_marks)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Marks entry completed: 5 successful, 0 failed",
  "data": {
    "successful": [
      {
        "index": 0,
        "student_rollno": "CS101",
        "question": "1",
        "marks_obtained": 5.0,
        "max_marks": 5.0
      },
      {
        "index": 1,
        "student_rollno": "CS101",
        "question": "2a",
        "marks_obtained": 3.5,
        "max_marks": 4.0
      },
      {
        "index": 2,
        "student_rollno": "CS101",
        "question": "2b",
        "marks_obtained": 2.0,
        "max_marks": 3.0
      },
      {
        "index": 3,
        "student_rollno": "CS102",
        "question": "1",
        "marks_obtained": 4.0,
        "max_marks": 5.0
      },
      {
        "index": 4,
        "student_rollno": "CS102",
        "question": "2a",
        "marks_obtained": 3.0,
        "max_marks": 4.0
      }
    ],
    "failed": [],
    "total": 5,
    "success_count": 5,
    "failure_count": 0
  }
}
```

**Partial Success Response (200):**
```json
{
  "success": true,
  "message": "Marks entry completed: 3 successful, 2 failed",
  "data": {
    "successful": [
      {
        "index": 0,
        "student_rollno": "CS101",
        "question": "1",
        "marks_obtained": 5.0,
        "max_marks": 5.0
      }
    ],
    "failed": [
      {
        "index": 1,
        "entry": {
          "student_rollno": "CS999",
          "question_number": 1,
          "sub_question": null,
          "marks_obtained": 5.0
        },
        "reason": "Student with rollno 'CS999' not found"
      },
      {
        "index": 2,
        "entry": {
          "student_rollno": "CS101",
          "question_number": 1,
          "sub_question": null,
          "marks_obtained": 10.0
        },
        "reason": "Marks obtained (10) exceeds maximum marks (5)"
      }
    ],
    "total": 3,
    "success_count": 1,
    "failure_count": 2
  }
}
```

**Error Responses:**

**400 - Bad Request (Missing test_id):**
```json
{
  "success": false,
  "message": "Missing required field: test_id"
}
```

**400 - Bad Request (Invalid marks_entries):**
```json
{
  "success": false,
  "message": "marks_entries must be an array"
}
```

**400 - Bad Request (Empty array):**
```json
{
  "success": false,
  "message": "marks_entries array cannot be empty"
}
```

**404 - Not Found:**
```json
{
  "success": false,
  "message": "Test not found"
}
```

**Features:**
- Validates all entries before saving
- Handles partial failures gracefully
- Automatically aggregates CO marks after saving
- Returns detailed success/failure report for each entry
- Validates marks don't exceed question maximum
- Validates students and questions exist
- Supports both main questions and sub-questions