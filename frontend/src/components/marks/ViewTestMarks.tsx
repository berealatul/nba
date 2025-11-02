import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ArrowLeft, FileText } from "lucide-react";
import { apiService } from "@/services/api";
import type { Course, Test, MarksRecord } from "@/services/api";

interface ViewTestMarksProps {
	test: Test;
	course: Course | null;
	onBack: () => void;
}

export function ViewTestMarks({ test, course, onBack }: ViewTestMarksProps) {
	const [marks, setMarks] = useState<
		Array<MarksRecord & { student_name: string }>
	>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		loadMarks();
	}, [test.id]);

	const loadMarks = async () => {
		setLoading(true);
		try {
			const result = await apiService.getTestMarks(test.id);
			setMarks(result.marks || []);
		} catch (error) {
			console.error("Failed to load marks:", error);
		} finally {
			setLoading(false);
		}
	};

	const calculateTotal = (mark: MarksRecord) => {
		return (
			Number(mark.CO1) +
			Number(mark.CO2) +
			Number(mark.CO3) +
			Number(mark.CO4) +
			Number(mark.CO5) +
			Number(mark.CO6)
		);
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-4">
				<Button variant="ghost" onClick={onBack} className="gap-2">
					<ArrowLeft className="w-4 h-4" />
					Back
				</Button>
				<div className="flex-1">
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
						{test.name} - All Marks
					</h2>
					{course && (
						<p className="text-sm text-gray-500 dark:text-gray-400">
							{course.course_code} - {course.name}
						</p>
					)}
				</div>
				<div className="flex items-center gap-4">
					<div className="text-right">
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Full Marks
						</p>
						<p className="text-lg font-semibold text-gray-900 dark:text-white">
							{test.full_marks}
						</p>
					</div>
					<div className="text-right">
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Pass Marks
						</p>
						<p className="text-lg font-semibold text-gray-900 dark:text-white">
							{test.pass_marks}
						</p>
					</div>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Student Marks Summary</CardTitle>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						CO-aggregated marks for all students
					</p>
				</CardHeader>
				<CardContent>
					{loading ? (
						<div className="text-center py-8 text-gray-500">
							Loading marks...
						</div>
					) : marks.length === 0 ? (
						<div className="text-center py-12">
							<FileText className="w-12 h-12 mx-auto text-gray-400 mb-3" />
							<p className="text-gray-500 dark:text-gray-400">
								No marks entered yet for this assessment
							</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Student ID</TableHead>
										<TableHead>Student Name</TableHead>
										<TableHead className="text-center">
											CO1
										</TableHead>
										<TableHead className="text-center">
											CO2
										</TableHead>
										<TableHead className="text-center">
											CO3
										</TableHead>
										<TableHead className="text-center">
											CO4
										</TableHead>
										<TableHead className="text-center">
											CO5
										</TableHead>
										<TableHead className="text-center">
											CO6
										</TableHead>
										<TableHead className="text-center">
											Total
										</TableHead>
										<TableHead className="text-center">
											Status
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{marks.map((mark) => {
										const total = calculateTotal(mark);
										const passed = total >= test.pass_marks;
										return (
											<TableRow key={mark.id}>
												<TableCell className="font-medium">
													{mark.student_id}
												</TableCell>
												<TableCell>
													{mark.student_name}
												</TableCell>
												<TableCell className="text-center">
													{mark.CO1}
												</TableCell>
												<TableCell className="text-center">
													{mark.CO2}
												</TableCell>
												<TableCell className="text-center">
													{mark.CO3}
												</TableCell>
												<TableCell className="text-center">
													{mark.CO4}
												</TableCell>
												<TableCell className="text-center">
													{mark.CO5}
												</TableCell>
												<TableCell className="text-center">
													{mark.CO6}
												</TableCell>
												<TableCell className="text-center font-semibold">
													{total}
												</TableCell>
												<TableCell className="text-center">
													<Badge
														variant={
															passed
																? "default"
																: "destructive"
														}
													>
														{passed
															? "Pass"
															: "Fail"}
													</Badge>
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
