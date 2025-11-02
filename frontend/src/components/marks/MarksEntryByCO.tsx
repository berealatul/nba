import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { apiService } from "@/services/api";
import type { Course, Test } from "@/services/api";

interface MarksEntryByCOProps {
	test: Test;
	course: Course | null;
	onBack: () => void;
}

export function MarksEntryByCO({ test, course, onBack }: MarksEntryByCOProps) {
	const [studentId, setStudentId] = useState("");
	const [coMarks, setCoMarks] = useState({
		CO1: "",
		CO2: "",
		CO3: "",
		CO4: "",
		CO5: "",
		CO6: "",
	});
	const [submitting, setSubmitting] = useState(false);

	const handleCoMarkChange = (co: string, value: string) => {
		setCoMarks((prev) => ({
			...prev,
			[co]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!studentId.trim()) {
			toast.error("Please enter student ID");
			return;
		}

		// Convert marks to numbers
		const marksData: any = {
			test_id: test.id,
			student_id: studentId,
		};

		let hasMarks = false;
		for (const [co, value] of Object.entries(coMarks)) {
			if (value.trim() !== "") {
				const mark = parseFloat(value);
				if (isNaN(mark) || mark < 0) {
					toast.error(`Invalid mark for ${co}`);
					return;
				}
				marksData[co] = mark;
				hasMarks = true;
			} else {
				marksData[co] = 0;
			}
		}

		if (!hasMarks) {
			toast.error("Please enter at least one CO mark");
			return;
		}

		setSubmitting(true);
		try {
			await apiService.saveMarksByCO(marksData);
			toast.success(`Marks saved successfully for ${studentId}`);

			// Reset form
			setStudentId("");
			setCoMarks({
				CO1: "",
				CO2: "",
				CO3: "",
				CO4: "",
				CO5: "",
				CO6: "",
			});
		} catch (error) {
			console.error("Failed to save marks:", error);
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error("Failed to save marks");
			}
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-4">
				<Button variant="ghost" onClick={onBack} className="gap-2">
					<ArrowLeft className="w-4 h-4" />
					Back
				</Button>
				<div>
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
						{test.name}
					</h2>
					{course && (
						<p className="text-sm text-gray-500 dark:text-gray-400">
							{course.course_code} - {course.name}
						</p>
					)}
				</div>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle>Student Information</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<Label htmlFor="studentId">
								Student ID / Roll Number *
							</Label>
							<Input
								id="studentId"
								value={studentId}
								onChange={(e) => setStudentId(e.target.value)}
								placeholder="e.g., CS101"
								required
							/>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>CO-wise Marks Entry</CardTitle>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Enter aggregated marks for each Course Outcome
							(leave empty for 0)
						</p>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{Object.keys(coMarks).map((co) => (
								<div key={co} className="space-y-2">
									<Label htmlFor={co}>{co}</Label>
									<Input
										id={co}
										type="number"
										step="0.5"
										min="0"
										value={
											coMarks[co as keyof typeof coMarks]
										}
										onChange={(e) =>
											handleCoMarkChange(
												co,
												e.target.value
											)
										}
										placeholder="0"
									/>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				<div className="flex justify-end gap-3">
					<Button type="button" variant="outline" onClick={onBack}>
						Cancel
					</Button>
					<Button type="submit" disabled={submitting}>
						<Save className="w-4 h-4 mr-2" />
						{submitting ? "Saving..." : "Save Marks"}
					</Button>
				</div>
			</form>
		</div>
	);
}
