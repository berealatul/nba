# Student Enrollment Feature

## Overview
Faculty can now bulk enroll students in their courses using a JSON file containing student roll numbers and names.

## Database Changes

### New Table: `enrollment`
```sql
CREATE TABLE `enrollment` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `course_id` BIGINT NOT NULL,
    `student_rollno` VARCHAR(20) NOT NULL,
    `enrolled_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY (`course_id`, `student_rollno`),
    INDEX (`course_id`),
    INDEX (`student_rollno`),
    FOREIGN KEY (`course_id`) REFERENCES `course`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`student_rollno`) REFERENCES `student`(`rollno`) ON DELETE CASCADE
);
```

**Features:**
- Tracks which students are enrolled in which courses
- Prevents duplicate enrollments (UNIQUE constraint)
- Cascades deletion when course or student is deleted
- Timestamps enrollment for audit trail

## API Endpoints

### 1. Bulk Enroll Students
**POST** `/courses/{courseId}/enroll`

Enroll multiple students in a course at once. Only the faculty assigned to the course can enroll students.

**Features:**
- Auto-creates students if they don't exist
- Handles partial failures gracefully
- Returns detailed success/failure report
- Prevents duplicate enrollments

**Request:**
```json
{
  "students": [
    {"rollno": "CS101", "name": "Rajesh Kumar"},
    {"rollno": "CS102", "name": "Priya Sharma"},
    {"rollno": "CS103", "name": "Amit Patel"}
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Enrollment completed: 3 successful, 0 failed",
  "data": {
    "successful": [
      {"rollno": "CS101", "name": "Rajesh Kumar", "enrollment_id": 1},
      {"rollno": "CS102", "name": "Priya Sharma", "enrollment_id": 2},
      {"rollno": "CS103", "name": "Amit Patel", "enrollment_id": 3}
    ],
    "failed": [],
    "total": 3,
    "success_count": 3,
    "failure_count": 0
  }
}
```

### 2. Get Course Enrollments
**GET** `/courses/{courseId}/enrollments`

Get list of all students enrolled in a course.

**Response:**
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
      }
    ]
  }
}
```

### 3. Remove Student from Course
**DELETE** `/courses/{courseId}/enroll/{rollno}`

Remove a specific student from a course.

**Response:**
```json
{
  "success": true,
  "message": "Student removed from course successfully"
}
```

## Implementation Files

### Models
- **`api/models/Enrollment.php`** - Enrollment entity
- **`api/models/EnrollmentRepository.php`** - Database operations

### Controller
- **`api/controllers/EnrollmentController.php`** - Business logic and validation

### Routes
- **`api/routes/api.php`** - Updated with enrollment endpoints

## Security Features

✅ **Authorization:** Only the faculty assigned to a course can enroll/remove students
✅ **Validation:** All input is validated and sanitized
✅ **Error Handling:** Graceful handling of duplicates and missing data
✅ **Auto-creation:** Students are automatically created if they don't exist (assigned to faculty's department)

## Usage Example

### Step 1: Login as Faculty
```bash
curl -X POST http://localhost/nba/api/login \
  -H "Content-Type: application/json" \
  -d '{"employeeIdOrEmail":"3001","password":"faculty123"}'
```

### Step 2: Get Your Courses
```bash
curl -X GET http://localhost/nba/api/courses \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Step 3: Enroll Students
```bash
curl -X POST http://localhost/nba/api/courses/1/enroll \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "students": [
      {"rollno": "CS101", "name": "Rajesh Kumar"},
      {"rollno": "CS102", "name": "Priya Sharma"}
    ]
  }'
```

### Step 4: View Enrollments
```bash
curl -X GET http://localhost/nba/api/courses/1/enrollments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Step 5: Remove a Student (if needed)
```bash
curl -X DELETE http://localhost/nba/api/courses/1/enroll/CS101 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Error Handling

The API handles various error scenarios:

| Error | HTTP Code | Reason |
|-------|-----------|--------|
| Missing students array | 400 | Request body validation |
| Empty students array | 400 | Business logic validation |
| Missing rollno/name | 400 | Student data validation |
| Course not found | 404 | Invalid course ID |
| Not authorized | 403 | Faculty doesn't own the course |
| Already enrolled | 200* | Reported in failed array |

*Note: Duplicate enrollment doesn't fail the entire request, it's reported in the `failed` array with reason "Already enrolled in this course"

## Benefits

1. **Bulk Operations:** Enroll hundreds of students in one API call
2. **Fault Tolerance:** Partial failures don't stop the entire operation
3. **Audit Trail:** `enrolled_at` timestamp tracks when students enrolled
4. **Data Integrity:** Foreign keys and unique constraints prevent inconsistencies
5. **Auto-creation:** New students are automatically added to the system
6. **Authorization:** Faculty can only enroll students in their own courses
