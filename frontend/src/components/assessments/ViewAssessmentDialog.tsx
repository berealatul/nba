import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from "lucide-react";
import { CourseInfoCard } from "./CourseInfoCard";
import { AssessmentInfoCard } from "./AssessmentInfoCard";
import { QuestionsBreakdownTable } from "./QuestionsBreakdownTable";
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

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-4xl max-h-[90vh]">
				<DialogHeader>
					<DialogTitle>Assessment Details</DialogTitle>
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
							<CourseInfoCard course={details.course} />
							<AssessmentInfoCard
								test={details.test}
								questionsCount={details.questions.length}
							/>
							<QuestionsBreakdownTable
								questions={details.questions}
							/>
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
