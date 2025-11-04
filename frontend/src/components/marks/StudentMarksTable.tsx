import { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { FileText } from "lucide-react";
import type { MarksRecord } from "@/services/api";

interface StudentMarksTableProps {
	marks: Array<MarksRecord & { student_name: string }>;
	passMarks: number;
	loading: boolean;
}

export function StudentMarksTable({
	marks,
	passMarks,
	loading,
}: StudentMarksTableProps) {
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	const calculateTotal = (mark: MarksRecord) => {
		return (
			Number(mark.CO1) +
			Number(mark.CO2) +
			Number(mark.CO3) +
			Number(mark.CO4) +
			Number(mark.CO5) +
			Number(mark.CO6)
		);
	};

	if (loading) {
		return (
			<div className="text-center py-8 text-gray-500">
				Loading marks...
			</div>
		);
	}

	if (marks.length === 0) {
		return (
			<div className="text-center py-12">
				<FileText className="w-12 h-12 mx-auto text-gray-400 mb-3" />
				<p className="text-gray-500 dark:text-gray-400">
					No marks entered yet for this assessment
				</p>
			</div>
		);
	}

	// Calculate pagination
	const totalPages = Math.ceil(marks.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentMarks = marks.slice(startIndex, endIndex);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	return (
		<div className="space-y-4">
			<div className="overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Student ID</TableHead>
							<TableHead>Student Name</TableHead>
							<TableHead className="text-center">CO1</TableHead>
							<TableHead className="text-center">CO2</TableHead>
							<TableHead className="text-center">CO3</TableHead>
							<TableHead className="text-center">CO4</TableHead>
							<TableHead className="text-center">CO5</TableHead>
							<TableHead className="text-center">CO6</TableHead>
							<TableHead className="text-center">Total</TableHead>
							<TableHead className="text-center">
								Status
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{currentMarks.map((mark) => {
							const total = calculateTotal(mark);
							const passed = total >= passMarks;
							return (
								<TableRow key={mark.id}>
									<TableCell className="text-left font-medium">
										{mark.student_id}
									</TableCell>
									<TableCell className="text-left">
										{mark.student_name}
									</TableCell>
									<TableCell className="text-center">
										{mark.CO1}
									</TableCell>
									<TableCell className="text-center">
										{mark.CO2}
									</TableCell>
									<TableCell className="text-center">
										{mark.CO3}
									</TableCell>
									<TableCell className="text-center">
										{mark.CO4}
									</TableCell>
									<TableCell className="text-center">
										{mark.CO5}
									</TableCell>
									<TableCell className="text-center">
										{mark.CO6}
									</TableCell>
									<TableCell className="text-center font-semibold">
										{total}
									</TableCell>
									<TableCell className="text-center">
										<Badge
											variant={
												passed
													? "default"
													: "destructive"
											}
										>
											{passed ? "Pass" : "Fail"}
										</Badge>
									</TableCell>
								</TableRow>
							);
						})}
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
