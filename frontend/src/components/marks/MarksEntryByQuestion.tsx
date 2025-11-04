import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { apiService } from "@/services/api";
import type {
	Course,
	Test,
	QuestionResponse,
	Enrollment,
	BulkMarksEntry,
} from "@/services/api";

interface MarksEntryByQuestionProps {
	test: Test;
	course: Course | null;
	onBack: () => void;
}

export function MarksEntryByQuestion({
	test,
	course,
	onBack,
}: MarksEntryByQuestionProps) {
	const [questions, setQuestions] = useState<QuestionResponse[]>([]);
	const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
	const [marks, setMarks] = useState<Record<string, Record<string, string>>>(
		{}
	);
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (test && course) {
			loadEnrollmentsAndQuestions();
		}
	}, [test, course]);

	const loadEnrollmentsAndQuestions = async () => {
		if (!course || !test) return;

		setLoading(true);
		try {
			const enrollmentData = await apiService.getCourseEnrollments(
				course.id,
				test.id
			);

			setEnrollments(enrollmentData.enrollments || []);
			setQuestions(enrollmentData.test_info?.questions || []);

			const initialMarks: Record<string, Record<string, string>> = {};
			enrollmentData.enrollments?.forEach((enrollment) => {
				initialMarks[enrollment.student_rollno] = {};
				enrollmentData.test_info?.questions?.forEach((q) => {
					initialMarks[enrollment.student_rollno][
						q.question_identifier
					] = "";
				});
			});
			setMarks(initialMarks);
		} catch (error) {
			console.error("Failed to load data:", error);
			toast.error("Failed to load students and questions");
		} finally {
			setLoading(false);
		}
	};

	const handleMarkChange = (
		studentRollno: string,
		questionId: string,
		value: string
	) => {
		setMarks((prev) => ({
			...prev,
			[studentRollno]: {
				...prev[studentRollno],
				[questionId]: value,
			},
		}));
	};

	const handleSubmit = async () => {
		if (!test) {
			toast.error("Test not found");
			return;
		}

		const bulkEntries: BulkMarksEntry[] = [];

		for (const [studentRollno, studentMarks] of Object.entries(marks)) {
			for (const [questionIdentifier, markValue] of Object.entries(
				studentMarks
			)) {
				if (markValue.trim() !== "") {
					const mark = parseFloat(markValue);
					if (isNaN(mark) || mark < 0) {
						toast.error(
							`Invalid mark for ${studentRollno} - Question ${questionIdentifier}`
						);
						return;
					}

					const match = questionIdentifier.match(/^(\d+)([a-h]?)$/);
					if (!match) {
						toast.error(
							`Invalid question identifier: ${questionIdentifier}`
						);
						return;
					}

					const questionNumber = parseInt(match[1]);
					const subQuestion = match[2] || null;

					bulkEntries.push({
						student_rollno: studentRollno,
						question_number: questionNumber,
						sub_question: subQuestion,
						marks_obtained: mark,
					});
				}
			}
		}

		if (bulkEntries.length === 0) {
			toast.error("Please enter at least one mark");
			return;
		}

		setSubmitting(true);
		try {
			const result = await apiService.saveBulkMarks({
				test_id: test.id,
				marks_entries: bulkEntries,
			});

			if (result.data.failure_count > 0) {
				toast.warning(
					`Marks saved with ${result.data.failure_count} failures. ${result.data.success_count} successful.`
				);
				console.error("Failed entries:", result.data.failed);
			} else {
				toast.success(
					`All marks saved successfully! (${result.data.success_count} entries)`
				);
			}

			const resetMarks: Record<string, Record<string, string>> = {};
			enrollments.forEach((enrollment) => {
				resetMarks[enrollment.student_rollno] = {};
				questions.forEach((q) => {
					resetMarks[enrollment.student_rollno][
						q.question_identifier
					] = "";
				});
			});
			setMarks(resetMarks);
		} catch (error) {
			console.error("Failed to save marks:", error);
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error("Failed to save marks");
			}
		} finally {
			setSubmitting(false);
		}
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
						Bulk Marks Entry (By Question)
					</h2>
					{course && (
						<p className="text-sm text-gray-500 dark:text-gray-400">
							{course.course_code} - {course.name}
						</p>
					)}
				</div>
			</div>

			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>{test.name}</CardTitle>
							<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
								Full Marks: {test.full_marks} | Pass Marks:{" "}
								{test.pass_marks}
							</p>
						</div>
						<Button
							onClick={handleSubmit}
							disabled={submitting || enrollments.length === 0}
							className="gap-2"
						>
							<Save className="w-4 h-4" />
							{submitting ? "Saving..." : "Save All Marks"}
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					{loading ? (
						<div className="text-center py-8 text-gray-500">
							Loading students and questions...
						</div>
					) : enrollments.length === 0 ? (
						<div className="text-center py-8 text-gray-500">
							No students enrolled in this course
						</div>
					) : questions.length === 0 ? (
						<div className="text-center py-8 text-gray-500">
							No questions found for this test
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full border-collapse">
								<thead>
									<tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
										<th className="sticky left-0 z-10 px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
											Roll No
										</th>
										<th className="sticky left-[100px] z-10 px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
											Name
										</th>
										{questions.map((q) => (
											<th
												key={q.id}
												className="px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700"
											>
												<div className="flex flex-col items-center gap-1">
													<span>
														Q{q.question_identifier}
													</span>
													<div className="flex gap-1">
														<Badge
															variant="outline"
															className="text-xs"
														>
															CO{q.co}
														</Badge>
														<Badge
															variant="secondary"
															className="text-xs"
														>
															{q.max_marks}
														</Badge>
														{q.is_optional && (
															<Badge
																variant="outline"
																className="text-xs text-orange-600"
															>
																Opt
															</Badge>
														)}
													</div>
												</div>
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{enrollments.map((enrollment) => (
										<tr
											key={enrollment.student_rollno}
											className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
										>
											<td className="sticky left-0 z-10 px-4 py-3 text-sm font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
												{enrollment.student_rollno}
											</td>
											<td className="sticky left-[100px] z-10 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
												{enrollment.student_name}
											</td>
											{questions.map((q) => (
												<td
													key={q.id}
													className="px-2 py-2 border-r border-gray-200 dark:border-gray-700"
												>
													<Input
														type="number"
														step="0.5"
														min="0"
														max={q.max_marks}
														value={
															marks[
																enrollment
																	.student_rollno
															]?.[
																q
																	.question_identifier
															] || ""
														}
														onChange={(e) =>
															handleMarkChange(
																enrollment.student_rollno,
																q.question_identifier,
																e.target.value
															)
														}
														placeholder="0"
														className="w-20 text-center"
													/>
												</td>
											))}
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
