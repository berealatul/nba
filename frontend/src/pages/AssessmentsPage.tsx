import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AssessmentsSidebar } from "@/components/assessments/AssessmentsSidebar";
import { AssessmentsHeader } from "@/components/assessments/AssessmentsHeader";
import { CreateAssessmentForm } from "@/components/assessments/CreateAssessmentForm";
import { TestsList } from "@/components/assessments/TestsList";
import { Toaster } from "@/components/ui/sonner";
import { apiService } from "@/services/api";
import type { User, Course } from "@/services/api";

export function AssessmentsPage() {
	const [user, setUser] = useState<User | null>(null);
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [courses, setCourses] = useState<Course[]>([]);
	const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [refreshTrigger, setRefreshTrigger] = useState(0);
	const navigate = useNavigate();

	useEffect(() => {
		const storedUser = apiService.getStoredUser();
		if (!storedUser) {
			navigate("/login");
			return;
		}
		if (storedUser.role !== "faculty") {
			navigate("/dashboard");
			return;
		}
		setUser(storedUser);
		loadCourses();
	}, [navigate]);

	const loadCourses = async () => {
		try {
			const coursesData = await apiService.getCourses();
			setCourses(coursesData);
		} catch (error) {
			console.error("Failed to load courses:", error);
		}
	};

	const handleLogout = async () => {
		await apiService.logout();
		navigate("/login");
	};

	const handleAssessmentCreated = (courseId?: number) => {
		setShowCreateForm(false);
		// If a courseId is provided, select that course
		if (courseId) {
			const course = courses.find((c) => c.id === courseId);
			if (course) {
				setSelectedCourse(course);
			}
		}
		setRefreshTrigger((prev) => prev + 1);
	};

	if (!user) {
		return null;
	}

	return (
		<>
			<Toaster />
			<div className="flex h-screen bg-gray-50 dark:bg-gray-950">
				{/* Sidebar */}
				<AssessmentsSidebar
					user={user}
					sidebarOpen={sidebarOpen}
					onLogout={handleLogout}
				/>

				{/* Main Content */}
				<div className="flex-1 flex flex-col overflow-hidden">
					{/* Header */}
					<AssessmentsHeader
						sidebarOpen={sidebarOpen}
						onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
						courses={courses}
						selectedCourse={selectedCourse}
						onCourseChange={setSelectedCourse}
						onCreateNew={() => setShowCreateForm(true)}
					/>

					{/* Dashboard Content */}
					<main className="flex-1 overflow-auto">
						<ScrollArea className="h-full">
							<div className="p-6">
								{showCreateForm ? (
									<CreateAssessmentForm
										courses={courses}
										onSuccess={handleAssessmentCreated}
										onCancel={() =>
											setShowCreateForm(false)
										}
									/>
								) : (
									<TestsList
										course={selectedCourse}
										refreshTrigger={refreshTrigger}
									/>
								)}
							</div>
						</ScrollArea>
					</main>
				</div>
			</div>
		</>
	);
}
