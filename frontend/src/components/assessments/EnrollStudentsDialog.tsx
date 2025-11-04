import { useState, useRef } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { CSVFormatInfo } from "./CSVFormatInfo";
import { CSVFileUpload } from "./CSVFileUpload";
import { StudentPreviewTable } from "./StudentPreviewTable";
import { apiService } from "@/services/api";
import type { Course } from "@/services/api";

interface EnrollStudentsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	course: Course | null;
}

interface StudentEntry {
	rollno: string;
	name: string;
}

export function EnrollStudentsDialog({
	open,
	onOpenChange,
	course,
}: EnrollStudentsDialogProps) {
	const [file, setFile] = useState<File | null>(null);
	const [students, setStudents] = useState<StudentEntry[]>([]);
	const [uploading, setUploading] = useState(false);
	const [enrolling, setEnrolling] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];
		if (!selectedFile) return;

		if (!selectedFile.name.endsWith(".csv")) {
			toast.error("Please select a CSV file");
			return;
		}

		setFile(selectedFile);
		parseCSV(selectedFile);
	};

	const parseCSV = (file: File) => {
		setUploading(true);
		const reader = new FileReader();

		reader.onload = (e) => {
			try {
				const text = e.target?.result as string;
				const lines = text.split("\n").filter((line) => line.trim());

				// Skip header row if it exists
				const startIndex = lines[0].toLowerCase().includes("rollno")
					? 1
					: 0;

				const parsedStudents: StudentEntry[] = [];

				for (let i = startIndex; i < lines.length; i++) {
					const line = lines[i].trim();
					if (!line) continue;

					// Split by comma and handle quoted values
					const parts = line
						.split(",")
						.map((part) => part.trim().replace(/^"|"$/g, ""));

					if (parts.length >= 2) {
						const rollno = parts[0];
						const name = parts[1];

						if (rollno && name) {
							parsedStudents.push({ rollno, name });
						}
					}
				}

				if (parsedStudents.length === 0) {
					toast.error("No valid student entries found in CSV");
				} else {
					setStudents(parsedStudents);
					toast.success(
						`Parsed ${parsedStudents.length} students from CSV`
					);
				}
			} catch (error) {
				console.error("CSV parsing error:", error);
				toast.error("Failed to parse CSV file");
			} finally {
				setUploading(false);
			}
		};

		reader.onerror = () => {
			toast.error("Failed to read file");
			setUploading(false);
		};

		reader.readAsText(file);
	};

	const handleEnroll = async () => {
		if (!course) {
			toast.error("No course selected");
			return;
		}

		if (students.length === 0) {
			toast.error("No students to enroll");
			return;
		}

		setEnrolling(true);
		try {
			const response = await fetch(
				`http://localhost/nba/api/courses/${course.id}/enroll`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${apiService.getToken()}`,
					},
					body: JSON.stringify({ students }),
				}
			);

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Failed to enroll students");
			}

			if (data.data.failure_count > 0) {
				toast.warning(
					`Enrollment completed with ${data.data.failure_count} failures. ${data.data.success_count} students enrolled successfully.`
				);
				console.warn("Failed enrollments:", data.data.failed);
			} else {
				toast.success(
					`All ${data.data.success_count} students enrolled successfully!`
				);
			}

			// Reset and close
			setFile(null);
			setStudents([]);
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
			onOpenChange(false);
		} catch (error) {
			console.error("Enrollment error:", error);
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error("Failed to enroll students");
			}
		} finally {
			setEnrolling(false);
		}
	};

	const handleClose = () => {
		setFile(null);
		setStudents([]);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
		onOpenChange(false);
	};

	const downloadTemplate = () => {
		const csvContent =
			"rollno,name\nCS101,John Doe\nCS102,Jane Smith\nCS103,Bob Johnson";
		const blob = new Blob([csvContent], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "student_enrollment_template.csv";
		link.click();
		URL.revokeObjectURL(url);
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Enroll Students</DialogTitle>
					<DialogDescription>
						Upload a CSV file to enroll students in{" "}
						{course?.course_code || "the selected course"}
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					<CSVFormatInfo onDownloadTemplate={downloadTemplate} />
					<CSVFileUpload
						fileInputRef={fileInputRef}
						onFileChange={handleFileChange}
						uploading={uploading}
						enrolling={enrolling}
					/>
					<StudentPreviewTable students={students} />

					{/* Success Message */}
					{file && students.length > 0 && !uploading && (
						<div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
							<CheckCircle2 className="w-4 h-4" />
							<span>
								Ready to enroll {students.length} student
								{students.length > 1 ? "s" : ""}
							</span>
						</div>
					)}
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={handleClose}
						disabled={enrolling}
					>
						Cancel
					</Button>
					<Button
						onClick={handleEnroll}
						disabled={
							students.length === 0 || uploading || enrolling
						}
					>
						{enrolling ? "Enrolling..." : "Enroll Students"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
