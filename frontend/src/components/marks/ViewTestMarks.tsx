import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiService } from "@/services/api";
import type { Course, Test } from "@/services/api";
import { TestHeader } from "./TestHeader";
import { StudentMarksTable } from "./StudentMarksTable";

interface ViewTestMarksProps {
	test: Test;
	course: Course | null;
	onBack: () => void;
}

export function ViewTestMarks({ test, course, onBack }: ViewTestMarksProps) {
	const [marks, setMarks] = useState<
		Array<{
			student_id: string;
			student_name: string;
			CO1: string | number;
			CO2: string | number;
			CO3: string | number;
			CO4: string | number;
			CO5: string | number;
			CO6: string | number;
		}>
	>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		loadMarks();
	}, [test.id]);

	const loadMarks = async () => {
		setLoading(true);
		try {
			const result = await apiService.getTestMarks(test.id);
			setMarks(result.marks || []);
		} catch (error) {
			console.error("Failed to load marks:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-4">
			<TestHeader test={test} course={course} onBack={onBack} />

			<Card>
				<CardHeader>
					<CardTitle>Student Marks Summary</CardTitle>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						CO-aggregated marks for all students
					</p>
				</CardHeader>
				<CardContent>
					<StudentMarksTable
						marks={marks}
						passMarks={test.pass_marks}
						loading={loading}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
