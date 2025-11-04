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
import { CheckCircle2, XCircle } from "lucide-react";
import type { QuestionResponse } from "@/services/api";

interface QuestionsBreakdownTableProps {
	questions: QuestionResponse[];
}

export function QuestionsBreakdownTable({
	questions,
}: QuestionsBreakdownTableProps) {
	// Group questions by main question number
	const groupedQuestions = questions.reduce((acc, q) => {
		const key = q.question_number;
		if (!acc[key]) {
			acc[key] = [];
		}
		acc[key].push(q);
		return acc;
	}, {} as Record<number, QuestionResponse[]>);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg">Question Breakdown</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Q. No.</TableHead>
							<TableHead>Sub Question</TableHead>
							<TableHead className="text-center">CO</TableHead>
							<TableHead className="text-center">
								Max Marks
							</TableHead>
							<TableHead className="text-center">
								Optional
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{Object.keys(groupedQuestions)
							.sort((a, b) => Number(a) - Number(b))
							.map((qNum) => {
								const questionsGroup =
									groupedQuestions[Number(qNum)];
								return questionsGroup.map((q, idx) => (
									<TableRow key={q.id}>
										<TableCell>
											{idx === 0 ? q.question_number : ""}
										</TableCell>
										<TableCell>
											{q.sub_question || "-"}
										</TableCell>
										<TableCell className="text-center">
											<Badge
												variant="outline"
												className="bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-300"
											>
												CO{q.co}
											</Badge>
										</TableCell>
										<TableCell className="text-center">
											<Badge variant="secondary">
												{q.max_marks}
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
								));
							})}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
