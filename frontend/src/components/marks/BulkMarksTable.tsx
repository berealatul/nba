import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { QuestionResponse, Enrollment } from "@/services/api";

interface BulkMarksTableProps {
	questions: QuestionResponse[];
	enrollments: Enrollment[];
	marks: Record<string, Record<string, string>>;
	onMarkChange: (
		studentRollno: string,
		questionId: string,
		value: string
	) => void;
}

export function BulkMarksTable({
	questions,
	enrollments,
	marks,
	onMarkChange,
}: BulkMarksTableProps) {
	if (enrollments.length === 0) {
		return (
			<div className="text-center py-8 text-gray-500">
				No students enrolled in this course
			</div>
		);
	}

	if (questions.length === 0) {
		return (
			<div className="text-center py-8 text-gray-500">
				No questions found for this test
			</div>
		);
	}

	return (
		<div className="overflow-x-auto">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Roll No</TableHead>
						<TableHead>Name</TableHead>
						{questions.map((q) => (
							<TableHead key={q.id} className="text-center">
								<div className="flex flex-col items-center gap-1">
									<span>Q{q.question_identifier}</span>
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
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{enrollments.map((enrollment) => (
						<TableRow key={enrollment.student_rollno}>
							<TableCell className="font-medium">
								{enrollment.student_rollno}
							</TableCell>
							<TableCell>{enrollment.student_name}</TableCell>
							{questions.map((q) => (
								<TableCell key={q.id} className="text-center">
									<Input
										type="number"
										step="0.5"
										min="0"
										max={q.max_marks}
										value={
											marks[enrollment.student_rollno]?.[
												q.question_identifier
											] || ""
										}
										onChange={(e) =>
											onMarkChange(
												enrollment.student_rollno,
												q.question_identifier,
												e.target.value
											)
										}
										placeholder="0"
										className="w-16 text-center"
									/>
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
