import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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

	return (
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
						<TableHead className="text-center">Status</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{marks.map((mark) => {
						const total = calculateTotal(mark);
						const passed = total >= passMarks;
						return (
							<TableRow key={mark.id}>
								<TableCell className="font-medium">
									{mark.student_id}
								</TableCell>
								<TableCell>{mark.student_name}</TableCell>
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
											passed ? "default" : "destructive"
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
	);
}
