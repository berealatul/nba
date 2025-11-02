import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { apiService } from "@/services/api";
import type {
	Course,
	Test,
	QuestionResponse,
	QuestionMarks,
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
	const [studentId, setStudentId] = useState("");
	const [marks, setMarks] = useState<Record<string, string>>({});
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		loadQuestions();
	}, [test.id]);

	const loadQuestions = async () => {
		setLoading(true);
		try {
			const assessment = await apiService.getAssessment(test.id);
			setQuestions(assessment.questions || []);

			// Initialize marks object
			const initialMarks: Record<string, string> = {};
			assessment.questions?.forEach((q: QuestionResponse) => {
				initialMarks[q.question_identifier] = "";
			});
			setMarks(initialMarks);
		} catch (error) {
			console.error("Failed to load questions:", error);
			toast.error("Failed to load questions");
		} finally {
			setLoading(false);
		}
	};

	const handleMarkChange = (questionId: string, value: string) => {
		setMarks((prev) => ({
			...prev,
			[questionId]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!studentId.trim()) {
			toast.error("Please enter student ID");
			return;
		}

		// Prepare marks array
		const marksArray: QuestionMarks[] = [];
		for (const [questionId, markValue] of Object.entries(marks)) {
			if (markValue.trim() !== "") {
				const mark = parseFloat(markValue);
				if (isNaN(mark) || mark < 0) {
					toast.error(`Invalid mark for question ${questionId}`);
					return;
				}
				marksArray.push({
					question_identifier: questionId,
					marks: mark,
				});
			}
		}

		if (marksArray.length === 0) {
			toast.error("Please enter at least one mark");
			return;
		}

		setSubmitting(true);
		try {
			const result = await apiService.saveMarksByQuestion({
				test_id: test.id,
				student_id: studentId,
				marks: marksArray,
			});

			toast.success(`Marks saved successfully for ${studentId}`);

			// Show CO totals
			const coTotalsStr = Object.entries(result.co_totals)
				.map(([co, total]) => `${co}: ${total}`)
				.join(", ");
			toast.info(`CO Totals: ${coTotalsStr}`);

			// Reset form
			setStudentId("");
			const resetMarks: Record<string, string> = {};
			questions.forEach((q) => {
				resetMarks[q.question_identifier] = "";
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
				<div>
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
						{test.name}
					</h2>
					{course && (
						<p className="text-sm text-gray-500 dark:text-gray-400">
							{course.course_code} - {course.name}
						</p>
					)}
				</div>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle>Student Information</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<Label htmlFor="studentId">
								Student ID / Roll Number *
							</Label>
							<Input
								id="studentId"
								value={studentId}
								onChange={(e) => setStudentId(e.target.value)}
								placeholder="e.g., CS101"
								required
							/>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Question-wise Marks Entry</CardTitle>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Enter marks for each question (leave empty to skip)
						</p>
					</CardHeader>
					<CardContent>
						{loading ? (
							<div className="text-center py-8 text-gray-500">
								Loading questions...
							</div>
						) : questions.length === 0 ? (
							<div className="text-center py-8 text-gray-500">
								No questions found for this assessment
							</div>
						) : (
							<div className="space-y-4">
								{questions.map((question) => (
									<div
										key={question.id}
										className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
									>
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-1">
												<span className="font-semibold text-gray-900 dark:text-white">
													Question{" "}
													{
														question.question_identifier
													}
												</span>
												<Badge variant="outline">
													CO{question.co}
												</Badge>
												<Badge variant="secondary">
													Max: {question.max_marks}
												</Badge>
												{question.is_optional && (
													<Badge
														variant="outline"
														className="text-orange-600"
													>
														Optional
													</Badge>
												)}
											</div>
											{question.description && (
												<p className="text-sm text-gray-500 dark:text-gray-400">
													{question.description}
												</p>
											)}
										</div>
										<div className="w-32">
											<Input
												type="number"
												step="0.5"
												min="0"
												max={question.max_marks}
												value={
													marks[
														question
															.question_identifier
													] || ""
												}
												onChange={(e) =>
													handleMarkChange(
														question.question_identifier,
														e.target.value
													)
												}
												placeholder="0"
											/>
										</div>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>

				<div className="flex justify-end gap-3">
					<Button type="button" variant="outline" onClick={onBack}>
						Cancel
					</Button>
					<Button type="submit" disabled={submitting || loading}>
						<Save className="w-4 h-4 mr-2" />
						{submitting ? "Saving..." : "Save Marks"}
					</Button>
				</div>
			</form>
		</div>
	);
}
