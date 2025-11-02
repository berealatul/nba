import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Trash2, ChevronDown, Save, X } from "lucide-react";
import { toast } from "sonner";
import { apiService } from "@/services/api";
import type { Course, Question } from "@/services/api";

interface CreateAssessmentFormProps {
	courses: Course[];
	onSuccess: (courseId?: number) => void;
	onCancel: () => void;
}

export function CreateAssessmentForm({
	courses,
	onSuccess,
	onCancel,
}: CreateAssessmentFormProps) {
	const [courseId, setCourseId] = useState<string>("");
	const [name, setName] = useState("");
	const [fullMarks, setFullMarks] = useState("");
	const [passMarks, setPassMarks] = useState("");
	const [questionLink, setQuestionLink] = useState("");
	const [questions, setQuestions] = useState<Question[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const selectedCourse = courses.find((c) => c.id.toString() === courseId);

	const addQuestion = () => {
		const newQuestion: Question = {
			question_number: questions.length + 1,
			sub_question: "",
			is_optional: false,
			co: 1,
			max_marks: 10,
			description: "",
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
		if (!courseId || !name || !fullMarks || !passMarks) {
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
				course_id: parseInt(courseId),
				name,
				full_marks: parseFloat(fullMarks),
				pass_marks: parseFloat(passMarks),
				question_link: questionLink || undefined,
				questions,
			});

			toast.success(
				`Assessment created successfully! Test ID: ${result.data.test.id}`
			);
			onSuccess(parseInt(courseId));
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
		<form onSubmit={handleSubmit} className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Assessment Details</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Course Selection */}
					<div className="space-y-2">
						<Label>Course *</Label>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									type="button"
									variant="outline"
									className="w-full justify-between"
								>
									<span className="truncate">
										{selectedCourse
											? `${selectedCourse.course_code} - ${selectedCourse.name}`
											: "Select Course"}
									</span>
									<ChevronDown className="w-4 h-4 ml-2" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-[500px]">
								{courses.map((course) => (
									<DropdownMenuItem
										key={course.id}
										onClick={() =>
											setCourseId(course.id.toString())
										}
									>
										<div className="flex flex-col">
											<span className="font-medium">
												{course.course_code} -{" "}
												{course.name}
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
					</div>

					<div className="grid grid-cols-2 gap-4">
						{/* Test Name */}
						<div className="col-span-2 space-y-2">
							<Label htmlFor="name">Assessment Name *</Label>
							<Input
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="e.g., Mid-Term Examination"
								required
							/>
						</div>

						{/* Full Marks */}
						<div className="space-y-2">
							<Label htmlFor="fullMarks">Full Marks *</Label>
							<Input
								id="fullMarks"
								type="number"
								step="0.5"
								min="0"
								value={fullMarks}
								onChange={(e) => setFullMarks(e.target.value)}
								placeholder="e.g., 100"
								required
							/>
						</div>

						{/* Pass Marks */}
						<div className="space-y-2">
							<Label htmlFor="passMarks">Pass Marks *</Label>
							<Input
								id="passMarks"
								type="number"
								step="0.5"
								min="0"
								value={passMarks}
								onChange={(e) => setPassMarks(e.target.value)}
								placeholder="e.g., 40"
								required
							/>
						</div>

						{/* Question Paper Link */}
						<div className="col-span-2 space-y-2">
							<Label htmlFor="questionLink">
								Question Paper Link
							</Label>
							<Input
								id="questionLink"
								type="url"
								value={questionLink}
								onChange={(e) =>
									setQuestionLink(e.target.value)
								}
								placeholder="https://example.com/question-paper.pdf"
							/>
						</div>
					</div>
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
				<CardContent className="space-y-4">
					{questions.length === 0 ? (
						<div className="text-center py-8 text-gray-500 dark:text-gray-400">
							No questions added yet. Click "Add Question" to
							start.
						</div>
					) : (
						questions.map((question, index) => (
							<Card
								key={index}
								className="border border-gray-200 dark:border-gray-700"
							>
								<CardContent className="p-4">
									<div className="flex items-start gap-4">
										<div className="flex-1 grid grid-cols-2 gap-4">
											{/* Question Number */}
											<div className="space-y-2">
												<Label>Question Number *</Label>
												<Input
													type="number"
													min="1"
													max="20"
													value={
														question.question_number
													}
													onChange={(e) =>
														updateQuestion(index, {
															question_number:
																parseInt(
																	e.target
																		.value
																) || 1,
														})
													}
													required
												/>
											</div>

											{/* Sub-Question */}
											<div className="space-y-2">
												<Label>
													Sub-Question (a-h)
												</Label>
												<Input
													maxLength={1}
													value={
														question.sub_question
													}
													onChange={(e) => {
														const value =
															e.target.value.toLowerCase();
														if (
															value === "" ||
															(value >= "a" &&
																value <= "h")
														) {
															updateQuestion(
																index,
																{
																	sub_question:
																		value,
																}
															);
														}
													}}
													placeholder="Leave empty for main question"
												/>
											</div>

											{/* CO Selection */}
											<div className="space-y-2">
												<Label>
													Course Outcome (CO) *
												</Label>
												<DropdownMenu>
													<DropdownMenuTrigger
														asChild
													>
														<Button
															type="button"
															variant="outline"
															className="w-full justify-between"
														>
															CO{question.co}
															<ChevronDown className="w-4 h-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent>
														{[1, 2, 3, 4, 5, 6].map(
															(co) => (
																<DropdownMenuItem
																	key={co}
																	onClick={() =>
																		updateQuestion(
																			index,
																			{
																				co,
																			}
																		)
																	}
																>
																	CO{co}
																</DropdownMenuItem>
															)
														)}
													</DropdownMenuContent>
												</DropdownMenu>
											</div>

											{/* Max Marks */}
											<div className="space-y-2">
												<Label>Max Marks *</Label>
												<Input
													type="number"
													step="0.5"
													min="0.5"
													value={question.max_marks}
													onChange={(e) =>
														updateQuestion(index, {
															max_marks:
																parseFloat(
																	e.target
																		.value
																) || 0.5,
														})
													}
													required
												/>
											</div>

											{/* Description */}
											<div className="col-span-2 space-y-2">
												<Label>Description</Label>
												<Input
													value={question.description}
													onChange={(e) =>
														updateQuestion(index, {
															description:
																e.target.value,
														})
													}
													placeholder="Brief description of the question"
												/>
											</div>

											{/* Optional Checkbox */}
											<div className="col-span-2 flex items-center gap-2">
												<input
													type="checkbox"
													id={`optional-${index}`}
													checked={
														question.is_optional
													}
													onChange={(e) =>
														updateQuestion(index, {
															is_optional:
																e.target
																	.checked,
														})
													}
													className="w-4 h-4"
												/>
												<Label
													htmlFor={`optional-${index}`}
													className="cursor-pointer font-normal"
												>
													This is an optional question
													(attempt either/or)
												</Label>
											</div>
										</div>

										{/* Delete Button */}
										<Button
											type="button"
											variant="ghost"
											size="icon"
											onClick={() =>
												removeQuestion(index)
											}
											className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
										>
											<Trash2 className="w-4 h-4" />
										</Button>
									</div>
								</CardContent>
							</Card>
						))
					)}
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
	);
}
