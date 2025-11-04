import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, FileText, CheckCircle2, XCircle } from "lucide-react";
import { apiService } from "@/services/api";
import type { Test, QuestionResponse, Course } from "@/services/api";

interface ViewAssessmentDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	testId: number | null;
}

interface AssessmentDetails {
	test: Test;
	course: Course;
	questions: QuestionResponse[];
}

export function ViewAssessmentDialog({
	open,
	onOpenChange,
	testId,
}: ViewAssessmentDialogProps) {
	const [loading, setLoading] = useState(false);
	const [details, setDetails] = useState<AssessmentDetails | null>(null);

	useEffect(() => {
		if (open && testId) {
			loadAssessmentDetails();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open, testId]);

	const loadAssessmentDetails = async () => {
		if (!testId) return;

		setLoading(true);
		try {
			const data = await apiService.getAssessment(testId);
			setDetails(data);
		} catch (error) {
			console.error("Failed to load assessment details:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleClose = () => {
		onOpenChange(false);
		setDetails(null);
	};

	// Group questions by main question number
	const groupedQuestions = details?.questions.reduce((acc, q) => {
		const key = q.question_number;
		if (!acc[key]) {
			acc[key] = [];
		}
		acc[key].push(q);
		return acc;
	}, {} as Record<number, QuestionResponse[]>);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-4xl max-h-[90vh]">
				<DialogHeader>
					<DialogTitle className="flex items-center justify-between">
						<span>Assessment Details</span>
						<Button
							variant="ghost"
							size="icon"
							onClick={handleClose}
							className="h-6 w-6"
						>
							<X className="h-4 w-4" />
						</Button>
					</DialogTitle>
					<DialogDescription>
						View complete assessment information and question
						breakdown
					</DialogDescription>
				</DialogHeader>

				<ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
					{loading ? (
						<div className="flex items-center justify-center py-12">
							<div className="text-center">
								<FileText className="w-12 h-12 mx-auto text-gray-400 mb-3 animate-pulse" />
								<p className="text-gray-500">
									Loading assessment details...
								</p>
							</div>
						</div>
					) : details ? (
						<div className="space-y-6">
							{/* Course Information */}
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">
										Course Information
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-2">
									<div className="flex justify-between">
										<span className="text-sm text-gray-500">
											Course Code
										</span>
										<span className="font-medium">
											{details.course.course_code}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm text-gray-500">
											Course Name
										</span>
										<span className="font-medium">
											{details.course.name}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm text-gray-500">
											Semester
										</span>
										<span className="font-medium">
											{details.course.semester}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm text-gray-500">
											Year
										</span>
										<span className="font-medium">
											{details.course.year}
										</span>
									</div>
								</CardContent>
							</Card>

							{/* Test Information */}
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">
										Assessment Information
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-2">
									<div className="flex justify-between">
										<span className="text-sm text-gray-500">
											Test Name
										</span>
										<span className="font-medium">
											{details.test.name}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm text-gray-500">
											Full Marks
										</span>
										<Badge variant="outline">
											{details.test.full_marks}
										</Badge>
									</div>
									<div className="flex justify-between">
										<span className="text-sm text-gray-500">
											Pass Marks
										</span>
										<Badge variant="outline">
											{details.test.pass_marks}
										</Badge>
									</div>
									<div className="flex justify-between">
										<span className="text-sm text-gray-500">
											Total Questions
										</span>
										<Badge variant="secondary">
											{details.questions.length}
										</Badge>
									</div>
								</CardContent>
							</Card>

							{/* Questions Table */}
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">
										Question Breakdown
									</CardTitle>
								</CardHeader>
								<CardContent>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Q. No.</TableHead>
												<TableHead>
													Sub Question
												</TableHead>
												<TableHead className="text-center">
													CO
												</TableHead>
												<TableHead className="text-center">
													Max Marks
												</TableHead>
												<TableHead className="text-center">
													Optional
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{groupedQuestions &&
												Object.keys(groupedQuestions)
													.sort(
														(a, b) =>
															Number(a) -
															Number(b)
													)
													.map((qNum) => {
														const questions =
															groupedQuestions[
																Number(qNum)
															];
														return questions.map(
															(q, idx) => (
																<TableRow
																	key={q.id}
																>
																	<TableCell>
																		{idx ===
																		0
																			? q.question_number
																			: ""}
																	</TableCell>
																	<TableCell>
																		{q.sub_question ||
																			"-"}
																	</TableCell>
																	<TableCell className="text-center">
																		<Badge
																			variant="outline"
																			className="bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-300"
																		>
																			CO
																			{
																				q.co
																			}
																		</Badge>
																	</TableCell>
																	<TableCell className="text-center">
																		<Badge variant="secondary">
																			{
																				q.max_marks
																			}
																		</Badge>
																	</TableCell>
																	<TableCell className="text-center">
																		{q.is_optional ? (
																			<CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" />
																		) : (
																			<XCircle className="w-4 h-4 text-gray-400 mx-auto" />
																		)}
																	</TableCell>
																</TableRow>
															)
														);
													})}
										</TableBody>
									</Table>
								</CardContent>
							</Card>
						</div>
					) : (
						<div className="text-center py-12">
							<FileText className="w-12 h-12 mx-auto text-gray-400 mb-3" />
							<p className="text-gray-500">
								No assessment details available
							</p>
						</div>
					)}
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
}
