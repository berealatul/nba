# Assessment Interface - User Guide

## 🎯 Main Features

### 1. Course Selection

**Location:** Top-right dropdown in header  
**Function:** Filter assessments by course or view all courses

```
┌─────────────────────────────────────────────┐
│ [≡] Assessment Management                   │
│     Create and manage course assessments    │
│                                   [CSE301 -  │
│                         Data Structures ▼]  │
│                         [+ Create Assessment]│
│                                      [🌙]   │
└─────────────────────────────────────────────┘
```

### 2. Assessments List View

**When:** After selecting a course  
**Shows:** All tests for the selected course

```
┌─────────────────────────────────────────────────────┐
│ Assessments for CSE301 - Data Structures           │
│ Odd Semester, Year 2024                            │
├─────────────────────────────────────────────────────┤
│ Test Name      │ Full Marks │ Pass Marks │ Actions  │
├─────────────────────────────────────────────────────┤
│ Mid-Term Exam  │    50      │     20     │ [👁 View] │
│ Final Exam     │   100      │     40     │ [👁 View] │
└─────────────────────────────────────────────────────┘
```

### 3. Create Assessment Form

**When:** Click "Create Assessment" button  
**Contains:** Test details + Questions builder

#### Test Details Section

```
┌─────────────────────────────────────────────┐
│ Assessment Details                           │
├─────────────────────────────────────────────┤
│ Course: *                                    │
│ [CSE301 - Data Structures ▼]               │
│                                              │
│ Assessment Name: *                           │
│ [Mid-Term Examination________________]      │
│                                              │
│ Full Marks: *        Pass Marks: *          │
│ [100_______]         [40_______]            │
│                                              │
│ Question Paper Link:                         │
│ [https://example.com/paper.pdf______]      │
└─────────────────────────────────────────────┘
```

#### Questions Builder Section

```
┌─────────────────────────────────────────────┐
│ Questions                    [+ Add Question]│
├─────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────┐ │
│ │ Question Number: * │ Sub-Question:     │ │
│ │ [1___]             │ [a]               │ │
│ │                                         │ │
│ │ Course Outcome: *  │ Max Marks: *      │ │
│ │ [CO1 ▼]            │ [10___]           │ │
│ │                                         │ │
│ │ Description:                            │ │
│ │ [Explain the concept of...______]      │ │
│ │                                         │ │
│ │ ☐ Optional question (attempt either/or)│🗑│
│ └─────────────────────────────────────────┘ │
│                                              │
│ [Another question card...]                   │
└─────────────────────────────────────────────┘
         [✕ Cancel]  [💾 Create Assessment]
```

## 🔄 Workflows

### Creating a New Assessment

1. **Select Course**

    - Click course dropdown in header
    - Choose the course you want to create test for

2. **Click "Create Assessment"**

    - Form appears in main area

3. **Fill Test Details**

    - Select course (if not pre-selected)
    - Enter test name (e.g., "Mid-Term Exam")
    - Enter full marks (e.g., 100)
    - Enter pass marks (e.g., 40)
    - Optional: Add question paper link

4. **Add Questions**

    - Click "+ Add Question" button
    - For each question:
        - Set question number (1-20)
        - Optional: Add sub-question (a-h)
        - Select CO (1-6)
        - Enter max marks (minimum 0.5)
        - Optional: Add description
        - Optional: Mark as optional question

5. **Review and Submit**
    - Verify all details
    - Click "Create Assessment"
    - Success toast appears
    - Redirects to tests list

### Viewing Assessments

1. **Select "All Courses"** in dropdown

    - Shows prompt to select a course

2. **Select Specific Course**

    - Shows all tests for that course
    - Empty state if no tests exist

3. **View Test Details** (Coming Soon)
    - Click "View Details" on any test
    - Shows questions and other details

## 💡 Tips & Tricks

### Question Numbering

-   **Main Question:** Leave sub-question empty
    -   Example: Question 1
-   **Sub-Question:** Add letter a-h
    -   Example: Question 2a, 2b, 2c

### Optional Questions

-   Use for "attempt any one" scenarios
-   Check the "Optional question" checkbox
-   Example: Question 5a and 5b both optional

### Marks Allocation

-   Supports decimal values (0.5, 1.5, 2.5, etc.)
-   Minimum is 0.5 marks
-   No maximum limit
-   No requirement for marks to sum to full marks (handles optional questions)

### CO Mapping

-   Each question must map to ONE CO (1-6)
-   Sub-questions of same question can map to different COs
-   Example:
    -   Question 3a → CO1
    -   Question 3b → CO2

### Question Paper Link

-   Optional field
-   Must be a valid URL (https://...)
-   Can be Google Drive link, institutional portal, etc.
-   Displayed in tests list with external link icon

## 🎨 Visual States

### Empty States

```
┌─────────────────────────────────────────┐
│              [📄]                        │
│                                          │
│         No Course Selected               │
│                                          │
│  Select a course from the dropdown       │
│       above to view its assessments      │
└─────────────────────────────────────────┘
```

### Loading State

```
┌─────────────────────────────────────────┐
│         Loading...                       │
└─────────────────────────────────────────┘
```

### Success Toast

```
┌─────────────────────────────────────────┐
│ ✓ Assessment created successfully!      │
│   Test ID: 42                            │
└─────────────────────────────────────────┘
```

### Error Toast

```
┌─────────────────────────────────────────┐
│ ✗ Please fill in all required fields    │
└─────────────────────────────────────────┘
```

## 🔧 Validation Messages

### Form-Level Errors

-   "Please fill in all required fields"
-   "Please add at least one question"

### Question-Level Errors

-   "Question X: Maximum marks must be at least 0.5"
-   "Question Xa: CO must be between 1 and 6"

### Network Errors

-   "Failed to load courses"
-   "Failed to create assessment"
-   Specific API error messages shown

## 🌙 Dark Mode Support

All components fully support dark mode:

-   Automatic theme detection
-   Toggle in header (animated)
-   Consistent colors across all states
-   High contrast for accessibility

## ⌨️ Keyboard Shortcuts (Coming Soon)

-   `Ctrl+N` - Create new assessment
-   `Ctrl+S` - Save/submit form
-   `Esc` - Cancel form
-   `Ctrl+K` - Quick course search

## 📱 Responsive Design

-   Desktop: Full layout with sidebar
-   Tablet: Collapsible sidebar
-   Mobile: Hidden sidebar, toggle button
-   Tables: Horizontal scroll on small screens

## 🔒 Security

-   JWT authentication required
-   Role-based access (faculty only)
-   Auto-logout on token expiry
-   Secure API communication
