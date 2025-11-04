import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface AssessmentDetailsFormProps {
	name: string;
	fullMarks: string;
	passMarks: string;
	onNameChange: (name: string) => void;
	onFullMarksChange: (marks: string) => void;
	onPassMarksChange: (marks: string) => void;
}

const testTypes = ["Test-1", "Mid-Term", "Test-2", "End-Term"];

export function AssessmentDetailsForm({
	name,
	fullMarks,
	passMarks,
	onNameChange,
	onFullMarksChange,
	onPassMarksChange,
}: AssessmentDetailsFormProps) {
	return (
		<div className="grid grid-cols-3 gap-4">
			{/* Assessment Name */}
			<div className="space-y-2">
				<Label>Assessment Type *</Label>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							type="button"
							variant="outline"
							className="w-full justify-between"
						>
							<span>{name || "Select Test Type"}</span>
							<ChevronDown className="w-4 h-4 ml-2" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-full">
						{testTypes.map((type) => (
							<DropdownMenuItem
								key={type}
								onClick={() => onNameChange(type)}
							>
								{type}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Full Marks */}
			<div className="space-y-2">
				<Label htmlFor="fullMarks">Full Marks *</Label>
				<Input
					id="fullMarks"
					type="number"
					step="0.5"
					min="0"
					value={fullMarks}
					onChange={(e) => onFullMarksChange(e.target.value)}
					placeholder="e.g., 100"
					required
				/>
			</div>

			{/* Pass Marks */}
			<div className="space-y-2">
				<Label htmlFor="passMarks">Pass Marks *</Label>
				<Input
					id="passMarks"
					type="number"
					step="0.5"
					min="0"
					value={passMarks}
					onChange={(e) => onPassMarksChange(e.target.value)}
					placeholder="e.g., 40"
					required
				/>
			</div>
		</div>
	);
}
