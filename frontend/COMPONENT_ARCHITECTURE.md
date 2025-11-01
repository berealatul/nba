# NBA Admin Panel - Component Architecture

## Component Hierarchy

```
App.tsx (Root)
├── State: isLoggedIn
├── LoginPage (when !isLoggedIn)
│   ├── Card
│   │   ├── Form
│   │   │   ├── Label + Input (Email)
│   │   │   ├── Label + Input (Password)
│   │   │   └── ShimmerButton (Submit)
│   │   └── Social Login Buttons
│   │       ├── Button (Apple)
│   │       ├── Button (Google)
│   │       └── Button (GitHub)
│   ├── DotPattern (Background)
│   └── AnimatedThemeToggler
│
└── AdminDashboard (when isLoggedIn)
    ├── Sidebar
    │   ├── Logo Section
    │   ├── Navigation Menu
    │   │   ├── Dashboard
    │   │   ├── Users
    │   │   ├── Courses
    │   │   ├── Students
    │   │   ├── Assessments
    │   │   ├── Tests
    │   │   └── Analytics
    │   ├── Separator
    │   ├── Settings Button
    │   ├── Logout Button
    │   └── User Profile
    │       └── Avatar + Info
    │
    └── Main Content Area
        ├── Header
        │   ├── Hamburger Menu Button
        │   ├── Page Title
        │   └── AnimatedThemeToggler
        │
        └── Dashboard Content (ScrollArea)
            ├── Stats Row (Grid)
            │   ├── Card (Total Users)
            │   │   └── NumberTicker
            │   ├── Card (Total Courses)
            │   │   └── NumberTicker
            │   ├── Card (Total Students)
            │   │   └── NumberTicker
            │   └── Card (Total Assessments)
            │       └── NumberTicker
            │
            ├── Tables Grid
            │   ├── Card (Recent Courses)
            │   │   └── Table
            │   │       ├── TableHeader
            │   │       └── TableBody
            │   │           └── TableRow (x5)
            │   │               └── Badge (Credits)
            │   │
            │   └── Card (Recent Students)
            │       └── Table
            │           ├── TableHeader
            │           └── TableBody
            │               └── TableRow (x5)
            │                   └── Badge (Department)
            │
            └── Card (Recent Assessments)
                └── Table
                    ├── TableHeader
                    └── TableBody
                        └── TableRow (x5)
                            ├── Progress Bar (Marks)
                            └── Badge (Grade)
```

## Component Details

### 1. LoginPage Component

**Purpose**: Authentication interface  
**Props**: `onLogin: () => void`  
**State**:

-   `email: string`
-   `password: string`

**Children**:

-   Card (form container)
-   Input × 2 (email, password)
-   Label × 2
-   ShimmerButton (submit)
-   Button × 3 (social login)
-   DotPattern (background)
-   AnimatedThemeToggler

### 2. AdminDashboard Component

**Purpose**: Main dashboard interface  
**Props**: `onLogout: () => void`  
**State**:

-   `activeNav: string` (current nav item)
-   `sidebarOpen: boolean` (sidebar visibility)

**Sections**:

-   **Sidebar** (280px width, collapsible)
-   **Header** (64px height, fixed)
-   **Content** (flexible, scrollable)

### 3. Stats Cards (4 cards)

**Structure**: Card → CardHeader → CardContent  
**Features**:

-   Gradient backgrounds (blue, purple, green, orange)
-   Icon in header
-   NumberTicker for animated values
-   Growth indicators

**Data**:

-   Total Users: 42
-   Total Courses: 28
-   Total Students: 350
-   Total Assessments: 156

### 4. Data Tables (3 tables)

#### Recent Courses Table

**Columns**: Code, Name, Credits, Faculty  
**Rows**: 5  
**Special**: Badge for credits

#### Recent Students Table

**Columns**: Roll No, Name, Dept, Programme  
**Rows**: 5  
**Special**: Badge for department

#### Recent Assessments Table

**Columns**: Student, Course, Marks, Grade  
**Rows**: 5  
**Special**:

-   Progress bar for marks
-   Color-coded badge for grades

## UI Component Library Usage

### From ShadCn UI

```typescript
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
```

### From Magic UI

```typescript
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { DotPattern } from "@/components/ui/dot-pattern";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { NumberTicker } from "@/components/ui/number-ticker";
```

### From Lucide Icons

```typescript
import {
	LayoutDashboard,
	Users,
	BookOpen,
	GraduationCap,
	ClipboardList,
	FileText,
	BarChart3,
	Settings,
	LogOut,
	Menu,
	X,
} from "lucide-react";
```

## State Management

### App Level

```typescript
const [isLoggedIn, setIsLoggedIn] = useState(false);
```

### LoginPage

```typescript
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
```

### AdminDashboard

```typescript
const [activeNav, setActiveNav] = useState("dashboard");
const [sidebarOpen, setSidebarOpen] = useState(true);
```

### ThemeProvider (Global)

```typescript
type Theme = "dark" | "light" | "system";
const [theme, setTheme] = useState<Theme>();
// Persisted in localStorage as "nba-ui-theme"
```

## Data Flow

```
User Action → State Update → Component Re-render → UI Update

Examples:

1. Login Flow:
   LoginPage.handleSubmit() → onLogin() → App.setIsLoggedIn(true) → Render AdminDashboard

2. Logout Flow:
   AdminDashboard Logout Button → onLogout() → App.setIsLoggedIn(false) → Render LoginPage

3. Theme Toggle:
   AnimatedThemeToggler → setTheme() → Update localStorage → Re-render with new theme

4. Sidebar Toggle:
   Menu Button → setSidebarOpen(!sidebarOpen) → Animate sidebar width
```

## Styling System

### Tailwind CSS Classes

```css
/* Gradients */
bg-linear-to-br from-blue-500 to-blue-600

/* Dark Mode */
dark:bg-gray-900 dark:text-white

/* Responsive */
md:grid-cols-2 lg:grid-cols-4

/* Animations */
transition-all duration-300 ease-in-out
```

### CSS Variables

```css
/* Theme colors stored in :root */
--primary, --secondary, --background, --foreground, etc.
```

## Animation System

### Framer Motion

-   **AnimatedThemeToggler**: Circular transition effect
-   **DotPattern**: SVG dot animation
-   **ShimmerButton**: Shimmer slide animation
-   **NumberTicker**: Count-up animation with spring physics

### CSS Animations

-   Sidebar slide in/out
-   Button hover effects
-   Card hover shadows
-   Progress bar fills

## Responsive Breakpoints

```css
/* Tailwind defaults */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
```

### Responsive Behavior

-   **Mobile** (< 768px): Sidebar collapsed by default
-   **Tablet** (768px - 1024px): Collapsible sidebar
-   **Desktop** (> 1024px): Full sidebar visible

## Database Schema Mapping

### Dummy Data Structure

```typescript
// Courses
{
  id: number,
  code: string,      // Maps to course.course_code
  name: string,      // Maps to course.name
  credit: number,    // Maps to course.credit
  faculty: string,   // Maps to course.faculty
  year: number,      // Maps to course.year
  semester: number   // Maps to course.semester
}

// Students
{
  rollno: string,    // Maps to student.rollno
  name: string,      // Maps to student.name
  dept: string,      // Maps to student.dept
  programme: string  // Maps to student.programme
}

// Assessments
{
  student: string,   // Joined from student.name
  course: string,    // Joined from course.name
  marks: number,     // Maps to assessment.marks
  grade: string      // Maps to assessment.grade
}
```

## Performance Optimizations

1. **React Memo**: NumberTicker component is memoized
2. **ScrollArea**: Virtual scrolling for large lists
3. **CSS Transitions**: Hardware-accelerated transforms
4. **Lazy Loading**: Components rendered only when visible
5. **Theme Persistence**: LocalStorage caching

## Accessibility Features

1. **Semantic HTML**: Proper heading hierarchy
2. **ARIA Labels**: Screen reader support
3. **Keyboard Navigation**: Tab order and focus management
4. **Color Contrast**: WCAG AA compliant
5. **Focus Indicators**: Visible focus rings

## File Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── AdminDashboard.tsx     (450 lines)
│   │   ├── LoginPage.tsx          (300 lines)
│   │   ├── theme-provider.tsx     (100 lines)
│   │   └── ui/
│   │       ├── card.tsx
│   │       ├── button.tsx
│   │       ├── table.tsx
│   │       ├── badge.tsx
│   │       ├── avatar.tsx
│   │       ├── separator.tsx
│   │       ├── scroll-area.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── shimmer-button.tsx
│   │       ├── dot-pattern.tsx
│   │       ├── animated-theme-toggler.tsx
│   │       └── number-ticker.tsx
│   ├── lib/
│   │   └── utils.ts
│   ├── App.tsx                    (25 lines)
│   ├── App.css
│   ├── main.tsx                   (15 lines)
│   └── index.css
├── components.json
├── package.json
├── tsconfig.json
├── vite.config.ts
├── ADMIN_PANEL_README.md
├── QUICK_START.md
└── IMPLEMENTATION_SUMMARY.md
```

---

This architecture provides a scalable, maintainable foundation for the NBA Admin Panel with clear separation of concerns and reusable components.
