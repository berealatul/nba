# NBA Admin Panel - Feature Documentation

## Overview

The NBA (National Board of Accreditation) Admin Panel is an aesthetic dashboard for managing an academic assessment system. It provides a comprehensive interface for managing users, courses, students, assessments, and Course Outcome (CO) mapping.

## Features Implemented

### 1. **Authentication Flow**

-   **Login Page**: Beautiful login interface with email/password fields
-   **Social Login**: Support for Apple, Google, and GitHub authentication (UI only)
-   **Theme Toggle**: Animated dark/light mode toggle
-   **Session Management**: Login/Logout functionality with state management

### 2. **Dashboard Layout**

-   **Responsive Sidebar Navigation**:
    -   Collapsible sidebar with toggle animation
    -   Navigation items: Dashboard, Users, Courses, Students, Assessments, Tests, Analytics
    -   Settings and Logout options
    -   User profile section with avatar
-   **Modern Header**:
    -   Page title and welcome message
    -   Theme toggle button
    -   Responsive design

### 3. **Statistics Cards (with Animated Numbers)**

Four beautifully designed stat cards with gradient backgrounds:

-   **Total Users**: Blue gradient with animated number ticker
-   **Total Courses**: Purple gradient with growth indicator
-   **Total Students**: Green gradient with semester info
-   **Assessments**: Orange gradient with status count

Uses Magic UI's `NumberTicker` component for smooth number animations.

### 4. **Data Tables**

#### Recent Courses Table

Displays:

-   Course Code
-   Course Name
-   Credit Hours (with badge)
-   Faculty Name

#### Recent Students Table

Displays:

-   Roll Number
-   Student Name
-   Department (with badge)
-   Programme

#### Recent Assessments Table

Displays:

-   Student Name
-   Course Name
-   Marks (with visual progress bar)
-   Grade (with color-coded badges)

### 5. **Database Schema Support**

The admin panel is designed to work with the following database structure:

**Tables:**

-   `users` - Admin, Dean, HOD, Staff roles
-   `course` - Course information with CO mapping
-   `student` - Student enrollment details
-   `enrolment` - Course registrations
-   `assessment` - Student performance records
-   `test` - Test configurations
-   `question` - Question-CO mapping
-   `raw` - Raw marks data
-   `compiled_co` - Course Outcome scores

### 6. **UI Components Used**

#### From ShadCn UI:

-   `Card` - Container components
-   `Table` - Data display
-   `Badge` - Status indicators
-   `Button` - Interactive elements
-   `Avatar` - User profiles
-   `Separator` - Visual dividers
-   `ScrollArea` - Scrollable content
-   `Input` - Form fields
-   `Label` - Form labels

#### From Magic UI:

-   `ShimmerButton` - Animated login button
-   `DotPattern` - Animated background
-   `AnimatedThemeToggler` - Theme switch
-   `NumberTicker` - Animated statistics

#### Custom Icons (from Lucide React):

-   LayoutDashboard, Users, BookOpen, GraduationCap
-   ClipboardList, FileText, BarChart3, Settings
-   LogOut, Menu, X

## Styling & Theming

### Color Scheme

-   **Light Mode**: Clean white backgrounds with subtle grays
-   **Dark Mode**: Deep dark backgrounds with elegant contrast
-   **Accent Colors**: Blue, Purple, Green, Orange gradients

### Design Principles

-   **Aesthetic**: Modern, clean, professional interface
-   **Responsive**: Works on all screen sizes
-   **Animations**: Smooth transitions and micro-interactions
-   **Accessibility**: Proper contrast ratios and semantic HTML

## Dummy Data

The application includes sample data for demonstration:

### Users

-   Total: 42 users (Admin, Dean, HOD, Staff roles)

### Courses

Sample courses include:

-   CS101 - Data Structures (4 credits)
-   CS201 - Algorithms (4 credits)
-   CS301 - Database Systems (3 credits)
-   CS401 - Machine Learning (4 credits)
-   MA101 - Calculus (4 credits)

### Students

Sample students from:

-   Computer Science Engineering (CSE)
-   Electrical & Electronics Engineering (EEE)
-   Mechanical Engineering (MECH)

### Assessments

Performance records with:

-   Marks ranging from 75-92
-   Grades from B to A+
-   Visual progress indicators

## Usage

### Starting the Application

```bash
cd frontend
npm run dev
```

### Login Flow

1. Enter any email and password on the login page
2. Click "Sign In" button
3. Dashboard will load automatically

### Navigation

-   Use sidebar menu to navigate between sections
-   Click hamburger icon to collapse/expand sidebar
-   Use theme toggle to switch between dark/light modes
-   Click "Logout" to return to login page

## Future Enhancements

Potential features for future development:

-   Real API integration with backend
-   Advanced analytics and charts
-   CO attainment calculation and visualization
-   Bulk data import/export
-   Real-time notifications
-   User role-based access control
-   Advanced filtering and search
-   Report generation (PDF/Excel)
-   Course outcome trend analysis
-   Student performance tracking graphs

## Technologies Used

-   **React 19.1.1**: Frontend framework
-   **TypeScript**: Type-safe development
-   **Vite 7.1.12**: Fast build tool
-   **Tailwind CSS 4.1.16**: Utility-first styling
-   **Framer Motion**: Animations
-   **ShadCn UI**: Component library
-   **Magic UI**: Enhanced UI components
-   **Lucide React**: Icon library

## File Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── AdminDashboard.tsx    # Main dashboard component
│   │   ├── LoginPage.tsx         # Authentication page
│   │   ├── theme-provider.tsx    # Theme management
│   │   └── ui/                   # UI component library
│   ├── App.tsx                   # Root component with routing
│   └── main.tsx                  # Application entry point
├── components.json               # ShadCn configuration
└── package.json                  # Dependencies
```

## Credits

-   UI Components: [ShadCn UI](https://ui.shadcn.com/)
-   Magic Components: [Magic UI](https://magicui.design/)
-   Icons: [Lucide Icons](https://lucide.dev/)
