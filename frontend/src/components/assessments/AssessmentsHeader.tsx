import { Button } from "@/components/ui/button";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, Plus, ChevronDown } from "lucide-react";
import type { Course } from "@/services/api";

interface AssessmentsHeaderProps {
	sidebarOpen: boolean;
	onToggleSidebar: () => void;
	courses: Course[];
	selectedCourse: Course | null;
	onCourseChange: (course: Course | null) => void;
	onCreateNew: () => void;
	isMarksPage?: boolean;
}

export function AssessmentsHeader({
	sidebarOpen,
	onToggleSidebar,
	courses,
	selectedCourse,
	onCourseChange,
	onCreateNew,
	isMarksPage = false,
}: AssessmentsHeaderProps) {
	return (
		<header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6">
			<div className="flex items-center gap-4">
				<Button
					variant="ghost"
					size="icon"
					onClick={onToggleSidebar}
					className="text-gray-700 dark:text-gray-300"
				>
					{sidebarOpen ? (
						<X className="w-5 h-5" />
					) : (
						<Menu className="w-5 h-5" />
					)}
				</Button>
				<div>
					<h1 className="text-xl font-bold text-gray-900 dark:text-white">
						{isMarksPage
							? "Marks Management"
							: "Assessment Management"}
					</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						{isMarksPage
							? "Enter and manage student marks"
							: "Create and manage course assessments"}
					</p>
				</div>
			</div>

			<div className="flex items-center gap-3">
				{/* Course Selector */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							className="min-w-[200px] justify-between"
						>
							<span className="truncate">
								{selectedCourse
									? `${selectedCourse.course_code} - ${selectedCourse.name}`
									: "All Courses"}
							</span>
							<ChevronDown className="w-4 h-4 ml-2" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-[300px]">
						<DropdownMenuItem onClick={() => onCourseChange(null)}>
							All Courses
						</DropdownMenuItem>
						{courses.map((course) => (
							<DropdownMenuItem
								key={course.id}
								onClick={() => onCourseChange(course)}
							>
								<div className="flex flex-col">
									<span className="font-medium">
										{course.course_code} - {course.name}
									</span>
									<span className="text-xs text-gray-500">
										{course.semester} Semester, Year{" "}
										{course.year}
									</span>
								</div>
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>

				{/* Create New Button - Only show on assessments page */}
				{!isMarksPage && (
					<Button onClick={onCreateNew} className="gap-2">
						<Plus className="w-4 h-4" />
						Create Assessment
					</Button>
				)}

				<AnimatedThemeToggler />
			</div>
		</header>
	);
}
