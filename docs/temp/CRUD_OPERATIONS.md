# CRUD Operations API Documentation

This document provides comprehensive documentation for all CRUD (Create, Read, Update, Delete) operations available for faculty to manage questions and marks in the NBA Assessment System.

## Table of Contents

1. [Update Question CO Mapping](#update-question-co-mapping)
2. [Delete Question](#delete-question)
3. [Update Raw Marks Entry](#update-raw-marks-entry)
4. [Delete Raw Marks Entry](#delete-raw-marks-entry)
5. [Delete All Student Marks](#delete-all-student-marks)
6. [Use Cases and Workflows](#use-cases-and-workflows)

---

## Update Question CO Mapping

**Endpoint:** `PUT /questions/{id}`

**Description:** Update CO mapping, maximum marks, and optional status for a question. Only faculty who own the course can modify questions.

**Authorization:** Bearer token (faculty only)

**URL Parameters:**
- `id` (integer, required): Question ID

**Request Body:**
```json
{
  "co_number": 3,
  "max_marks": 10.0,
  "is_optional": false
}
```

**Field Descriptions:**
- `co_number` (integer, optional): Course Outcome number (1-6)
- `max_marks` (decimal, optional): Maximum marks for the question
- `is_optional` (boolean, optional): Whether question is optional

**Success Response (200):**
```json
{
  "success": true,
  "message": "Question updated successfully",
  "data": {
    "question_id": 123,
    "test_id": 45,
    "question_number": 1,
    "sub_question": null,
    "co_number": 3,
    "max_marks": 10.0,
    "is_optional": false
  }
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "You are not authorized to modify this question"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Question not found"
}
```

**Example cURL Request:**
```bash
curl -X PUT http://localhost/nba/api/questions/123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "co_number": 3,
    "max_marks": 10.0,
    "is_optional": false
  }'
```

---

## Delete Question

**Endpoint:** `DELETE /questions/{id}`

**Description:** Delete a question. All associated raw marks entries will be automatically deleted due to foreign key constraints. Only faculty who own the course can delete questions.

**Authorization:** Bearer token (faculty only)

**URL Parameters:**
- `id` (integer, required): Question ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Question deleted successfully"
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "You are not authorized to delete this question"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Question not found"
}
```

**Important Notes:**
- ⚠️ Deleting a question will cascade delete all raw marks entries for that question
- ⚠️ Aggregated CO marks will be affected and should be recalculated if needed
- ⚠️ This operation cannot be undone

**Example cURL Request:**
```bash
curl -X DELETE http://localhost/nba/api/questions/123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Update Raw Marks Entry

**Endpoint:** `PUT /marks/raw/{id}`

**Description:** Update marks obtained for a single raw marks entry. Automatically re-aggregates CO marks after update. Only faculty who own the course can modify marks.

**Authorization:** Bearer token (faculty only)

**URL Parameters:**
- `id` (integer, required): Raw marks entry ID

**Request Body:**
```json
{
  "marks_obtained": 8.5
}
```

**Field Descriptions:**
- `marks_obtained` (decimal, required): New marks value (must be ≤ question's max_marks)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Marks updated successfully",
  "data": {
    "raw_marks_id": 789,
    "test_id": 45,
    "student_id": 12,
    "question_id": 123,
    "marks_obtained": 8.5
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Marks cannot exceed maximum marks for the question"
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "You are not authorized to modify marks for this test"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Raw marks entry not found"
}
```

**Features:**
- ✅ Validates new marks don't exceed question maximum
- ✅ Automatically re-aggregates CO marks for the student
- ✅ Maintains data integrity with the aggregated marks table
- ✅ Updates timestamp automatically

**Example cURL Request:**
```bash
curl -X PUT http://localhost/nba/api/marks/raw/789 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "marks_obtained": 8.5
  }'
```

---

## Delete Raw Marks Entry

**Endpoint:** `DELETE /marks/raw/{id}`

**Description:** Delete a single raw marks entry. Automatically re-aggregates CO marks after deletion. Only faculty who own the course can delete marks.

**Authorization:** Bearer token (faculty only)

**URL Parameters:**
- `id` (integer, required): Raw marks entry ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Marks entry deleted successfully"
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "You are not authorized to delete marks for this test"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Raw marks entry not found"
}
```

**Features:**
- ✅ Automatically re-aggregates CO marks after deletion
- ✅ Maintains consistency between raw marks and aggregated marks
- ⚠️ Cannot be undone - use with caution

**Example cURL Request:**
```bash
curl -X DELETE http://localhost/nba/api/marks/raw/789 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Delete All Student Marks

**Endpoint:** `DELETE /marks/student/{testId}/{studentId}`

**Description:** Delete all marks entries (both raw and aggregated) for a specific student in a test. Useful for resetting student marks or removing incorrect entries in bulk. Only faculty who own the course can perform this operation.

**Authorization:** Bearer token (faculty only)

**URL Parameters:**
- `testId` (integer, required): Test ID
- `studentId` (integer, required): Student ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "All marks for student deleted successfully",
  "data": {
    "raw_marks_deleted": 10,
    "co_marks_deleted": 6
  }
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "You are not authorized to delete marks for this test"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Test not found"
}
```

**Features:**
- ✅ Deletes all raw marks entries for the student in one operation
- ✅ Deletes all aggregated CO marks for the student
- ✅ Returns count of deleted entries for verification
- ⚠️ Cannot be undone - use with caution
- ✅ Useful for data correction or student withdrawal scenarios

**Example cURL Request:**
```bash
curl -X DELETE http://localhost/nba/api/marks/student/45/12 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Use Cases and Workflows

### Workflow 1: Correcting CO Mapping for a Question

**Scenario:** Faculty realizes Question 2a should be mapped to CO3 instead of CO2

**Steps:**
1. Get the question ID by viewing test details
2. Update the question CO mapping:
   ```bash
   PUT /questions/123
   {
     "co_number": 3
   }
   ```
3. CO aggregation happens automatically for all students

### Workflow 2: Fixing a Single Marks Entry

**Scenario:** Faculty entered 7 marks instead of 8 for a student

**Steps:**
1. View raw marks to find the entry ID
2. Update the marks:
   ```bash
   PUT /marks/raw/789
   {
     "marks_obtained": 8.0
   }
   ```
3. CO aggregation happens automatically for the student

### Workflow 3: Resetting All Marks for a Student

**Scenario:** Student answered the wrong question set and all marks need to be re-entered

**Steps:**
1. Delete all marks for the student:
   ```bash
   DELETE /marks/student/45/12
   ```
2. Re-enter all marks using bulk marks entry:
   ```bash
   POST /marks/bulk
   {
     "test_id": 45,
     "marks_entries": [...]
   }
   ```

### Workflow 4: Removing an Unused Question

**Scenario:** Faculty created a question by mistake and wants to remove it

**Steps:**
1. Ensure no marks are entered for this question (or accept that they will be deleted)
2. Delete the question:
   ```bash
   DELETE /questions/123
   ```
3. All related marks entries are automatically deleted

### Workflow 5: Updating Question Maximum Marks

**Scenario:** Faculty decides to change a question from 10 marks to 8 marks

**Steps:**
1. Update the question:
   ```bash
   PUT /questions/123
   {
     "max_marks": 8.0
   }
   ```
2. Review all marks entries to ensure no student has > 8 marks
3. Update any marks that exceed the new maximum

---

## Authorization Requirements

All CRUD operations require:
- ✅ Valid JWT token in Authorization header
- ✅ Faculty role (not student)
- ✅ Faculty must own the course associated with the test/question

**Authorization Flow:**
1. Question/Marks → Test → Course → Faculty ID
2. JWT token contains the faculty's user ID
3. System verifies: `course.faculty_id == jwt.user_id`

**Example Authorization Header:**
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

---

## Best Practices

### ✅ DO:
- Verify CO mapping is correct before finalizing assessments
- Use the update endpoint for small corrections
- Use bulk delete for complete student data reset
- Check authorization errors (403) if operations fail
- Review aggregated marks after making changes

### ⚠️ DON'T:
- Don't delete questions that have marks entries without understanding the cascade effect
- Don't update marks to exceed question maximum
- Don't perform bulk operations without verifying the test and student IDs
- Don't forget that delete operations cannot be undone

---

## Error Handling Summary

| Status Code | Meaning | Common Cause |
|-------------|---------|--------------|
| 200 | Success | Operation completed successfully |
| 400 | Bad Request | Invalid data (marks > max, missing fields) |
| 401 | Unauthorized | Missing or invalid JWT token |
| 403 | Forbidden | Faculty doesn't own this course |
| 404 | Not Found | Question/Marks/Test doesn't exist |
| 500 | Server Error | Database or server issue |

---

## Related Documentation

- [APIDocumentation.md](./APIDocumentation.md) - Complete API reference
- [BULK_MARKS_FEATURE.md](./BULK_MARKS_FEATURE.md) - Bulk marks entry documentation
- [ENROLLMENT_FEATURE.md](./ENROLLMENT_FEATURE.md) - Student enrollment documentation
- [schema.md](./schema.md) - Database schema reference

---

**Last Updated:** January 2025
**API Version:** 1.0
