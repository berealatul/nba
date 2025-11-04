import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Test } from "@/services/api";

interface TestsListTableProps {
	tests: Test[];
	onTestSelect: (test: Test) => void;
}

export function TestsListTable({ tests, onTestSelect }: TestsListTableProps) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Test Name</TableHead>
					<TableHead className="text-center">Full Marks</TableHead>
					<TableHead className="text-center">Pass Marks</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{tests.map((test) => (
					<TableRow
						key={test.id}
						className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
						onClick={() => onTestSelect(test)}
					>
						<TableCell className="font-medium">
							{test.name}
						</TableCell>
						<TableCell className="text-center">
							<Badge variant="outline">{test.full_marks}</Badge>
						</TableCell>
						<TableCell className="text-center">
							<Badge variant="outline">{test.pass_marks}</Badge>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
