import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Save, X } from "lucide-react";
import { toast } from "sonner";
import { AssessmentsHeader as CreateHeader } from "./CreateAssessmentHeader";
import { CourseInfoDisplay } from "./CourseInfoDisplay";
import { AssessmentDetailsForm } from "./AssessmentDetailsForm";
import { QuestionsTable } from "./QuestionsTable";
import { apiService } from "@/services/api";
import type { Course, Question } from "@/services/api";

interface CreateAssessmentFormProps {
	selectedCourse: Course | null;
	onSuccess: (courseId?: number) => void;
	onCancel: () => void;
}

export function CreateAssessmentForm({
	selectedCourse,
	onSuccess,
	onCancel,
}: CreateAssessmentFormProps) {
	const [name, setName] = useState("");
	const [fullMarks, setFullMarks] = useState("");
	const [passMarks, setPassMarks] = useState("");
	const [questions, setQuestions] = useState<Question[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const testMarksDefaults: Record<string, number> = {
		"Test-1": 10,
		"Mid-Term": 30,
		"Test-2": 10,
		"End-Term": 50,
	};

	const handleTestTypeChange = (testType: string) => {
		setName(testType);
		const defaultFullMarks = testMarksDefaults[testType];
		setFullMarks(defaultFullMarks.toString());
		// Calculate 34% of full marks for pass marks
		const defaultPassMarks = Math.round(defaultFullMarks * 0.34 * 2) / 2; // Round to nearest 0.5
		setPassMarks(defaultPassMarks.toString());
	};

	const handleFullMarksChange = (marks: string) => {
		setFullMarks(marks);
		// Auto-calculate pass marks as 34%
		const fullMarksNum = parseFloat(marks);
		if (!isNaN(fullMarksNum)) {
			const calculatedPassMarks = Math.round(fullMarksNum * 0.34 * 2) / 2;
			setPassMarks(calculatedPassMarks.toString());
		}
	};

	const addQuestion = () => {
		const newQuestion: Question = {
			question_number: questions.length + 1,
			sub_question: "",
			is_optional: false,
			co: 1,
			max_marks: 10,
		};
		setQuestions([...questions, newQuestion]);
	};

	const removeQuestion = (index: number) => {
		const newQuestions = questions.filter((_, i) => i !== index);
		// Renumber remaining questions
		const renumbered = newQuestions.map((q, i) => ({
			...q,
			question_number: i + 1,
		}));
		setQuestions(renumbered);
	};

	const updateQuestion = (index: number, updates: Partial<Question>) => {
		const newQuestions = [...questions];
		newQuestions[index] = { ...newQuestions[index], ...updates };
		setQuestions(newQuestions);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validation
		if (!selectedCourse) {
			toast.error("Please select a course from the header");
			return;
		}

		if (!name || !fullMarks || !passMarks) {
			toast.error("Please fill in all required fields");
			return;
		}

		if (questions.length === 0) {
			toast.error("Please add at least one question");
			return;
		}

		// Validate each question
		for (const q of questions) {
			if (q.max_marks < 0.5) {
				toast.error(
					`Question ${q.question_number}${
						q.sub_question || ""
					}: Maximum marks must be at least 0.5`
				);
				return;
			}
			if (q.co < 1 || q.co > 6) {
				toast.error(
					`Question ${q.question_number}${
						q.sub_question || ""
					}: CO must be between 1 and 6`
				);
				return;
			}
		}

		setIsSubmitting(true);

		try {
			const result = await apiService.createAssessment({
				course_id: selectedCourse.id,
				name,
				full_marks: parseFloat(fullMarks),
				pass_marks: parseFloat(passMarks),
				questions,
			});

			toast.success(
				`Assessment created successfully! Test ID: ${result.data.test.id}`
			);
			onSuccess(selectedCourse.id);
		} catch (error) {
			console.error("Failed to create assessment:", error);
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error("Failed to create assessment");
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="space-y-4">
			{/* Header with Back Button */}
			<CreateHeader onBack={onCancel} />

			<form onSubmit={handleSubmit} className="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle>Assessment Details</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Course Info Display */}
						{selectedCourse && (
							<CourseInfoDisplay course={selectedCourse} />
						)}

						<AssessmentDetailsForm
							name={name}
							fullMarks={fullMarks}
							passMarks={passMarks}
							onNameChange={handleTestTypeChange}
							onFullMarksChange={handleFullMarksChange}
							onPassMarksChange={setPassMarks}
						/>
					</CardContent>
				</Card>

				{/* Questions Section */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle>Questions</CardTitle>
						<Button
							type="button"
							onClick={addQuestion}
							size="sm"
							className="gap-2"
						>
							<Plus className="w-4 h-4" />
							Add Question
						</Button>
					</CardHeader>
					<CardContent>
						<QuestionsTable
							questions={questions}
							onUpdateQuestion={updateQuestion}
							onRemoveQuestion={removeQuestion}
						/>
					</CardContent>
				</Card>

				{/* Action Buttons */}
				<div className="flex justify-end gap-3">
					<Button
						type="button"
						variant="outline"
						onClick={onCancel}
						disabled={isSubmitting}
					>
						<X className="w-4 h-4 mr-2" />
						Cancel
					</Button>
					<Button type="submit" disabled={isSubmitting}>
						<Save className="w-4 h-4 mr-2" />
						{isSubmitting ? "Creating..." : "Create Assessment"}
					</Button>
				</div>
			</form>
		</div>
	);
}
