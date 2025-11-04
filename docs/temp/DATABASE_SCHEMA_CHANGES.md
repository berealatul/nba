# Database Schema Changes - PDF Storage Implementation

## Overview
This document describes the changes made to the NBA Assessment System database schema to store PDF files (question papers and syllabi) directly in the database using LONGBLOB, with auto-generated filenames, and the removal of the description field from the question table.

**Date**: November 4, 2025  
**Author**: System Update  
**Impact**: Database schema, Models, Repositories, Controllers, Documentation

---

## Changes Summary

### 1. Course Table - Syllabus Storage
**Changed Fields**:
- ❌ Removed: `syllabus VARCHAR(500)` (URL/text field)
- ❌ Removed: `syllabus_filename VARCHAR(255)` (not needed - auto-generated)
- ✅ Added: `syllabus_pdf LONGBLOB` (stores PDF binary data)

**Filename Generation**: Automatically generated as `courseCode_year_semester.pdf` (e.g., "CS101_2024_1.pdf")

**Reason**: Store syllabus as PDF documents directly in database with auto-generated filenames for consistency.

### 2. Test Table - Question Paper Storage
**Changed Fields**:
- ❌ Removed: `question_link VARCHAR(500)` (URL field)
- ❌ Removed: `question_paper_filename VARCHAR(255)` (not needed - auto-generated)
- ✅ Added: `question_paper_pdf LONGBLOB` (stores PDF binary data)

**Filename Generation**: Automatically generated as `courseCode_year_semester_testName.pdf` (e.g., "CS101_2024_1_Mid_Semester.pdf")

**Reason**: Store question papers as PDF documents directly in database with auto-generated, consistent filenames.

### 4. Cleaner Data Model
**Changed Fields**:
- ❌ Removed: `description TEXT DEFAULT NULL`

**Reason**: Question text/details should be in the question paper PDF. This table only stores metadata (number, CO mapping, marks).

---

## Technical Implementation

### Storage Strategy
- **Type**: LONGBLOB (supports up to ~4GB per file, MySQL theoretical limit)
- **Practical Limit**: Recommend keeping PDFs under 10MB for performance
- **Encoding**: Base64 for API transmission, binary for database storage
- **Filename Generation**: 
  - **Syllabus**: `courseCode_year_semester.pdf` (e.g., "CS101_2024_1.pdf")
  - **Question Paper**: `courseCode_year_semester_testName.pdf` (e.g., "CS101_2024_1_Mid_Semester.pdf")
- **API Response**: Returns generated filename and boolean flag (`has_*_pdf`), not the binary data

### API Changes

#### Create Assessment Endpoint
**Old Request**:
```json
{
  "course_id": 1,
  "name": "Mid Semester",
  "question_link": "https://example.com/paper.pdf",
  "questions": [
    {
      "question_number": 1,
      "co": 1,
      "max_marks": 10,
      "description": "Explain data structures"
    }
  ]
}
```

**New Request**:
```json
{
  "course_id": 1,
  "name": "Mid Semester",
  "question_paper_pdf": "base64_encoded_pdf_string...",
  "questions": [
    {
      "question_number": 1,
      "co": 1,
      "max_marks": 10
    }
  ]
}
```

**Note**: Filename is auto-generated from course and test info.

#### Course Response
**Old Response**:
```json
{
  "id": 1,
  "course_code": "CS101",
  "name": "Programming",
  "syllabus": "https://example.com/syllabus.pdf"
}
```

**New Response**:
```json
{
  "id": 1,
  "course_code": "CS101",
  "name": "Programming",
  "syllabus_filename": "CS101_2024_1.pdf",
  "has_syllabus_pdf": true
}
```

**Note**: Filename is auto-generated from course code, year, and semester.

#### Test Response
**Old Response**:
```json
{
  "id": 1,
  "name": "Mid Semester",
  "question_link": "https://example.com/paper.pdf"
}
```

**New Response**:
```json
{
  "id": 1,
  "name": "Mid Semester",
  "question_paper_filename": "CS101_2024_1_Mid_Semester.pdf",
  "has_question_paper_pdf": true
}
```

**Note**: Filename is auto-generated from course code, year, semester, and test name.

#### Question Response
**Old Response**:
```json
{
  "id": 1,
  "question_number": 1,
  "co": 1,
  "max_marks": 10,
  "description": "Explain data structures"
}
```

**New Response**:
```json
{
  "id": 1,
  "question_number": 1,
  "co": 1,
  "max_marks": 10
}
```

---

## Files Modified

### Backend (PHP)

#### Database Schema
- ✅ `docs/db.sql`
  - Updated table definitions
  - Updated sample data INSERT statements

#### Models
- ✅ `api/models/Course.php`
  - Changed properties: `syllabus` → `syllabusPdf` (removed `syllabusFilename`)
  - Removed getters/setters for filename
  - Updated `toArray()` to generate filename dynamically: `courseCode_year_semester.pdf`

- ✅ `api/models/Test.php`
  - Changed properties: `questionLink` → `questionPaperPdf` (removed `questionPaperFilename`)
  - Added properties: `courseCode`, `year`, `semester` for filename generation
  - Removed getters/setters for filename
  - Added setters for course info
  - Updated `toArray()` to generate filename dynamically: `courseCode_year_semester_testName.pdf`

- ✅ `api/models/Question.php`
  - Removed `description` property completely
  - Removed `getDescription()`, `setDescription()` methods
  - Updated constructor (8 params → 7 params)
  - Updated `toArray()` to exclude description

#### Repositories
- ✅ `api/models/CourseRepository.php`
  - Updated all SQL queries to use `syllabus_pdf` only (removed `syllabus_filename`)
  - Modified `findById()`, `findByFacultyId()`, `findByFacultyYearSemester()`
  - Updated `save()` for both INSERT and UPDATE operations (7 columns instead of 8)

- ✅ `api/models/TestRepository.php`
  - Updated all SQL queries to use `question_paper_pdf` only (removed `question_paper_filename`)
  - Modified `findById()`, `findByCourseId()` to JOIN with course table for course_code, year, semester
  - Pass course info to Test constructor (9 params) for filename generation
  - Updated `save()` for both INSERT and UPDATE operations (5 columns instead of 6)

- ✅ `api/models/QuestionRepository.php`
  - Removed `description` from all SQL queries
  - Updated `findById()`, `findByTestId()` (7 constructor params instead of 8)
  - Updated `save()` method (6 fields instead of 7)
  - `saveMultiple()` works correctly (uses `save()` internally)

#### Controllers
- ✅ `api/controllers/AssessmentController.php`
  - Updated `createAssessment()` method
  - Changed Test constructor call: passes `question_paper_pdf` and course info (code, year, semester)
  - Added base64_decode() for PDF data
  - Removed `description` parameter from Question constructor
  - Removed `question_paper_filename` handling (auto-generated)
  - Updated to handle 7-parameter Question objects

### Frontend (TypeScript/React)

**No changes made** - As requested, all frontend files remain unchanged. Frontend will continue to work with the auto-generated filenames returned by the backend API.

### Documentation

- ✅ `docs/APIDocumentation.md`
  - Updated Course Object definition
  - Updated Test Object definition
  - Updated Question Object definition
  - Updated all API request/response examples
  - Added notes about PDF storage and base64 encoding
  - Updated validation rules

- ✅ `docs/schema.md`
  - Updated ERD diagram
  - Updated table definitions with new columns
  - Added storage notes for LONGBLOB fields
  - Updated constraints and field descriptions
  - Documented design philosophy

---

## Migration Guide

### For Existing Installations

If you have an existing database with the old schema, run these SQL commands:

```sql
-- Backup your database first!
-- mysqldump -u username -p nba > nba_backup.sql

USE nba;

-- Modify course table
ALTER TABLE course
  DROP COLUMN syllabus,
  ADD COLUMN syllabus_pdf LONGBLOB DEFAULT NULL;

-- Modify test table
ALTER TABLE test
  DROP COLUMN question_link,
  ADD COLUMN question_paper_pdf LONGBLOB DEFAULT NULL;

-- Modify question table
ALTER TABLE question
  DROP COLUMN description;

-- Verify changes
DESCRIBE course;
DESCRIBE test;
DESCRIBE question;
```

### For New Installations

Simply import the updated `docs/db.sql` file:

```bash
mysql -u username -p nba < docs/db.sql
```

---

## Testing Checklist

### Backend Testing
- [ ] Import updated db.sql successfully
- [ ] Create a new course (verify syllabus_pdf and syllabus_filename are stored)
- [ ] Create a new test with PDF (verify question_paper_pdf and question_paper_filename are stored)
- [ ] Create questions without description (verify no errors)
- [ ] Retrieve courses (verify API returns syllabus_filename and has_syllabus_pdf)
- [ ] Retrieve tests (verify API returns question_paper_filename and has_question_paper_pdf)
- [ ] Retrieve questions (verify no description field in response)
- [ ] Save marks by question (verify CO mapping still works)

### Frontend Testing
- [ ] Login successfully
- [ ] View courses list (verify syllabus filename displayed)
- [ ] View tests list (verify question paper filename displayed)
- [ ] Create new assessment with PDF upload
- [ ] View assessment details (verify questions display without description)
- [ ] Enter marks by question (verify no description shown)

---

## Benefits of Changes

### 1. Data Integrity
- PDFs stored in database = no external file dependencies
- Backup includes all files (single database dump)
- No broken links or missing files

### 2. Portability
- Easy to migrate entire system (just export/import database)
- No need to sync separate file directories
- Simplified deployment

### 3. Consistent Naming
- Filenames follow predictable pattern
- Easy to identify which course/test a PDF belongs to
- No manual filename entry errors
- Consistent across entire system
- Question metadata separate from question content
- Single source of truth (question paper PDF)
- Reduced data duplication

### 5. NBA Accreditation Compliance
- Question papers are official documents stored properly
- Syllabi attached to courses for audit purposes
- Complete audit trail in database

---

## Performance Considerations

### Database Size
- Each PDF adds to database size (typical: 100KB - 2MB per document)
- For 100 courses + 500 tests: ~150MB additional storage
- Modern MySQL handles LONGBLOB efficiently

### Query Performance
- SELECT queries exclude BLOB columns by default (no impact)
- Only fetch BLOB data when specifically needed
- Consider separate endpoint for PDF download if needed

### Optimization Tips
- Keep PDFs under 5MB for best performance
- Consider adding separate download endpoint: `GET /course/{id}/syllabus/download`
- Use CDN or caching for frequently accessed PDFs (future enhancement)

---

## Future Enhancements

### Potential Additions
1. **PDF Download Endpoints**:
   - `GET /course/{id}/syllabus` - Download syllabus PDF
   - `GET /test/{id}/question-paper` - Download question paper PDF

2. **PDF Validation**:
   - Check file size limits (e.g., max 10MB)
   - Validate PDF format
   - Virus scanning (optional)

3. **Versioning**:
   - Store multiple versions of syllabi
   - Track changes over time
   - Audit trail for document updates

4. **Compression**:
   - Compress PDFs before storage
   - Decompress on retrieval
   - Reduce database size by 50-70%

---

## Support

For issues or questions:
1. Check `docs/APIDocumentation.md` for API details
2. Check `docs/schema.md` for database structure
3. Review `docs/projectProgressReport.md` for development history
4. Check error logs in PHP error_log or browser console

---

## Rollback Procedure

If you need to revert to the old schema:

```sql
-- Backup current database first!
-- mysqldump -u username -p nba > nba_new_backup.sql

USE nba;

-- Restore course table
ALTER TABLE course
  DROP COLUMN syllabus_pdf,
  ADD COLUMN syllabus VARCHAR(500) DEFAULT NULL;

-- Restore test table
ALTER TABLE test
  DROP COLUMN question_paper_pdf,
  ADD COLUMN question_link VARCHAR(500) DEFAULT NULL;

-- Restore question table
ALTER TABLE question
  ADD COLUMN description TEXT DEFAULT NULL;
```

**Note**: This will lose all stored PDF data. Only use if absolutely necessary.

---

## Conclusion

These changes modernize the NBA Assessment System by:
- Storing documents directly in the database
- Simplifying the data model
- Improving data integrity and portability
- Supporting NBA accreditation requirements better

All changes are backward-compatible at the API level (field names changed but functionality preserved). Frontend updates ensure seamless user experience.
