import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { apiService } from "@/services/api";
import { toast } from "sonner";

interface COPOMappingProps {
	courseCode: string;
	courseName: string;
	courseId: number;
	facultyName: string;
	departmentName: string;
	year: number;
	semester: number;
}

// Student marks interface for display
interface StudentMarks {
	rollNo: string;
	name: string;
	absentee: string; // "AB" or "UR" or empty
	tests: { [testName: string]: { [co: string]: number } };
	total: number;
	coTotals: {
		CO1: number;
		CO2: number;
		CO3: number;
		CO4: number;
		CO5: number;
		CO6: number;
		ΣCO: number;
	};
}

export function COPOMapping({
	courseCode,
	courseName,
	courseId,
	facultyName,
	departmentName,
	year,
	semester,
}: COPOMappingProps) {
	const [loading, setLoading] = useState(true);
	const [studentsData, setStudentsData] = useState<StudentMarks[]>([]);
	const [maxMarks, setMaxMarks] = useState<{
		[testName: string]: { total: number; [co: string]: number };
	}>({});

	useEffect(() => {
		loadCOPOData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [courseId]);

	const loadCOPOData = async () => {
		try {
			setLoading(true);

			// Fetch all tests for the course
			const testsData = await apiService.getCourseTests(courseId);
			console.log("Fetched tests:", testsData);

			if (testsData.length === 0) {
				setStudentsData([]);
				setLoading(false);
				return;
			}

			// Fetch marks for all tests
			const allMarksPromises = testsData.map((test) =>
				apiService
					.getTestMarks(test.id)
					.then((data) => {
						console.log(`Marks data for test ${test.name}:`, data);
						return {
							test,
							marksData: data,
						};
					})
					.catch((error) => {
						console.error(
							`Failed to load marks for test ${test.name}:`,
							error
						);
						return { test, marksData: null };
					})
			);

			const allMarksResults = await Promise.all(allMarksPromises);
			console.log("All marks results:", allMarksResults);

			// Process and structure the data
			const studentMap = new Map<string, StudentMarks>();
			const maxMarksMap: {
				[testName: string]: { total: number; [co: string]: number };
			} = {};

			// Initialize max marks from tests
			testsData.forEach((test) => {
				maxMarksMap[test.name] = {
					total: test.full_marks,
					CO1: 0,
					CO2: 0,
					CO3: 0,
					CO4: 0,
					CO5: 0,
					CO6: 0,
				};
			});

			// Process marks data
			allMarksResults.forEach(({ test, marksData }) => {
				if (!marksData || !marksData.marks) {
					console.log(`No marks data for test ${test.name}`);
					return;
				}

				console.log(
					`Processing ${marksData.marks.length} students for test ${test.name}`
				);

				marksData.marks.forEach((markRecord) => {
					const studentId = markRecord.student_id;
					const studentName = markRecord.student_name || studentId;

					// Initialize student if not exists
					if (!studentMap.has(studentId)) {
						studentMap.set(studentId, {
							rollNo: studentId,
							name: studentName,
							absentee: "",
							tests: {},
							total: 0,
							coTotals: {
								CO1: 0,
								CO2: 0,
								CO3: 0,
								CO4: 0,
								CO5: 0,
								CO6: 0,
								ΣCO: 0,
							},
						});
					}

					const student = studentMap.get(studentId)!;

					// Add test marks for this student - convert string to number
					student.tests[test.name] = {
						CO1: Number(markRecord.CO1) || 0,
						CO2: Number(markRecord.CO2) || 0,
						CO3: Number(markRecord.CO3) || 0,
						CO4: Number(markRecord.CO4) || 0,
						CO5: Number(markRecord.CO5) || 0,
						CO6: Number(markRecord.CO6) || 0,
					};
				});
			});

			console.log("Student map after processing:", studentMap);
			console.log("Number of students:", studentMap.size);

			// Fetch questions for each test to calculate max marks per CO
			for (const test of testsData) {
				try {
					const assessmentData = await apiService.getAssessment(
						test.id
					);
					const questions = assessmentData.questions;

					// Calculate max marks per CO for this test
					questions.forEach((q) => {
						const coKey = `CO${q.co}`;
						if (maxMarksMap[test.name][coKey] !== undefined) {
							maxMarksMap[test.name][coKey] += q.max_marks;
						}
					});
				} catch (error) {
					console.error(
						`Failed to load questions for test ${test.name}:`,
						error
					);
				}
			}

			// Calculate totals and percentages for each student
			studentMap.forEach((student) => {
				let totalMarks = 0;
				const coTotals = {
					CO1: 0,
					CO2: 0,
					CO3: 0,
					CO4: 0,
					CO5: 0,
					CO6: 0,
				};
				const coMaxTotals = {
					CO1: 0,
					CO2: 0,
					CO3: 0,
					CO4: 0,
					CO5: 0,
					CO6: 0,
				};

				// Sum up marks and max marks across all tests
				Object.keys(student.tests).forEach((testName) => {
					const testMarks = student.tests[testName];
					const testMaxMarks = maxMarksMap[testName];

					Object.keys(testMarks).forEach((co) => {
						const coMarks = testMarks[co];
						const coMax = testMaxMarks[co] || 0;

						coTotals[co as keyof typeof coTotals] += coMarks;
						coMaxTotals[co as keyof typeof coMaxTotals] += coMax;
						totalMarks += coMarks;
					});
				});

				// Calculate percentages
				let totalMaxMarks = 0;
				Object.keys(coTotals).forEach((co) => {
					const coKey = co as keyof typeof coTotals;
					const coMax = coMaxTotals[coKey];
					totalMaxMarks += coMax;

					student.coTotals[coKey] =
						coMax > 0 ? (coTotals[coKey] / coMax) * 100 : 0;
				});

				// Calculate ΣCO (average of all COs)
				const nonZeroCOs = Object.keys(coTotals).filter(
					(co) => coMaxTotals[co as keyof typeof coMaxTotals] > 0
				);
				const sumCO =
					nonZeroCOs.reduce(
						(sum, co) =>
							sum + student.coTotals[co as keyof typeof coTotals],
						0
					) / (nonZeroCOs.length || 1);

				student.coTotals.ΣCO = sumCO;
				student.total =
					totalMaxMarks > 0 ? (totalMarks / totalMaxMarks) * 100 : 0;
			});

			setMaxMarks(maxMarksMap);
			setStudentsData(Array.from(studentMap.values()));
			setLoading(false);
		} catch (error) {
			console.error("Failed to load CO-PO data:", error);
			toast.error("Failed to load CO-PO mapping data");
			setLoading(false);
		}
	};

	// Sample data structure - will be replaced with API data
	const attainmentCriteria = [
		{ range: ">= 70%", level: 3 },
		{ range: "60-70%", level: 2 },
		{ range: "50-60%", level: 1 },
		{ range: "< 50%", level: 0 },
	];

	const passingMarks = {
		threshold: 40,
		percentage: 60,
	};

	// Calculate academic year from year and semester
	const getAcademicYear = (year: number): string => {
		// Convert year (1-4) to academic year display
		const yearMap: { [key: number]: string } = {
			1: "I",
			2: "II",
			3: "III",
			4: "IV",
		};
		return yearMap[year] || "I";
	};

	const getSemesterDisplay = (sem: number): string => {
		// Convert semester (1-8) to display format
		const semMap: { [key: number]: string } = {
			1: "I",
			2: "II",
			3: "III",
			4: "IV",
			5: "V",
			6: "VI",
			7: "VII",
			8: "VIII",
		};
		return semMap[sem] || "I";
	};

	// Get current academic session (e.g., "2024-25")
	const getCurrentSession = (): string => {
		const currentYear = new Date().getFullYear();
		return `${currentYear}-${String(currentYear + 1).slice(-2)}`;
	};

	// Calculate CO Attainment Statistics
	const calculateCOAttainment = () => {
		const totalStudents = studentsData.length;
		const absentees = studentsData.filter(
			(s) => s.absentee === "AB" || s.absentee === "UR"
		).length;
		const presentStudents = totalStudents - absentees;

		const coStats = {
			CO1: { above70: 0, above60: 0, above50: 0, abovePass: 0 },
			CO2: { above70: 0, above60: 0, above50: 0, abovePass: 0 },
			CO3: { above70: 0, above60: 0, above50: 0, abovePass: 0 },
			CO4: { above70: 0, above60: 0, above50: 0, abovePass: 0 },
			CO5: { above70: 0, above60: 0, above50: 0, abovePass: 0 },
			CO6: { above70: 0, above60: 0, above50: 0, abovePass: 0 },
		};

		studentsData.forEach((student) => {
			if (student.absentee === "AB" || student.absentee === "UR") return;

			Object.keys(coStats).forEach((co) => {
				const percentage =
					student.coTotals[co as keyof typeof student.coTotals];
				if (percentage >= 70)
					coStats[co as keyof typeof coStats].above70++;
				if (percentage >= 60)
					coStats[co as keyof typeof coStats].above60++;
				if (percentage >= 50)
					coStats[co as keyof typeof coStats].above50++;
				if (percentage >= passingMarks.threshold)
					coStats[co as keyof typeof coStats].abovePass++;
			});
		});

		return { totalStudents, absentees, presentStudents, coStats };
	};

	const attainmentData =
		studentsData.length > 0 ? calculateCOAttainment() : null;

	const getLevelColor = (level: number): string => {
		switch (level) {
			case 3:
				return "bg-orange-500 text-white";
			case 2:
				return "bg-yellow-400 text-gray-900";
			case 1:
				return "bg-green-400 text-gray-900";
			case 0:
				return "bg-gray-300 text-gray-700";
			default:
				return "bg-gray-100 text-gray-700";
		}
	};

	const getPercentageColor = (percentage: number): string => {
		if (percentage >= 70)
			return "bg-orange-500 dark:bg-orange-600 text-white";
		if (percentage >= 60)
			return "bg-yellow-400 dark:bg-yellow-500 text-gray-900 dark:text-gray-900";
		if (percentage >= 50)
			return "bg-green-400 dark:bg-green-500 text-gray-900 dark:text-white";
		return "bg-white dark:bg-gray-800 text-gray-900 dark:text-white";
	};

	// CO-PO Mapping Matrix - Sample data
	const copoMatrix = [
		{ co: "CO1", po1: 3, po2: 2, po3: 1, po4: 0, po5: 0 },
		{ co: "CO2", po1: 2, po2: 3, po3: 2, po4: 1, po5: 0 },
		{ co: "CO3", po1: 1, po2: 2, po3: 3, po4: 2, po5: 1 },
		{ co: "CO4", po1: 0, po2: 1, po3: 2, po4: 3, po5: 2 },
		{ co: "CO5", po1: 0, po2: 0, po3: 1, po4: 2, po5: 3 },
		{ co: "ΣCO", po1: 0, po2: 0, po3: 0, po4: 0, po5: 0 },
	];

	return (
		<div className="space-y-6 pb-8">
			{/* Header Section */}
			<div className="flex justify-between items-center">
				<div>
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
						CO-PO Mapping
					</h2>
					<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
						Course: {courseCode} - {courseName}
					</p>
				</div>
			</div>

			{/* Attainment Criteria Card */}
			<Card>
				<CardHeader className="bg-gray-50 dark:bg-gray-900">
					<CardTitle className="text-lg">
						Attainment Criteria
					</CardTitle>
				</CardHeader>
				<CardContent className="pt-6">
					<div className="flex gap-4 flex-wrap">
						{attainmentCriteria.map((criteria, idx) => (
							<div
								key={idx}
								className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700"
							>
								<Badge
									className={getLevelColor(criteria.level)}
								>
									{criteria.level}
								</Badge>
								<span className="text-sm text-gray-700 dark:text-gray-300">
									{criteria.range}
								</span>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Passing Marks Card */}
			<Card>
				<CardHeader className="bg-orange-50 dark:bg-orange-950">
					<CardTitle className="text-lg text-orange-900 dark:text-orange-100">
						Passing Marks (%)
					</CardTitle>
				</CardHeader>
				<CardContent className="pt-6">
					<div className="grid grid-cols-2 gap-4">
						<div className="flex items-center justify-between px-4 py-3 rounded-lg bg-white dark:bg-gray-900 border-2 border-green-300 dark:border-green-800">
							<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
								Threshold % for CO attainment
							</span>
							<Badge
								variant="outline"
								className="bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300 border-green-300 text-lg px-3 py-1"
							>
								{passingMarks.threshold}
							</Badge>
						</div>
						<div className="flex items-center justify-between px-4 py-3 rounded-lg bg-yellow-50 dark:bg-yellow-950 border-2 border-yellow-300 dark:border-yellow-800">
							<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
								Threshold % for student pass marks
							</span>
							<Badge
								variant="outline"
								className="bg-white dark:bg-gray-900 border-yellow-400 text-lg px-3 py-1"
							>
								{passingMarks.percentage}
							</Badge>
						</div>
					</div>
					<div className="mt-3 px-4 py-2 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
						<p className="text-xs text-gray-600 dark:text-gray-400">
							<strong>Note:</strong> Please fill "AB" for Absent
							and "UR" for Unregistered candidate(s)
						</p>
					</div>
				</CardContent>
			</Card>

			{/* Student Marks Table */}
			<Card>
				<CardHeader className="bg-orange-100 dark:bg-orange-950 border-b-4 border-orange-500">
					<div className="space-y-2">
						<CardTitle className="text-xl text-center text-gray-900 dark:text-white font-bold">
							TEZPUR UNIVERSITY
						</CardTitle>
						<div className="grid grid-cols-2 gap-2 text-sm">
							<div className="flex gap-2">
								<span className="font-semibold">
									Faculty Name:
								</span>
								<span>{facultyName}</span>
							</div>
							<div className="flex gap-2">
								<span className="font-semibold">BRANCH:</span>
								<span>{departmentName}</span>
							</div>
							<div className="flex gap-2">
								<span className="font-semibold">
									Programme:
								</span>
								<span>B. Tech</span>
							</div>
							<div className="flex gap-2">
								<span className="font-semibold">YEAR:</span>
								<span>{getAcademicYear(year)}</span>
								<span className="font-semibold ml-4">SEM:</span>
								<span>{getSemesterDisplay(semester)}</span>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-2 text-sm">
							<div className="flex gap-2">
								<span className="font-semibold">Course:</span>
								<span>{courseName}</span>
							</div>
							<div className="flex gap-2">
								<span className="font-semibold">
									Course Code:
								</span>
								<span>{courseCode}</span>
								<span className="font-semibold ml-4">
									SESSION:
								</span>
								<span>{getCurrentSession()}</span>
							</div>
						</div>
					</div>
				</CardHeader>
				<CardContent className="p-0">
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								{/* First header row - Assessment names */}
								<TableRow className="bg-yellow-100 dark:bg-yellow-950">
									<TableHead
										rowSpan={3}
										className="text-center border border-gray-300 dark:border-gray-700 font-bold"
									>
										S.No.
									</TableHead>
									<TableHead
										rowSpan={3}
										className="text-center border border-gray-300 dark:border-gray-700 font-bold"
									>
										Roll No.
									</TableHead>
									<TableHead
										rowSpan={3}
										className="text-center border border-gray-300 dark:border-gray-700 font-bold min-w-[200px]"
									>
										Name of Student
									</TableHead>
									<TableHead
										rowSpan={3}
										className="text-center border border-gray-300 dark:border-gray-700 font-bold"
									>
										ABSENTEE
									</TableHead>
									{/* Dynamic test headers */}
									{Object.keys(maxMarks).map(
										(testName, idx) => (
											<TableHead
												key={testName}
												colSpan={6}
												className={`text-center border border-gray-300 dark:border-gray-700 font-bold bg-yellow-200 dark:bg-yellow-900 ${
													idx > 0
														? "border-l-2 border-l-gray-500 dark:border-l-gray-400"
														: ""
												}`}
											>
												Assessment of {testName}
											</TableHead>
										)
									)}
									<TableHead
										rowSpan={3}
										className="text-center border border-gray-300 dark:border-gray-700 font-bold"
									>
										TOTAL
									</TableHead>
									<TableHead
										colSpan={7}
										className="text-center border border-gray-300 dark:border-gray-700 font-bold bg-yellow-200 dark:bg-yellow-900"
									>
										% of CO ATTAINMENT
									</TableHead>
								</TableRow>
								{/* Second header row - Maximum marks */}
								<TableRow className="bg-blue-100 dark:bg-blue-950">
									{Object.entries(maxMarks).map(
										([testName, marks], idx) => (
											<TableHead
												key={`max-${testName}`}
												colSpan={6}
												className={`text-center border border-gray-300 dark:border-gray-700 font-bold ${
													idx > 0
														? "border-l-2 border-l-gray-500 dark:border-l-gray-400"
														: ""
												}`}
											>
												Maximum Marks: {marks.total}
											</TableHead>
										)
									)}
									<TableHead
										colSpan={7}
										className="text-center border border-gray-300 dark:border-gray-700 font-bold"
									>
										%
									</TableHead>
								</TableRow>
								{/* Third header row - CO columns */}
								<TableRow className="bg-gray-100 dark:bg-gray-900">
									{/* Dynamic test CO headers */}
									{Object.keys(maxMarks).map(
										(testName, testIdx) =>
											[
												"CO1",
												"CO2",
												"CO3",
												"CO4",
												"CO5",
												"CO6",
											].map((co, coIdx) => {
												// Add darker left border for first CO of each test
												const borderClass =
													coIdx === 0 && testIdx > 0
														? "border-l-2 border-l-gray-500 dark:border-l-gray-400"
														: "";
												return (
													<TableHead
														key={`${testName}-${co}`}
														className={`text-center border border-gray-300 dark:border-gray-700 font-bold ${borderClass}`}
													>
														{co}
													</TableHead>
												);
											})
									)}
									{/* CO Totals */}
									{[
										"CO1",
										"CO2",
										"CO3",
										"CO4",
										"CO5",
										"CO6",
										"ΣCO",
									].map((co) => (
										<TableHead
											key={`total-${co}`}
											className="text-center border border-gray-300 dark:border-gray-700 font-bold"
										>
											{co}
										</TableHead>
									))}
								</TableRow>
								{/* Fourth header row - Max marks per CO */}
								<TableRow className="bg-gray-50 dark:bg-gray-800">
									<TableHead className="text-center border border-gray-300 dark:border-gray-700"></TableHead>
									<TableHead className="text-center border border-gray-300 dark:border-gray-700"></TableHead>
									<TableHead className="text-center border border-gray-300 dark:border-gray-700 text-xs">
										CO WISE MAXIMUM MARKS
									</TableHead>
									<TableHead className="text-center border border-gray-300 dark:border-gray-700 text-xs">
										"AB" or "UR"
									</TableHead>
									{/* Dynamic max marks per CO for each test */}
									{Object.entries(maxMarks).map(
										([testName, marks], testIdx) =>
											[
												"CO1",
												"CO2",
												"CO3",
												"CO4",
												"CO5",
												"CO6",
											].map((co, coIdx) => {
												// Add darker left border for first CO of each test
												const borderClass =
													coIdx === 0 && testIdx > 0
														? "border-l-2 border-l-gray-500 dark:border-l-gray-400"
														: "";
												return (
													<TableHead
														key={`${testName}-max-${co}`}
														className={`text-center border border-gray-300 dark:border-gray-700 font-bold ${borderClass}`}
													>
														{marks[co] || 0}
													</TableHead>
												);
											})
									)}
									<TableHead className="text-center border border-gray-300 dark:border-gray-700 font-bold">
										%
									</TableHead>
									{/* Max percentages */}
									{[
										"100",
										"100",
										"100",
										"100",
										"100",
										"100",
										"100",
									].map((val, idx) => (
										<TableHead
											key={`max-${idx}`}
											className="text-center border border-gray-300 dark:border-gray-700 font-bold"
										>
											{val}
										</TableHead>
									))}
								</TableRow>
							</TableHeader>
							<TableBody>
								{loading ? (
									<TableRow>
										<TableCell
											colSpan={100}
											className="text-center py-8"
										>
											<div className="flex items-center justify-center">
												<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
												<span className="ml-3">
													Loading CO-PO mapping
													data...
												</span>
											</div>
										</TableCell>
									</TableRow>
								) : studentsData.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={100}
											className="text-center py-8 text-gray-500"
										>
											No student data available for this
											course.
										</TableCell>
									</TableRow>
								) : (
									studentsData.map((student, idx) => (
										<TableRow key={student.rollNo}>
											<TableCell className="text-center border border-gray-300 dark:border-gray-700">
												{idx + 1}
											</TableCell>
											<TableCell className="text-center border border-gray-300 dark:border-gray-700 font-medium">
												{student.rollNo}
											</TableCell>
											<TableCell className="border border-gray-300 dark:border-gray-700 px-2">
												{student.name}
											</TableCell>
											<TableCell className="text-center border border-gray-300 dark:border-gray-700">
												{student.absentee}
											</TableCell>
											{/* Dynamic test marks */}
											{Object.keys(maxMarks).map(
												(testName, testIdx) => {
													const testMarks =
														student.tests[
															testName
														] || {};
													return [
														"CO1",
														"CO2",
														"CO3",
														"CO4",
														"CO5",
														"CO6",
													].map((co, coIdx) => {
														const marks =
															testMarks[co];
														const displayMarks =
															typeof marks ===
															"number"
																? marks.toFixed(
																		2
																  )
																: "0.00";
														// Add darker left border for first CO of each test (except first test)
														const borderClass =
															coIdx === 0 &&
															testIdx > 0
																? "border-l-2 border-l-gray-500 dark:border-l-gray-400"
																: "";
														return (
															<TableCell
																key={`${testName}-${co}`}
																className={`text-center border border-gray-300 dark:border-gray-700 ${borderClass}`}
															>
																{displayMarks}
															</TableCell>
														);
													});
												}
											)}
											{/* Total */}
											<TableCell className="text-center border border-gray-300 dark:border-gray-700 font-bold bg-yellow-100 dark:bg-yellow-950">
												{student.total.toFixed(2)}
											</TableCell>
											{/* CO Totals */}
											{[
												"CO1",
												"CO2",
												"CO3",
												"CO4",
												"CO5",
												"CO6",
												"ΣCO",
											].map((co) => {
												const percentage =
													student.coTotals[
														co as keyof typeof student.coTotals
													];
												return (
													<TableCell
														key={`co-${co}`}
														className={`text-center border border-gray-300 dark:border-gray-700 font-bold ${getPercentageColor(
															percentage
														)}`}
													>
														{percentage.toFixed(2)}
													</TableCell>
												);
											})}
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>

			{/* CO Attainment Tables */}
			{attainmentData && (
				<>
					{/* CO ATTAINMENT in 3.0 POINT Scale */}
					<Card>
						<CardHeader className="bg-pink-100 dark:bg-pink-950">
							<CardTitle className="text-xl text-center font-bold">
								CO ATTAINMENT in 3.0 POINT Scale
							</CardTitle>
						</CardHeader>
						<CardContent className="p-0">
							<div className="overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow className="bg-blue-100 dark:bg-blue-950">
											<TableHead
												className="border border-gray-300 dark:border-gray-700 font-bold text-center align-middle bg-yellow-200 dark:bg-yellow-900"
												rowSpan={2}
											>
												ATTAINMENT TABLE
											</TableHead>
											<TableHead
												className="border border-gray-300 dark:border-gray-700 font-bold text-center"
												colSpan={6}
											>
												CO1 to CO6
											</TableHead>
										</TableRow>
										<TableRow className="bg-gray-100 dark:bg-gray-900">
											{[
												"CO1",
												"CO2",
												"CO3",
												"CO4",
												"CO5",
												"CO6",
											].map((co) => (
												<TableHead
													key={co}
													className="border border-gray-300 dark:border-gray-700 font-bold text-center"
												>
													{co}
												</TableHead>
											))}
										</TableRow>
									</TableHeader>
									<TableBody>
										<TableRow>
											<TableCell className="border border-gray-300 dark:border-gray-700 font-medium">
												ABSENTEE+NOT ATTEMPT
											</TableCell>
											{[
												"CO1",
												"CO2",
												"CO3",
												"CO4",
												"CO5",
												"CO6",
											].map((co) => (
												<TableCell
													key={co}
													className="border border-gray-300 dark:border-gray-700 text-center"
												>
													{attainmentData.absentees}
												</TableCell>
											))}
										</TableRow>
										<TableRow>
											<TableCell className="border border-gray-300 dark:border-gray-700 font-medium">
												PRESENT STUDENT OR ATTEMPT
											</TableCell>
											{[
												"CO1",
												"CO2",
												"CO3",
												"CO4",
												"CO5",
												"CO6",
											].map((co) => (
												<TableCell
													key={co}
													className="border border-gray-300 dark:border-gray-700 text-center"
												>
													{
														attainmentData.presentStudents
													}
												</TableCell>
											))}
										</TableRow>
										<TableRow>
											<TableCell className="border border-gray-300 dark:border-gray-700 font-medium">
												NO. OF STUDENTS SECURE MARKS
												&gt; THRESHOLD % FOR CO
												ATTAINMENT
											</TableCell>
											{[
												"CO1",
												"CO2",
												"CO3",
												"CO4",
												"CO5",
												"CO6",
											].map((co) => (
												<TableCell
													key={co}
													className="border border-gray-300 dark:border-gray-700 text-center bg-gray-900 dark:bg-gray-950 text-white"
												>
													{
														attainmentData.coStats[
															co as keyof typeof attainmentData.coStats
														].above70
													}
												</TableCell>
											))}
										</TableRow>
										<TableRow>
											<TableCell className="border border-gray-300 dark:border-gray-700 font-medium">
												PC. OF STUDENTS SECURE MARKS
												&gt; THRESHOLD % FOR CO
												ATTAINMENT
											</TableCell>
											{[
												"CO1",
												"CO2",
												"CO3",
												"CO4",
												"CO5",
												"CO6",
											].map((co) => {
												const percentage =
													attainmentData.presentStudents >
													0
														? (attainmentData
																.coStats[
																co as keyof typeof attainmentData.coStats
														  ].above70 /
																attainmentData.presentStudents) *
														  100
														: 0;
												return (
													<TableCell
														key={co}
														className="border border-gray-300 dark:border-gray-700 text-center"
													>
														{percentage.toFixed(2)}
													</TableCell>
												);
											})}
										</TableRow>
										<TableRow>
											<TableCell className="border border-gray-300 dark:border-gray-700 font-medium">
												CO Attainment (3 ≥ 70%, 2 ≥60%,
												1 ≥ 50%)
											</TableCell>
											{[
												"CO1",
												"CO2",
												"CO3",
												"CO4",
												"CO5",
												"CO6",
											].map((co) => {
												const percentage =
													attainmentData.presentStudents >
													0
														? (attainmentData
																.coStats[
																co as keyof typeof attainmentData.coStats
														  ].above70 /
																attainmentData.presentStudents) *
														  100
														: 0;
												const level =
													percentage >= 70
														? 3
														: percentage >= 60
														? 2
														: percentage >= 50
														? 1
														: 0;
												return (
													<TableCell
														key={co}
														className={`border border-gray-300 dark:border-gray-700 text-center font-bold ${getPercentageColor(
															percentage
														)}`}
													>
														{level.toFixed(2)}
													</TableCell>
												);
											})}
										</TableRow>
										<TableRow className="bg-orange-100 dark:bg-orange-950">
											<TableCell className="border border-gray-300 dark:border-gray-700 font-bold">
												Final attainment level CO (by
												Direct Assessment):
											</TableCell>
											{[
												"CO1",
												"CO2",
												"CO3",
												"CO4",
												"CO5",
												"CO6",
											].map((co) => {
												const percentage =
													attainmentData.presentStudents >
													0
														? (attainmentData
																.coStats[
																co as keyof typeof attainmentData.coStats
														  ].above70 /
																attainmentData.presentStudents) *
														  100
														: 0;
												const level =
													percentage >= 70
														? 3
														: percentage >= 60
														? 2
														: percentage >= 50
														? 1
														: 0;
												return (
													<TableCell
														key={co}
														className={`border border-gray-300 dark:border-gray-700 text-center font-bold ${getPercentageColor(
															percentage
														)}`}
													>
														{level.toFixed(2)}
													</TableCell>
												);
											})}
										</TableRow>
									</TableBody>
								</Table>
							</div>
						</CardContent>
					</Card>

					{/* CO ATTAINMENT in ABSOLUTE Scale */}
					<Card>
						<CardHeader className="bg-pink-100 dark:bg-pink-950">
							<CardTitle className="text-xl text-center font-bold">
								CO ATTAINMENT in ABSOLUTE Scale
							</CardTitle>
						</CardHeader>
						<CardContent className="p-0">
							<div className="overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow className="bg-blue-100 dark:bg-blue-950">
											<TableHead
												className="border border-gray-300 dark:border-gray-700 font-bold text-center align-middle bg-yellow-200 dark:bg-yellow-900"
												rowSpan={2}
											>
												ATTAINMENT TABLE
											</TableHead>
											<TableHead
												className="border border-gray-300 dark:border-gray-700 font-bold text-center"
												colSpan={6}
											>
												CO1 to CO6
											</TableHead>
										</TableRow>
										<TableRow className="bg-gray-100 dark:bg-gray-900">
											{[
												"CO1",
												"CO2",
												"CO3",
												"CO4",
												"CO5",
												"CO6",
											].map((co) => (
												<TableHead
													key={co}
													className="border border-gray-300 dark:border-gray-700 font-bold text-center"
												>
													{co}
												</TableHead>
											))}
										</TableRow>
									</TableHeader>
									<TableBody>
										<TableRow>
											<TableCell className="border border-gray-300 dark:border-gray-700 font-medium">
												ABSENTEE+NOT ATTEMPT
											</TableCell>
											{[
												"CO1",
												"CO2",
												"CO3",
												"CO4",
												"CO5",
												"CO6",
											].map((co) => (
												<TableCell
													key={co}
													className="border border-gray-300 dark:border-gray-700 text-center"
												>
													{attainmentData.absentees}
												</TableCell>
											))}
										</TableRow>
										<TableRow>
											<TableCell className="border border-gray-300 dark:border-gray-700 font-medium">
												PRESENT STUDENT OR ATTEMPT
											</TableCell>
											{[
												"CO1",
												"CO2",
												"CO3",
												"CO4",
												"CO5",
												"CO6",
											].map((co) => (
												<TableCell
													key={co}
													className="border border-gray-300 dark:border-gray-700 text-center"
												>
													{
														attainmentData.presentStudents
													}
												</TableCell>
											))}
										</TableRow>
										<TableRow>
											<TableCell className="border border-gray-300 dark:border-gray-700 font-medium">
												NO. OF STUDENTS SECURE MARKS
												&gt; PASSING MARKS
											</TableCell>
											{[
												"CO1",
												"CO2",
												"CO3",
												"CO4",
												"CO5",
												"CO6",
											].map((co) => (
												<TableCell
													key={co}
													className="border border-gray-300 dark:border-gray-700 text-center bg-gray-800 dark:bg-gray-950 text-white"
												>
													{
														attainmentData.coStats[
															co as keyof typeof attainmentData.coStats
														].abovePass
													}
												</TableCell>
											))}
										</TableRow>
										<TableRow>
											<TableCell className="border border-gray-300 dark:border-gray-700 font-medium">
												PC. OF STUDENTS SECURE MARKS
												&gt; PASSING MARKS
											</TableCell>
											{[
												"CO1",
												"CO2",
												"CO3",
												"CO4",
												"CO5",
												"CO6",
											].map((co) => {
												const percentage =
													attainmentData.presentStudents >
													0
														? (attainmentData
																.coStats[
																co as keyof typeof attainmentData.coStats
														  ].abovePass /
																attainmentData.presentStudents) *
														  100
														: 0;
												return (
													<TableCell
														key={co}
														className="border border-gray-300 dark:border-gray-700 text-center"
													>
														{percentage.toFixed(2)}
													</TableCell>
												);
											})}
										</TableRow>
										<TableRow>
											<TableCell className="border border-gray-300 dark:border-gray-700 font-medium">
												CO Attainment (AVERAGE OF
												PERCENTAGE ATTAINMENTS)
											</TableCell>
											{[
												"CO1",
												"CO2",
												"CO3",
												"CO4",
												"CO5",
												"CO6",
											].map((co) => {
												const percentage =
													attainmentData.presentStudents >
													0
														? (attainmentData
																.coStats[
																co as keyof typeof attainmentData.coStats
														  ].abovePass /
																attainmentData.presentStudents) *
														  100
														: 0;
												return (
													<TableCell
														key={co}
														className={`border border-gray-300 dark:border-gray-700 text-center font-bold ${getPercentageColor(
															percentage
														)}`}
													>
														{percentage.toFixed(2)}
													</TableCell>
												);
											})}
										</TableRow>
										<TableRow className="bg-orange-100 dark:bg-orange-950">
											<TableCell className="border border-gray-300 dark:border-gray-700 font-bold">
												Final attainment level CO (IN
												ABSOLUTE SCALE):
											</TableCell>
											{[
												"CO1",
												"CO2",
												"CO3",
												"CO4",
												"CO5",
												"CO6",
											].map((co) => {
												const percentage =
													attainmentData.presentStudents >
													0
														? (attainmentData
																.coStats[
																co as keyof typeof attainmentData.coStats
														  ].abovePass /
																attainmentData.presentStudents) *
														  100
														: 0;
												return (
													<TableCell
														key={co}
														className={`border border-gray-300 dark:border-gray-700 text-center font-bold ${getPercentageColor(
															percentage
														)}`}
													>
														{percentage.toFixed(2)}
													</TableCell>
												);
											})}
										</TableRow>
									</TableBody>
								</Table>
							</div>
						</CardContent>
					</Card>
				</>
			)}

			{/* CO-PO Mapping Table */}
			<Card>
				<CardHeader className="bg-orange-100 dark:bg-orange-950 border-b-4 border-orange-500">
					<CardTitle className="text-lg text-gray-900 dark:text-white">
						TEZPUR UNIVERSITY
					</CardTitle>
					<p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
						Course Outcome - Program Outcome Mapping
					</p>
				</CardHeader>
				<CardContent>
					<div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
						<Table>
							<TableHeader>
								<TableRow className="bg-gray-50 dark:bg-gray-900">
									<TableHead className="font-bold text-center border-r border-gray-200 dark:border-gray-700">
										CO
									</TableHead>
									<TableHead className="font-bold text-center border-r border-gray-200 dark:border-gray-700">
										PO1
									</TableHead>
									<TableHead className="font-bold text-center border-r border-gray-200 dark:border-gray-700">
										PO2
									</TableHead>
									<TableHead className="font-bold text-center border-r border-gray-200 dark:border-gray-700">
										PO3
									</TableHead>
									<TableHead className="font-bold text-center border-r border-gray-200 dark:border-gray-700">
										PO4
									</TableHead>
									<TableHead className="font-bold text-center">
										PO5
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{copoMatrix.map((row, idx) => (
									<TableRow
										key={idx}
										className={
											row.co === "ΣCO"
												? "bg-yellow-50 dark:bg-yellow-950 font-bold"
												: ""
										}
									>
										<TableCell className="font-medium text-center border-r border-gray-200 dark:border-gray-700">
											{row.co}
										</TableCell>
										<TableCell className="text-center border-r border-gray-200 dark:border-gray-700">
											<div className="flex justify-center">
												<Badge
													className={getLevelColor(
														row.po1
													)}
												>
													{row.po1}
												</Badge>
											</div>
										</TableCell>
										<TableCell className="text-center border-r border-gray-200 dark:border-gray-700">
											<div className="flex justify-center">
												<Badge
													className={getLevelColor(
														row.po2
													)}
												>
													{row.po2}
												</Badge>
											</div>
										</TableCell>
										<TableCell className="text-center border-r border-gray-200 dark:border-gray-700">
											<div className="flex justify-center">
												<Badge
													className={getLevelColor(
														row.po3
													)}
												>
													{row.po3}
												</Badge>
											</div>
										</TableCell>
										<TableCell className="text-center border-r border-gray-200 dark:border-gray-700">
											<div className="flex justify-center">
												<Badge
													className={getLevelColor(
														row.po4
													)}
												>
													{row.po4}
												</Badge>
											</div>
										</TableCell>
										<TableCell className="text-center">
											<div className="flex justify-center">
												<Badge
													className={getLevelColor(
														row.po5
													)}
												>
													{row.po5}
												</Badge>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
					<div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
						<p>
							<strong>Note:</strong> The mapping levels indicate:
							3 = High correlation, 2 = Medium correlation, 1 =
							Low correlation, 0 = No correlation
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
