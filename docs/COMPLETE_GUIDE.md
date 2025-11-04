# NBA Assessment System - Complete Guide

## Overview

A PHP-based REST API for managing NBA (National Board of Accreditation) assessment data for educational institutions.

**Technology**: PHP 8.2.12, MySQL 8.0+, JWT Authentication  
**Base URL**: `http://localhost/nba/api/`

---

## Quick Start

### 1. Database Setup
```sql
CREATE DATABASE nba_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- Import: docs/db.sql via phpMyAdmin
```

### 2. Configuration
Edit `api/config/DatabaseConfig.php`:
```php
private $host = 'localhost';
private $db_name = 'nba_db';
private $username = 'root';
private $password = '';
```

### 3. Test
Visit: `http://localhost/nba/api/`  
Expected: `{"message": "NBA Assessment API v1.0"}`

### 4. Login
```bash
POST /login
{
  "employeeIdOrEmail": "admin@nba.edu",
  "password": "admin123"
}
```

---

## Core Features

### 1. Course Outcomes (CO) Based Assessment
- Map each question to CO1-CO6
- Automatic CO aggregation from question marks
- Supports optional questions
- NBA-ready data structure

### 2. Dual Marks Storage
- **Raw Marks**: Per-question details in `rawMarks` table
- **Aggregated Marks**: CO totals in `marks` table
- Auto-synchronization after updates

### 3. Bulk Operations
- **Enrollment**: Upload JSON with student list
- **Marks Entry**: Enter marks for entire class in one request
- **Partial Failure Handling**: Continue on errors, report results

### 4. Complete CRUD
- Update/delete questions and CO mappings
- Update/delete individual marks entries
- Bulk delete all student marks
- Automatic CO re-aggregation

### 5. PDF Storage
- Store question papers and syllabus
- Dynamic filename: `courseCode_year_semester_testName.pdf`
- Base64 upload, LONGBLOB storage

---

## Database Schema

### Tables (8)
1. **departments** - Academic departments
2. **users** - Faculty, admin, staff (with JWT auth)
3. **course** - Courses with year/semester
4. **test** - Assessments with question papers
5. **question** - Questions with CO mapping
6. **student** - Student information
7. **rawMarks** - Per-question marks
8. **marks** - CO-aggregated marks
9. **enrollment** - Student-course relationship

### Key Relationships
```
course (1) → (N) test
test (1) → (N) question
test (1) → (N) rawMarks → (1) question
test (1) → (N) marks
course (1) → (N) enrollment → (1) student
```

---

## Features in Detail

### PDF Storage with Dynamic Filenames
```
Question Paper: CS101_2024_3_MidSemester.pdf
Syllabus: CS101_2024_3.pdf

Format: courseCode_year_semester_[testName].pdf
```

### Student Enrollment
```json
POST /courses/1/enroll
{
  "students": [
    {"rollno": "CS101", "name": "John Doe"}
  ]
}
```
- Auto-creates students if they don't exist
- Prevents duplicate enrollments
- Returns success/failure per student

### Bulk Marks Entry
```json
POST /marks/bulk
{
  "test_id": 1,
  "marks_entries": [
    {
      "student_rollno": "CS101",
      "question_number": 1,
      "sub_question": "a",
      "marks_obtained": 8.5
    }
  ]
}
```
- Validates all entries
- Partial failure support
- Auto CO aggregation
- Returns detailed report

### Enhanced Marks Viewing
```
GET /marks/test/1?include_raw=true

Returns:
- All students with CO totals
- Optional per-question raw marks
- Question details
- Course information
```

### CRUD Operations

#### Update Question CO Mapping
```
PUT /questions/123
{
  "co_number": 3,
  "max_marks": 10.0
}
```

#### Update Marks Entry
```
PUT /marks/raw/789
{
  "marks_obtained": 8.5
}
// Auto re-aggregates CO totals
```

#### Delete Operations
```
DELETE /questions/123       // Cascade deletes marks
DELETE /marks/raw/789       // Re-aggregates CO
DELETE /marks/student/1/CS101  // Deletes all marks
```

---

## Authorization Model

### Faculty Authorization Flow
```
JWT Token → user_id
Question/Test → Course → faculty_id
Verify: jwt.user_id == course.faculty_id
```

### Access Control
- **Admin**: Full system access
- **HOD**: Department-level access
- **Faculty**: Own courses only
- **Staff**: View-only

---

## Workflows

### Workflow 1: Create Assessment
```
1. GET /courses → Select course
2. POST /assessment → Create test with questions
3. POST /courses/1/enroll → Enroll students
4. GET /courses/1/enrollments?test_id=1 → Get students + questions
5. POST /marks/bulk → Enter marks
6. GET /marks/test/1 → View results
```

### Workflow 2: Correct Marks
```
1. GET /marks/test/1?include_raw=true → Find entry ID
2. PUT /marks/raw/789 → Update marks
   // System auto-recalculates CO totals
3. GET /marks/test/1 → Verify changes
```

### Workflow 3: Fix CO Mapping
```
1. GET /assessment?test_id=1 → Find question ID
2. PUT /questions/123 → Update CO mapping
   // System auto-recalculates for all students
3. GET /marks/test/1 → Verify CO totals
```

### Workflow 4: Reset Student Marks
```
1. DELETE /marks/student/1/CS101 → Delete all marks
2. POST /marks/bulk → Re-enter correct marks
```

---

## Validation Rules

### Course
- `year`: 4-digit calendar year (2024, 2025)
- `semester`: Positive integer (1, 2, 3...)
- `course_code`: Max 20 characters

### Test
- `full_marks`: Must be > 0
- `pass_marks`: 0 ≤ pass_marks ≤ full_marks

### Question
- `question_number`: 1-20
- `sub_question`: 'a'-'h' or null
- `co`: 1-6
- `max_marks`: ≥ 0.5 (supports decimals)

### Marks
- `marks_obtained`: 0 ≤ marks ≤ question.max_marks
- Must be non-negative decimal

---

## Error Handling

### Common Errors

**400 - Bad Request**
```json
{
  "success": false,
  "message": "Marks exceed maximum (5)",
  "errors": ["Field validation details"]
}
```

**403 - Forbidden**
```json
{
  "success": false,
  "message": "You are not authorized to modify this question"
}
```

**404 - Not Found**
```json
{
  "success": false,
  "message": "Question not found"
}
```

### Handling Partial Failures
Bulk operations continue on errors:
```json
{
  "success": true,
  "message": "48 successful, 2 failed",
  "data": {
    "successful": [ /* entries */ ],
    "failed": [
      {
        "index": 10,
        "reason": "Student not found"
      }
    ]
  }
}
```

---

## Best Practices

### ✅ DO
- Use bulk operations for efficiency
- Check authorization errors (403)
- Verify CO totals after changes
- Use `include_raw=true` for debugging
- Test with small datasets first

### ⚠️ DON'T
- Don't delete questions with marks without understanding cascade
- Don't update marks above maximum
- Don't forget JWT token in headers
- Don't perform operations without authorization

---

## Security Features

- **JWT Authentication**: Token-based auth for all endpoints
- **Authorization Checks**: Faculty can only modify own courses
- **Prepared Statements**: SQL injection prevention
- **Input Validation**: All inputs validated and sanitized
- **Password Hashing**: bcrypt for password storage
- **CORS Support**: Configured for frontend integration

---

## Performance

### Optimizations
- Bulk operations use single transaction
- Prepared statements with placeholders
- Primary and foreign key indexes
- Cascade deletes handled by database

### Scalability
- Supports ~1000 students per course
- Bulk operations tested with 100+ entries
- Response times < 500ms
- Horizontal scaling possible

---

## Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@nba.edu | admin123 |
| HOD (CSE) | hod.cse@nba.edu | hod123 |
| Faculty | faculty1.cse@nba.edu | faculty123 |

⚠️ **Change in production!**

---

## Troubleshooting

### Issue: 404 Not Found
- **Cause**: mod_rewrite not enabled
- **Fix**: Enable in httpd.conf, set `AllowOverride All`

### Issue: CORS Error
- **Cause**: Frontend URL not allowed
- **Fix**: Update `CorsMiddleware.php` with frontend URL

### Issue: 403 Forbidden
- **Cause**: Faculty doesn't own course
- **Fix**: Login with correct faculty account

### Issue: JWT Invalid
- **Cause**: Token expired
- **Fix**: Login again to get new token

---

## API Limits

- **Questions per test**: 20 main questions
- **Sub-questions**: a-h (8 per main question)
- **Course Outcomes**: 6 (CO1-CO6)
- **Max marks per question**: 999.99 (decimal supported)
- **Students per course**: No hard limit

---

## Project Structure

```
nba/
├── api/
│   ├── config/          # Database config
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth, CORS, Validation
│   ├── models/          # Entities + Repositories
│   ├── routes/          # API routes
│   ├── utils/           # JWT, Auth services
│   └── index.php        # Entry point
├── docs/
│   ├── API_REFERENCE.md     # All endpoints
│   ├── COMPLETE_GUIDE.md    # This file
│   ├── db.sql               # Database schema
│   └── postmanAPIScript.json
└── README.md
```

---

## Version History

**v1.0** (January 2025)
- Initial release
- 20 API endpoints
- Complete CRUD operations
- Bulk operations
- PDF storage
- CO-based assessment

---

**Documentation**: `API_REFERENCE.md` for endpoint details  
**Support**: Check `README.md` for quick start  
**Database**: `schema.md` for complete database structure
