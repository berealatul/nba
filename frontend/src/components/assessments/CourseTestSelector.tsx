import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const TEST_OPTIONS = ["Test-1", "Mid-Term", "Test-2", "End-Term"];

const COURSES = [
	{ id: "CS101", name: "Introduction to Programming" },
	{ id: "CS201", name: "Data Structures and Algorithms" },
	{ id: "CS301", name: "Database Management Systems" },
	{ id: "CS401", name: "Software Engineering" },
	{ id: "CS501", name: "Machine Learning" },
];

interface CourseTestSelectorProps {
	selectedCourse: string;
	selectedTest: string;
	onCourseChange: (courseId: string) => void;
	onTestChange: (test: string) => void;
}

export function CourseTestSelector({
	selectedCourse,
	selectedTest,
	onCourseChange,
	onTestChange,
}: CourseTestSelectorProps) {
	return (
		<Card className="mb-6">
			<CardHeader>
				<CardTitle className="text-gray-900 dark:text-white">
					Select Course and Test
				</CardTitle>
				<CardDescription className="text-gray-600 dark:text-gray-400">
					Choose the course and test type for CO mapping
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Course Selection */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
							Course
						</label>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									className="w-full justify-between text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
								>
									<span className="text-sm truncate">
										{selectedCourse
											? COURSES.find(
													(c) =>
														c.id === selectedCourse
											  )?.name || "Select Course"
											: "Select Course"}
									</span>
									<ChevronDown className="h-4 w-4 opacity-50 ml-2 shrink-0" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-[400px]">
								{COURSES.map((course) => (
									<DropdownMenuItem
										key={course.id}
										onClick={() =>
											onCourseChange(course.id)
										}
										className="cursor-pointer text-gray-900 dark:text-white"
									>
										<div className="flex flex-col">
											<span className="font-medium">
												{course.id}
											</span>
											<span className="text-sm text-gray-600 dark:text-gray-400">
												{course.name}
											</span>
										</div>
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					{/* Test Selection */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
							Test Type
						</label>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									className="w-full justify-between text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
								>
									<span className="text-sm">
										{selectedTest || "Select Test"}
									</span>
									<ChevronDown className="h-4 w-4 opacity-50 ml-2 shrink-0" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-[200px]">
								{TEST_OPTIONS.map((test) => (
									<DropdownMenuItem
										key={test}
										onClick={() => onTestChange(test)}
										className="cursor-pointer text-gray-900 dark:text-white"
									>
										{test}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
