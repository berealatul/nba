import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const CO_OPTIONS = ["CO1", "CO2", "CO3", "CO4", "CO5", "CO6"];
const QUESTIONS = Array.from({ length: 20 }, (_, i) => i + 1);
const SUB_QUESTIONS = ["a", "b", "c", "d", "e", "f", "g", "h"];

type COMapping = {
	[key: string]: string;
};

interface COMappingTableProps {
	coMapping: COMapping;
	onCOChange: (
		questionNum: number,
		subQuestion: string,
		co: string | null
	) => void;
}

export function COMappingTable({ coMapping, onCOChange }: COMappingTableProps) {
	const getCOValue = (questionNum: number, subQuestion: string): string => {
		const key = `q${questionNum}_${subQuestion}`;
		return coMapping[key] || "Select CO";
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-gray-900 dark:text-white">
					Question CO Mapping Table
				</CardTitle>
				<CardDescription className="text-gray-600 dark:text-gray-400">
					Select Course Outcome (CO1-CO6) for each sub-question
				</CardDescription>
			</CardHeader>
			<CardContent className="p-0">
				<div className="overflow-x-auto max-w-full">
					<Table className="w-max min-w-full">
						<TableHeader>
							<TableRow>
								<TableHead className="text-gray-700 dark:text-gray-300 font-bold w-20 sticky left-0 bg-white dark:bg-gray-900 z-10">
									Question
								</TableHead>
								{SUB_QUESTIONS.map((sq) => (
									<TableHead
										key={sq}
										className="text-center text-gray-700 dark:text-gray-300 font-bold w-24"
									>
										{sq.toUpperCase()}
									</TableHead>
								))}
							</TableRow>
						</TableHeader>
						<TableBody>
							{QUESTIONS.map((qNum) => (
								<TableRow key={qNum}>
									<TableCell className="font-bold text-gray-900 dark:text-white sticky left-0 bg-white dark:bg-gray-900 z-10">
										Q{qNum}
									</TableCell>
									{SUB_QUESTIONS.map((sq) => (
										<TableCell
											key={`${qNum}_${sq}`}
											className="text-center"
										>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant="outline"
														className="w-20 justify-between text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 text-xs"
													>
														<span className="text-xs truncate">
															{getCOValue(
																qNum,
																sq
															)}
														</span>
														<ChevronDown className="h-3 w-3 opacity-50 ml-1" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent className="w-28">
													<DropdownMenuItem
														onClick={() =>
															onCOChange(
																qNum,
																sq,
																null
															)
														}
														className="cursor-pointer text-gray-500 dark:text-gray-400 italic"
													>
														Select CO
													</DropdownMenuItem>
													{CO_OPTIONS.map((co) => (
														<DropdownMenuItem
															key={co}
															onClick={() =>
																onCOChange(
																	qNum,
																	sq,
																	co
																)
															}
															className="cursor-pointer text-gray-900 dark:text-white"
														>
															{co}
														</DropdownMenuItem>
													))}
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									))}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
}
