# Quick Reference - CRUD Operations

## 🚀 Quick Start

All endpoints require JWT authentication:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📝 Update Operations

### Update Question CO Mapping
```bash
PUT /questions/{id}
Content-Type: application/json

{
  "co_number": 3,           # Optional: 1-6
  "max_marks": 10.0,        # Optional: decimal
  "is_optional": false      # Optional: boolean
}

✅ Returns: Updated question
❌ 403 if not course owner
❌ 404 if question not found
```

### Update Marks Entry
```bash
PUT /marks/raw/{id}
Content-Type: application/json

{
  "marks_obtained": 8.5    # Required: decimal, must be ≤ max_marks
}

✅ Returns: Updated marks + auto CO re-aggregation
❌ 400 if marks > max_marks
❌ 403 if not course owner
❌ 404 if marks entry not found
```

---

## 🗑️ Delete Operations

### Delete Question
```bash
DELETE /questions/{id}

⚠️  Cascade deletes all raw marks for this question
⚠️  Cannot be undone

✅ Returns: Success message
❌ 403 if not course owner
❌ 404 if question not found
```

### Delete Marks Entry
```bash
DELETE /marks/raw/{id}

✅ Returns: Success message + auto CO re-aggregation
❌ 403 if not course owner
❌ 404 if marks entry not found
```

### Delete All Student Marks
```bash
DELETE /marks/student/{testId}/{studentId}

⚠️  Deletes ALL marks (raw + aggregated) for this student
⚠️  Cannot be undone

✅ Returns: Count of deleted entries
❌ 403 if not course owner
❌ 404 if test not found
```

---

## 📊 Bulk Operations

### Bulk Marks Entry
```bash
POST /marks/bulk
Content-Type: application/json

{
  "test_id": 45,
  "marks_entries": [
    {
      "student_rollno": "CS101",
      "question_number": 1,
      "sub_question": "a",      # Optional: null for main question
      "marks_obtained": 8.5
    },
    // ... more entries
  ]
}

✅ Returns: Success/failure report for each entry
✅ Handles partial failures gracefully
✅ Auto CO aggregation after all entries
```

### Bulk Student Enrollment
```bash
POST /enrollments/bulk
Content-Type: application/json

{
  "course_id": 1,
  "students": [
    {"rollNumber": "CS101", "name": "John Doe"},
    {"rollNumber": "CS102", "name": "Jane Smith"}
  ]
}

✅ Returns: Success/failure report
✅ Handles partial failures
```

---

## 👀 View Operations

### View Test Marks (with Raw Marks)
```bash
GET /marks/test/{testId}?include_raw=true

✅ Returns: All students' marks with raw entries
📊 Without include_raw: Only CO aggregates
```

### View Enrolled Students (with Tests)
```bash
GET /enrollments/course/{courseId}?include_tests=true

✅ Returns: Students with test info
📊 Without include_tests: Students only
```

---

## 🔐 Authorization Rules

| Operation | Requirement |
|-----------|------------|
| Update Question | Faculty must own the course |
| Delete Question | Faculty must own the course |
| Update Marks | Faculty must own the course |
| Delete Marks | Faculty must own the course |
| Bulk Operations | Faculty role required |

**Authorization Flow:**
```
JWT Token → User ID
Question/Test → Course → Faculty ID
Compare: jwt.user_id == course.faculty_id
```

---

## ⚡ Key Features

✅ **Automatic CO Aggregation** - Happens after every marks update/delete  
✅ **Cascade Deletes** - Database handles foreign key deletions  
✅ **Partial Failure Handling** - Bulk operations continue on errors  
✅ **Validation** - Marks can't exceed max_marks  
✅ **Transaction Support** - Bulk operations are atomic  
✅ **Detailed Responses** - Success/failure for each operation  

---

## 🐛 Error Codes

| Code | Meaning | Common Fix |
|------|---------|-----------|
| 400 | Invalid data | Check marks ≤ max_marks, required fields |
| 401 | No JWT token | Add Authorization header |
| 403 | Not authorized | Use faculty account that owns course |
| 404 | Not found | Check question/marks/test ID exists |
| 500 | Server error | Check logs, verify database connection |

---

## 📋 Common Workflows

### 1. Fix CO Mapping Error
```bash
# 1. Find question ID from test details
GET /tests/{testId}

# 2. Update CO mapping
PUT /questions/123
{"co_number": 3}

# ✅ All student CO totals auto-updated
```

### 2. Correct Single Marks Entry
```bash
# 1. View raw marks to find ID
GET /marks/test/45?include_raw=true

# 2. Update the marks
PUT /marks/raw/789
{"marks_obtained": 8.5}

# ✅ Student's CO totals auto-updated
```

### 3. Reset All Student Marks
```bash
# 1. Delete all marks
DELETE /marks/student/45/12

# 2. Re-enter via bulk
POST /marks/bulk
{
  "test_id": 45,
  "marks_entries": [...]
}
```

### 4. Remove Unused Question
```bash
# Check if any marks exist
GET /marks/test/45?include_raw=true

# Delete question (cascades to marks)
DELETE /questions/123
```

---

## 💡 Pro Tips

1. **Always Check Authorization**: 403 errors mean you don't own the course
2. **Use Bulk Operations**: Faster than individual requests
3. **Include Raw Marks**: Use `?include_raw=true` for detailed debugging
4. **Validate Before Delete**: Deletions cannot be undone
5. **Monitor CO Totals**: Auto-aggregation ensures consistency
6. **Use Postman Collection**: Pre-configured in `docs/postmanAPIScript.json`

---

## 📚 Full Documentation

- **API Reference**: `APIDocumentation.md` - Input/output for all 20 endpoints
- **Complete Guide**: `CRUD_OPERATIONS.md` - Detailed CRUD workflows
- **Bulk Features**: `BULK_MARKS_FEATURE.md` - Bulk operations guide
- **Enrollment**: `ENROLLMENT_FEATURE.md` - Student enrollment
- **Implementation**: `IMPLEMENTATION_SUMMARY.md` - Technical details

---

## 🆘 Quick Help

**Problem**: 403 Forbidden  
**Solution**: Ensure JWT token is from faculty who owns the course

**Problem**: 400 Bad Request (marks exceed maximum)  
**Solution**: Check question's max_marks, update marks to be ≤ max

**Problem**: 404 Not Found  
**Solution**: Verify question/marks/test ID exists in database

**Problem**: CO totals not updating  
**Solution**: Already automatic - check if aggregateFromRawMarks() was called

---

**Version**: 1.0 | **Last Updated**: January 2025
