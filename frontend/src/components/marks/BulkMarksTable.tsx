import { useState } from "react";
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
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
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
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

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

	// Calculate pagination
	const totalPages = Math.ceil(enrollments.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentEnrollments = enrollments.slice(startIndex, endIndex);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	return (
		<div className="space-y-4">
			<div className="overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="text-left">Roll No</TableHead>
							<TableHead className="text-left">Name</TableHead>
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
						{currentEnrollments.map((enrollment) => (
							<TableRow key={enrollment.student_rollno}>
								<TableCell className="text-left font-medium">
									{enrollment.student_rollno}
								</TableCell>
								<TableCell className="text-left">
									{enrollment.student_name}
								</TableCell>
								{questions.map((q) => (
									<TableCell
										key={q.id}
										className="text-center"
									>
										<Input
											type="number"
											step="0.5"
											min="0"
											max={q.max_marks}
											value={
												marks[
													enrollment.student_rollno
												]?.[q.question_identifier] || ""
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

			{totalPages > 1 && (
				<div className="flex justify-center">
					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious
									onClick={() =>
										handlePageChange(
											Math.max(1, currentPage - 1)
										)
									}
									className={
										currentPage === 1
											? "pointer-events-none opacity-50"
											: "cursor-pointer"
									}
								/>
							</PaginationItem>
							{Array.from({ length: totalPages }, (_, i) => i + 1)
								.filter((page) => {
									// Show first page, last page, current page, and pages around current
									return (
										page === 1 ||
										page === totalPages ||
										Math.abs(page - currentPage) <= 1
									);
								})
								.map((page, index, array) => {
									// Add ellipsis
									const prevPage = array[index - 1];
									const showEllipsis =
										prevPage && page - prevPage > 1;

									return (
										<>
											{showEllipsis && (
												<PaginationItem
													key={`ellipsis-${page}`}
												>
													<span className="px-4">
														...
													</span>
												</PaginationItem>
											)}
											<PaginationItem key={page}>
												<PaginationLink
													onClick={() =>
														handlePageChange(page)
													}
													isActive={
														currentPage === page
													}
													className="cursor-pointer"
												>
													{page}
												</PaginationLink>
											</PaginationItem>
										</>
									);
								})}
							<PaginationItem>
								<PaginationNext
									onClick={() =>
										handlePageChange(
											Math.min(
												totalPages,
												currentPage + 1
											)
										)
									}
									className={
										currentPage === totalPages
											? "pointer-events-none opacity-50"
											: "cursor-pointer"
									}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			)}
		</div>
	);
}
