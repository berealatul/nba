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

	const testTypes = ["Test-1", "Mid-Term", "Test-2", "End-Term"];

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
			<div className="flex items-center gap-4">
				<button
					type="button"
					onClick={onCancel}
					className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
				>
					<svg
						className="w-5 h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M10 19l-7-7m0 0l7-7m-7 7h18"
						/>
					</svg>
					Back to Assessments
				</button>
				<div className="flex-1">
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
						Create New Assessment
					</h2>
				</div>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle>Assessment Details</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Course Info Display */}
						{selectedCourse && (
							<div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
								<p className="text-sm font-medium text-blue-900 dark:text-blue-100">
									Course: {selectedCourse.course_code} -{" "}
									{selectedCourse.name}
								</p>
								<p className="text-xs text-blue-700 dark:text-blue-300">
									{selectedCourse.semester} Semester, Year{" "}
									{selectedCourse.year}
								</p>
							</div>
						)}

						<div className="grid grid-cols-3 gap-4">
							{/* Assessment Name */}
							<div className="space-y-2">
								<Label>Assessment Type *</Label>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											type="button"
											variant="outline"
											className="w-full justify-between"
										>
											<span>
												{name || "Select Test Type"}
											</span>
											<ChevronDown className="w-4 h-4 ml-2" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="w-full">
										{testTypes.map((type) => (
											<DropdownMenuItem
												key={type}
												onClick={() =>
													handleTestTypeChange(type)
												}
											>
												{type}
											</DropdownMenuItem>
										))}
									</DropdownMenuContent>
								</DropdownMenu>
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
									onChange={(e) =>
										setFullMarks(e.target.value)
									}
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
									onChange={(e) =>
										setPassMarks(e.target.value)
									}
									placeholder="e.g., 40"
									required
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
					<CardContent>
						{questions.length === 0 ? (
							<div className="text-center py-8 text-gray-500 dark:text-gray-400">
								No questions added yet. Click "Add Question" to
								start.
							</div>
						) : (
							<div className="overflow-x-auto">
								<table className="w-full border-collapse">
									<thead>
										<tr className="border-b border-gray-200 dark:border-gray-700">
											<th className="text-left p-3 text-sm font-semibold">
												Q.No
											</th>
											<th className="text-left p-3 text-sm font-semibold">
												Sub-Q
											</th>
											<th className="text-left p-3 text-sm font-semibold">
												CO
											</th>
											<th className="text-left p-3 text-sm font-semibold">
												Max Marks
											</th>
											<th className="text-center p-3 text-sm font-semibold">
												Optional
											</th>
											<th className="text-center p-3 text-sm font-semibold">
												Action
											</th>
										</tr>
									</thead>
									<tbody>
										{questions.map((question, index) => (
											<tr
												key={index}
												className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
											>
												{/* Question Number */}
												<td className="p-3">
													<Input
														type="number"
														min="1"
														max="20"
														value={
															question.question_number
														}
														onChange={(e) =>
															updateQuestion(
																index,
																{
																	question_number:
																		parseInt(
																			e
																				.target
																				.value
																		) || 1,
																}
															)
														}
														className="w-20"
														required
													/>
												</td>

												{/* Sub-Question */}
												<td className="p-3">
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
																	value <=
																		"h")
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
														className="w-16"
														placeholder="a-h"
													/>
												</td>

												{/* CO Selection */}
												<td className="p-3">
													<DropdownMenu>
														<DropdownMenuTrigger
															asChild
														>
															<Button
																type="button"
																variant="outline"
																className="w-24 justify-between"
																size="sm"
															>
																CO{question.co}
																<ChevronDown className="w-4 h-4" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent>
															{[
																1, 2, 3, 4, 5,
																6,
															].map((co) => (
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
															))}
														</DropdownMenuContent>
													</DropdownMenu>
												</td>

												{/* Max Marks */}
												<td className="p-3">
													<Input
														type="number"
														step="0.5"
														min="0.5"
														value={
															question.max_marks
														}
														onChange={(e) =>
															updateQuestion(
																index,
																{
																	max_marks:
																		parseFloat(
																			e
																				.target
																				.value
																		) ||
																		0.5,
																}
															)
														}
														className="w-24"
														required
													/>
												</td>

												{/* Optional Checkbox */}
												<td className="p-3">
													<div className="flex items-center justify-center">
														<input
															type="checkbox"
															id={`optional-${index}`}
															checked={
																question.is_optional
															}
															onChange={(e) =>
																updateQuestion(
																	index,
																	{
																		is_optional:
																			e
																				.target
																				.checked,
																	}
																)
															}
															className="w-4 h-4 cursor-pointer"
														/>
													</div>
												</td>

												{/* Delete Button */}
												<td className="p-3">
													<div className="flex justify-center">
														<Button
															type="button"
															variant="ghost"
															size="icon"
															onClick={() =>
																removeQuestion(
																	index
																)
															}
															className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
														>
															<Trash2 className="w-4 h-4" />
														</Button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
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
		</div>
	);
}
