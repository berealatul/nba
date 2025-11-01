import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NumberTicker } from "@/components/ui/number-ticker";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
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
  X
} from "lucide-react";

// Dummy data based on schema
const stats = {
  totalUsers: 42,
  totalCourses: 28,
  totalStudents: 350,
  totalAssessments: 156,
};

const recentCourses = [
  { id: 1, code: "CS101", name: "Data Structures", credit: 4, faculty: "Dr. Smith", year: 2, semester: 1 },
  { id: 2, code: "CS201", name: "Algorithms", credit: 4, faculty: "Dr. Johnson", year: 2, semester: 2 },
  { id: 3, code: "CS301", name: "Database Systems", credit: 3, faculty: "Dr. Williams", year: 3, semester: 1 },
  { id: 4, code: "CS401", name: "Machine Learning", credit: 4, faculty: "Dr. Brown", year: 4, semester: 1 },
  { id: 5, code: "MA101", name: "Calculus", credit: 4, faculty: "Dr. Davis", year: 1, semester: 1 },
];

const recentStudents = [
  { rollno: "CS2021001", name: "Alice Johnson", dept: "CSE", programme: "B.Tech" },
  { rollno: "CS2021002", name: "Bob Smith", dept: "CSE", programme: "B.Tech" },
  { rollno: "CS2021003", name: "Charlie Brown", dept: "CSE", programme: "B.Tech" },
  { rollno: "EE2021001", name: "Diana Prince", dept: "EEE", programme: "B.Tech" },
  { rollno: "ME2021001", name: "Ethan Hunt", dept: "MECH", programme: "B.Tech" },
];

const recentAssessments = [
  { student: "Alice Johnson", course: "Data Structures", marks: 85, grade: "A" },
  { student: "Bob Smith", course: "Algorithms", marks: 78, grade: "B+" },
  { student: "Charlie Brown", course: "Database Systems", marks: 92, grade: "A+" },
  { student: "Diana Prince", course: "Machine Learning", marks: 88, grade: "A" },
  { student: "Ethan Hunt", course: "Calculus", marks: 75, grade: "B" },
];

type NavItem = {
  id: string;
  label: string;
  icon: any;
};

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "courses", label: "Courses", icon: BookOpen },
  { id: "students", label: "Students", icon: GraduationCap },
  { id: "assessments", label: "Assessments", icon: ClipboardList },
  { id: "tests", label: "Tests", icon: FileText },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } transition-all duration-300 ease-in-out bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-gray-900 dark:text-white">NBA System</span>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveNav(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <Separator className="my-4" />

            {/* Settings & Logout */}
            <div className="space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </ScrollArea>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-600 text-white">
                  AD
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">Admin User</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">admin@nba.edu</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-700 dark:text-gray-300"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Welcome back, Admin! Here's your overview.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <AnimatedThemeToggler />
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
              {/* Stats Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-linear-to-br from-blue-500 to-blue-600 text-white border-0">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">Total Users</CardTitle>
                    <Users className="h-4 w-4 opacity-75" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      <NumberTicker value={stats.totalUsers} />
                    </div>
                    <p className="text-xs opacity-75 mt-1">+12% from last month</p>
                  </CardContent>
                </Card>

                <Card className="bg-linear-to-br from-purple-500 to-purple-600 text-white border-0">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">Total Courses</CardTitle>
                    <BookOpen className="h-4 w-4 opacity-75" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      <NumberTicker value={stats.totalCourses} />
                    </div>
                    <p className="text-xs opacity-75 mt-1">+3 new this semester</p>
                  </CardContent>
                </Card>

                <Card className="bg-linear-to-br from-green-500 to-green-600 text-white border-0">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">Total Students</CardTitle>
                    <GraduationCap className="h-4 w-4 opacity-75" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      <NumberTicker value={stats.totalStudents} />
                    </div>
                    <p className="text-xs opacity-75 mt-1">Active this semester</p>
                  </CardContent>
                </Card>

                <Card className="bg-linear-to-br from-orange-500 to-orange-600 text-white border-0">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">Assessments</CardTitle>
                    <ClipboardList className="h-4 w-4 opacity-75" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      <NumberTicker value={stats.totalAssessments} />
                    </div>
                    <p className="text-xs opacity-75 mt-1">Completed & pending</p>
                  </CardContent>
                </Card>
              </div>

              {/* Tables Grid */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Courses */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">Recent Courses</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      Latest courses in the system
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-gray-700 dark:text-gray-300">Code</TableHead>
                          <TableHead className="text-gray-700 dark:text-gray-300">Name</TableHead>
                          <TableHead className="text-gray-700 dark:text-gray-300">Credits</TableHead>
                          <TableHead className="text-gray-700 dark:text-gray-300">Faculty</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentCourses.map((course) => (
                          <TableRow key={course.id}>
                            <TableCell className="font-medium text-gray-900 dark:text-white">
                              {course.code}
                            </TableCell>
                            <TableCell className="text-gray-700 dark:text-gray-300">{course.name}</TableCell>
                            <TableCell className="text-gray-700 dark:text-gray-300">
                              <Badge variant="outline">{course.credit}</Badge>
                            </TableCell>
                            <TableCell className="text-gray-700 dark:text-gray-300">{course.faculty}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Recent Students */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">Recent Students</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      Newly enrolled students
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-gray-700 dark:text-gray-300">Roll No</TableHead>
                          <TableHead className="text-gray-700 dark:text-gray-300">Name</TableHead>
                          <TableHead className="text-gray-700 dark:text-gray-300">Dept</TableHead>
                          <TableHead className="text-gray-700 dark:text-gray-300">Programme</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentStudents.map((student) => (
                          <TableRow key={student.rollno}>
                            <TableCell className="font-medium text-gray-900 dark:text-white">
                              {student.rollno}
                            </TableCell>
                            <TableCell className="text-gray-700 dark:text-gray-300">{student.name}</TableCell>
                            <TableCell className="text-gray-700 dark:text-gray-300">
                              <Badge>{student.dept}</Badge>
                            </TableCell>
                            <TableCell className="text-gray-700 dark:text-gray-300">{student.programme}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Assessments */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Recent Assessments</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Latest student performance records
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-gray-700 dark:text-gray-300">Student</TableHead>
                        <TableHead className="text-gray-700 dark:text-gray-300">Course</TableHead>
                        <TableHead className="text-gray-700 dark:text-gray-300">Marks</TableHead>
                        <TableHead className="text-gray-700 dark:text-gray-300">Grade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentAssessments.map((assessment, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium text-gray-900 dark:text-white">
                            {assessment.student}
                          </TableCell>
                          <TableCell className="text-gray-700 dark:text-gray-300">{assessment.course}</TableCell>
                          <TableCell className="text-gray-700 dark:text-gray-300">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                  className="bg-linear-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                                  style={{ width: `${assessment.marks}%` }}
                                />
                              </div>
                              <span>{assessment.marks}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-700 dark:text-gray-300">
                            <Badge
                              className={
                                assessment.grade.startsWith("A")
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              }
                            >
                              {assessment.grade}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}
