# Bulk Marks Entry Feature

## Overview
Faculty can now efficiently enter marks for multiple students in a single API call. This feature includes enhanced enrollment viewing with test context to make marks entry easier.

## Key Features

### 1. Bulk Marks Entry
- **Endpoint:** `POST /marks/bulk`
- Save marks for multiple students and questions in one request
- Automatic CO aggregation after saving
- Detailed success/failure reporting
- Validates all entries (students, questions, mark limits)

### 2. Enhanced Enrollment View
- **Endpoint:** `GET /courses/{courseId}/enrollments?test_id={testId}`
- View all enrolled students in a course
- Optional test context with questions list
- All information needed for marks entry in one response

## API Endpoints

### 1. Bulk Save Marks

**POST** `/marks/bulk`

Save marks for multiple students in a single request. The system automatically:
- Validates student existence
- Validates question existence
- Checks marks don't exceed maximum
- Aggregates CO marks automatically
- Returns detailed results for each entry

**Request Format:**
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
      "student_rollno": "CS102",
      "question_number": 1,
      "sub_question": null,
      "marks_obtained": 4.0
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Marks entry completed: 3 successful, 0 failed",
  "data": {
    "successful": [...],
    "failed": [],
    "total": 3,
    "success_count": 3,
    "failure_count": 0
  }
}
```

### 2. Get Enrollments with Test Context

**GET** `/courses/{courseId}/enrollments?test_id={testId}`

Get enrolled students with optional test information and questions.

**Without test_id:**
```bash
GET /courses/1/enrollments
```

Returns basic enrollment list.

**With test_id:**
```bash
GET /courses/1/enrollments?test_id=5
```

Returns enrollment list PLUS:
- Test details (name, full marks)
- All questions with their details
- Question identifiers for marks entry
- CO mappings
- Max marks for each question

**Response with test_id:**
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
    ],
    "test_info": {
      "test_id": 5,
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

## Usage Workflow

### Step 1: Get Course Tests
```bash
GET /course-tests?course_id=1&year=2024&semester=1
```

Get list of tests for your course.

### Step 2: Get Enrollments with Test Context
```bash
GET /courses/1/enrollments?test_id=5
```

Get:
- All enrolled students
- Test information
- All questions with max marks

### Step 3: Prepare Marks Data

Using the information from Step 2, prepare your marks entries:

```json
{
  "test_id": 5,
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
      "student_rollno": "CS102",
      "question_number": 1,
      "sub_question": null,
      "marks_obtained": 4.0
    }
  ]
}
```

### Step 4: Submit Bulk Marks
```bash
POST /marks/bulk
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "test_id": 5,
  "marks_entries": [...]
}
```

### Step 5: Review Results

The response shows which entries succeeded and which failed:

```json
{
  "success": true,
  "message": "Marks entry completed: 48 successful, 2 failed",
  "data": {
    "successful": [...],
    "failed": [
      {
        "index": 10,
        "entry": {...},
        "reason": "Marks obtained (6) exceeds maximum marks (5)"
      }
    ],
    "total": 50,
    "success_count": 48,
    "failure_count": 2
  }
}
```

## Field Descriptions

### marks_entries Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| student_rollno | string | Yes | Student's roll number | "CS101" |
| question_number | integer | Yes | Question number (1-20) | 1 |
| sub_question | string/null | No | Sub-question letter (a-h) or null | "a" or null |
| marks_obtained | decimal | Yes | Marks scored (≥ 0, ≤ max_marks) | 3.5 |

### Notes on sub_question
- Use `null` for main questions without sub-parts
- Use lowercase letter ("a", "b", etc.) for sub-questions
- Empty string `""` is treated as `null`
- String `"null"` is treated as `null`

## Validation Rules

The system validates:

1. **Test Existence:** Test must exist
2. **Student Existence:** Student must be in the system
3. **Question Existence:** Question must exist for the test
4. **Marks Range:** `0 ≤ marks_obtained ≤ question.max_marks`
5. **Required Fields:** All required fields must be present
6. **Data Types:** Correct data types for all fields

## Error Handling

### Individual Entry Failures

If some entries fail, they're reported in the `failed` array:

```json
{
  "failed": [
    {
      "index": 5,
      "entry": {
        "student_rollno": "CS999",
        "question_number": 1,
        "sub_question": null,
        "marks_obtained": 5.0
      },
      "reason": "Student with rollno 'CS999' not found"
    }
  ]
}
```

Common failure reasons:
- "Student with rollno 'XXX' not found"
- "Question X[a] not found in this test"
- "Marks obtained (X) exceeds maximum marks (Y)"
- "Marks must be a non-negative number"
- "Missing required fields (...)"

### Complete Request Failures

HTTP 400/404/500 errors for complete failures:
- Missing test_id
- Invalid marks_entries format
- Test not found
- Server errors

## Automatic CO Aggregation

After saving marks, the system automatically:

1. Calculates total marks for each CO
2. Updates the `marks` table
3. Aggregates marks by CO (1-6)

Example:
- Student CS101 scores 5 on Q1 (CO1) and 3.5 on Q2a (CO2)
- System calculates: CO1 = 5, CO2 = 3.5
- Updates marks table with CO totals

## Implementation Details

### Database Changes
No new tables required. Uses existing:
- `rawMarks` - Stores per-question marks
- `marks` - Stores CO-aggregated marks

### New Repository Method
**MarksRepository::aggregateFromRawMarks($testId, $studentId)**
- Calculates CO totals from raw marks
- Updates marks table automatically

### Controller Methods
1. **MarksController::bulkSaveMarks()** - Handles bulk marks entry
2. **EnrollmentController::getEnrollments()** - Enhanced with test context

## Benefits

### Efficiency
- **Single Request:** Enter marks for entire class in one API call
- **Reduced Network Calls:** Get all info (students + questions) together
- **Bulk Processing:** Faster than individual submissions

### Validation
- **Pre-validation:** Checks all entries before saving
- **Detailed Feedback:** Know exactly which entries failed and why
- **No Partial States:** Either entry succeeds completely or fails

### User Experience
- **Clear Results:** Success/failure for each entry
- **Context-Rich:** All information needed in one response
- **Error Recovery:** Failed entries don't affect successful ones

## Example: Full Workflow

```bash
# 1. Login
curl -X POST http://localhost/nba/api/login \
  -H "Content-Type: application/json" \
  -d '{"employeeIdOrEmail":"3001","password":"faculty123"}'

# Save the JWT token from response

# 2. Get course tests
curl -X GET "http://localhost/nba/api/course-tests?course_id=1&year=2024&semester=1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 3. Get enrollments with test context
curl -X GET "http://localhost/nba/api/courses/1/enrollments?test_id=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 4. Submit bulk marks
curl -X POST http://localhost/nba/api/marks/bulk \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "test_id": 5,
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
      }
    ]
  }'
```

## Tips for Frontend Integration

### Generating marks_entries Array

```javascript
// After getting enrollments and test_info
const enrollments = response.data.enrollments;
const questions = response.data.test_info.questions;

// Create matrix: students x questions
const marksEntries = [];

enrollments.forEach(student => {
  questions.forEach(question => {
    marksEntries.push({
      student_rollno: student.student_rollno,
      question_number: question.question_number,
      sub_question: question.sub_question,
      marks_obtained: 0 // Default or from user input
    });
  });
});

// Submit
fetch('/marks/bulk', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    test_id: testId,
    marks_entries: marksEntries
  })
});
```

### Displaying Results

```javascript
const result = await response.json();

if (result.success) {
  console.log(`${result.data.success_count} entries saved successfully`);
  
  // Show failures if any
  if (result.data.failed.length > 0) {
    result.data.failed.forEach(failure => {
      console.error(`Entry ${failure.index} failed: ${failure.reason}`);
    });
  }
}
```

## Security

- ✅ JWT authentication required
- ✅ Faculty can only enter marks for their courses
- ✅ All inputs validated and sanitized
- ✅ SQL injection prevention
- ✅ Transaction support for data integrity

## Performance

For a class of 50 students with 10 questions (500 marks entries):
- **Old Way:** 500 individual API calls
- **New Way:** 1 bulk API call

**Result:** ~500x faster! ⚡
