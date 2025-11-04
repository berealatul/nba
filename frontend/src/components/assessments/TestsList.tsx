import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, FileText } from "lucide-react";
import { apiService } from "@/services/api";
import type { Course, Test } from "@/services/api";

interface TestsListProps {
	course: Course | null;
	refreshTrigger: number;
}

export function TestsList({ course, refreshTrigger }: TestsListProps) {
	const [tests, setTests] = useState<Test[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (course) {
			loadTests();
		} else {
			setTests([]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [course, refreshTrigger]);

	const loadTests = async () => {
		if (!course) return;

		setLoading(true);
		try {
			const testsData = await apiService.getCourseTests(course.id);
			console.log("Tests received in component:", testsData);

			// Ensure testsData is an array
			setTests(Array.isArray(testsData) ? testsData : []);
		} catch (error) {
			console.error("Failed to load tests:", error);
			// Reset to empty array on error
			setTests([]);
		} finally {
			setLoading(false);
		}
	};

	if (!course) {
		return (
			<Card>
				<CardContent className="p-12 text-center">
					<div className="flex flex-col items-center gap-4">
						<FileText className="w-16 h-16 text-gray-400" />
						<div>
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
								No Course Selected
							</h3>
							<p className="text-gray-500 dark:text-gray-400 mt-1">
								Select a course from the dropdown above to view
								its assessments
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					Assessments for {course.course_code} - {course.name}
				</CardTitle>
				<p className="text-sm text-gray-500 dark:text-gray-400">
					{course.semester} Semester, Year {course.year}
				</p>
			</CardHeader>
			<CardContent>
				{loading ? (
					<div className="text-center py-8 text-gray-500">
						Loading...
					</div>
				) : tests.length === 0 ? (
					<div className="text-center py-12">
						<FileText className="w-12 h-12 mx-auto text-gray-400 mb-3" />
						<p className="text-gray-500 dark:text-gray-400">
							No assessments found for this course
						</p>
						<p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
							Click "Create Assessment" to add one
						</p>
					</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Test Name</TableHead>
								<TableHead className="text-center">
									Full Marks
								</TableHead>
								<TableHead className="text-center">
									Pass Marks
								</TableHead>
								<TableHead className="text-right">
									Actions
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{Array.isArray(tests) &&
								tests.map((test) => (
									<TableRow key={test.id}>
										<TableCell className="font-medium">
											{test.name}
										</TableCell>
										<TableCell className="text-center">
											<Badge variant="outline">
												{test.full_marks}
											</Badge>
										</TableCell>
										<TableCell className="text-center">
											<Badge variant="outline">
												{test.pass_marks}
											</Badge>
										</TableCell>
										<TableCell className="text-right">
											<Button
												variant="ghost"
												size="sm"
												onClick={() => {
													// TODO: Navigate to test details page
													console.log(
														"View test:",
														test.id
													);
												}}
												className="gap-2"
											>
												<Eye className="w-4 h-4" />
												View Details
											</Button>
										</TableCell>
									</TableRow>
								))}
						</TableBody>
					</Table>
				)}
			</CardContent>
		</Card>
	);
}
