import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AssessmentsSidebar } from "@/components/assessments/AssessmentsSidebar";
import { AssessmentsHeader } from "@/components/assessments/AssessmentsHeader";
import { CourseTestSelector } from "@/components/assessments/CourseTestSelector";
import { COMappingTable } from "@/components/assessments/COMappingTable";
import { apiService } from "@/services/api";
import type { User } from "@/services/api";

type COMapping = {
	[key: string]: string; // key format: "q1_a", "q2_b", etc.
};

export function AssessmentsPage() {
	const [user, setUser] = useState<User | null>(null);
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [coMapping, setCoMapping] = useState<COMapping>({});
	const [selectedCourse, setSelectedCourse] = useState<string>("");
	const [selectedTest, setSelectedTest] = useState<string>("");
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
	}, [navigate]);

	const handleLogout = async () => {
		await apiService.logout();
		navigate("/login");
	};

	const handleCOChange = (
		questionNum: number,
		subQuestion: string,
		co: string | null
	) => {
		const key = `q${questionNum}_${subQuestion}`;
		if (co === null) {
			// Remove the mapping if unselected
			setCoMapping((prev) => {
				const newMapping = { ...prev };
				delete newMapping[key];
				return newMapping;
			});
		} else {
			setCoMapping((prev) => ({
				...prev,
				[key]: co,
			}));
		}
	};

	if (!user) {
		return null;
	}

	return (
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
				/>

				{/* Dashboard Content */}
				<main className="flex-1 overflow-auto">
					<ScrollArea className="h-full">
						<div className="p-6">
							{/* Course and Test Selection */}
							<CourseTestSelector
								selectedCourse={selectedCourse}
								selectedTest={selectedTest}
								onCourseChange={setSelectedCourse}
								onTestChange={setSelectedTest}
							/>

							{/* CO Mapping Table */}
							<COMappingTable
								coMapping={coMapping}
								onCOChange={handleCOChange}
							/>

							{/* Save Button */}
							<div className="mt-6 flex justify-end px-6 pb-6">
								<Button
									size="lg"
									className="bg-blue-600 hover:bg-blue-700 text-white"
									disabled={!selectedCourse || !selectedTest}
									onClick={() => {
										console.log("CO Mapping:", {
											course: selectedCourse,
											test: selectedTest,
											mapping: coMapping,
										});
										// TODO: Save to API
									}}
								>
									Save Mapping
								</Button>
							</div>
						</div>
					</ScrollArea>
				</main>
			</div>
		</div>
	);
}
