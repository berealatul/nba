# Component Structure

This document outlines the refactored component architecture organized by page-specific directories.

## Directory Structure

```
src/
├── components/
│   ├── ui/                          # Shared UI components (ShadCN, Magic UI)
│   ├── login/                       # Login page specific components
│   │   ├── LoginForm.tsx
│   │   └── LoginHero.tsx
│   └── assessments/                 # Assessments page specific components
│       ├── AssessmentsHeader.tsx
│       ├── AssessmentsSidebar.tsx
│       ├── CourseTestSelector.tsx
│       └── COMappingTable.tsx
├── pages/                           # Main page components
│   ├── LoginPage.tsx
│   ├── AdminDashboard.tsx
│   └── AssessmentsPage.tsx
└── services/
    └── api.ts                       # API service layer
```

## Component Breakdown

### Login Components (`components/login/`)

#### LoginForm.tsx

-   **Purpose**: Handles the login form UI and user input
-   **Props**:
    -   `onSubmit: (identifier: string, password: string) => Promise<void>` - Login handler
    -   `loading: boolean` - Loading state
    -   `error: string` - Error message to display
-   **Features**:
    -   Email or Employee ID input field
    -   Password field with "Forgot password?" link
    -   ShimmerButton for submit action
    -   Social login buttons (Apple, Google, GitHub)
    -   Sign up link
    -   Error message display with AlertCircle icon

#### LoginHero.tsx

-   **Purpose**: Displays the promotional/hero section of the login page
-   **Props**: None
-   **Features**:
    -   Gradient background (blue to purple)
    -   Title and description
    -   Three feature highlights with check icons:
        -   Secure and encrypted
        -   24/7 customer support
        -   Easy to use interface

### Assessments Components (`components/assessments/`)

#### AssessmentsHeader.tsx

-   **Purpose**: Top navigation bar for assessments page
-   **Props**:
    -   `sidebarOpen: boolean` - Current sidebar state
    -   `onToggleSidebar: () => void` - Sidebar toggle handler
-   **Features**:
    -   Hamburger menu button
    -   Page title "Question CO Mapping"
    -   Subtitle with instructions
    -   Theme toggler button

#### AssessmentsSidebar.tsx

-   **Purpose**: Left sidebar navigation with user info
-   **Props**:
    -   `user: User` - Current user object
    -   `sidebarOpen: boolean` - Sidebar visibility state
    -   `onLogout: () => void` - Logout handler
-   **Features**:
    -   University logo and department info
    -   Active "Assessments" navigation item
    -   Logout button
    -   User avatar with initials
    -   User name and email display

#### CourseTestSelector.tsx

-   **Purpose**: Dropdowns for selecting course and test type
-   **Props**:
    -   `selectedCourse: string` - Currently selected course ID
    -   `selectedTest: string` - Currently selected test type
    -   `onCourseChange: (courseId: string) => void` - Course selection handler
    -   `onTestChange: (test: string) => void` - Test selection handler
-   **Features**:
    -   Course dropdown with 5 options (CS101-CS501)
    -   Test type dropdown (Test-1, Mid-Term, Test-2, End-Term)
    -   Responsive grid layout (2 columns on desktop, 1 on mobile)

#### COMappingTable.tsx

-   **Purpose**: 20×8 table for mapping questions to Course Outcomes
-   **Props**:
    -   `coMapping: COMapping` - Current CO mapping state
    -   `onCOChange: (questionNum: number, subQuestion: string, co: string | null) => void` - CO change handler
-   **Features**:
    -   20 questions (Q1-Q20)
    -   8 sub-questions per question (a-h)
    -   6 CO options (CO1-CO6) plus "Select CO" to unselect
    -   Sticky first column for question numbers
    -   Horizontal scrolling for responsiveness
    -   Compact design with 80px button widths

## Page Components

### LoginPage.tsx

-   **Composition**: Uses LoginForm and LoginHero components
-   **Responsibilities**:
    -   API integration via apiService
    -   Role-based routing (faculty → /assessments, others → /dashboard)
    -   Error and loading state management
    -   Background with DotPattern and theme toggler

### AssessmentsPage.tsx

-   **Composition**: Uses AssessmentsHeader, AssessmentsSidebar, CourseTestSelector, COMappingTable
-   **Responsibilities**:
    -   User authentication check
    -   CO mapping state management
    -   Course and test selection state
    -   Save functionality (placeholder)
    -   Layout orchestration

### AdminDashboard.tsx

-   **Status**: Not yet refactored
-   **TODO**: Create admin-specific components in `components/admin/` directory

## Benefits of This Structure

1. **Separation of Concerns**: Each component has a single, clear responsibility
2. **Reusability**: Components can be reused across different pages
3. **Maintainability**: Easier to locate and update specific functionality
4. **Testability**: Smaller components are easier to test in isolation
5. **Organization**: Components grouped by feature/page for better navigation
6. **Scalability**: Easy to add new page-specific component directories

## Future Improvements

1. **Admin Components**: Refactor AdminDashboard into smaller components
2. **Shared Components**: Move commonly used patterns to a shared directory
3. **API Integration**: Complete CO mapping save functionality
4. **Loading States**: Add skeleton loaders for better UX
5. **Error Boundaries**: Implement error boundaries for graceful error handling
