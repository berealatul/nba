import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { QuestionTableRow } from "./QuestionTableRow";
import type { Question } from "@/services/api";

interface QuestionsTableProps {
	questions: Question[];
	onUpdateQuestion: (index: number, updates: Partial<Question>) => void;
	onRemoveQuestion: (index: number) => void;
}

export function QuestionsTable({
	questions,
	onUpdateQuestion,
	onRemoveQuestion,
}: QuestionsTableProps) {
	if (questions.length === 0) {
		return (
			<div className="text-center py-8 text-gray-500 dark:text-gray-400">
				No questions added yet. Click "Add Question" to start.
			</div>
		);
	}

	return (
		<div className="overflow-x-auto">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Q.No</TableHead>
						<TableHead className="text-center">Sub-Q</TableHead>
						<TableHead className="text-center">CO</TableHead>
						<TableHead className="text-center">Max Marks</TableHead>
						<TableHead className="text-center">Optional</TableHead>
						<TableHead className="text-center">Action</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{questions.map((question, index) => (
						<QuestionTableRow
							key={index}
							question={question}
							index={index}
							onUpdate={onUpdateQuestion}
							onRemove={onRemoveQuestion}
						/>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
