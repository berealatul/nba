import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { ClipboardList, LogOut, Menu, X, ChevronDown } from "lucide-react";
import { apiService } from "@/services/api";
import type { User } from "@/services/api";

const CO_OPTIONS = ["CO1", "CO2", "CO3", "CO4", "CO5", "CO6"];
const QUESTIONS = Array.from({ length: 20 }, (_, i) => i + 1);
const SUB_QUESTIONS = ["a", "b", "c", "d", "e", "f", "g", "h"];
const TEST_OPTIONS = ["Test-1", "Mid-Term", "Test-2", "End-Term"];

// Dummy courses - replace with API data
const COURSES = [
	{ id: "CS101", name: "Introduction to Programming" },
	{ id: "CS201", name: "Data Structures and Algorithms" },
	{ id: "CS301", name: "Database Management Systems" },
	{ id: "CS401", name: "Software Engineering" },
	{ id: "CS501", name: "Machine Learning" },
];

type COMapping = {
	[key: string]: string; // key format: "q1_a", "q2_b", etc.
};

export function AssessmentsPage() {
	const [user, setUser] = useState<User | null>(null);
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [coMapping, setCoMapping] = useState<COMapping>({});
	const [selectedCourse, setSelectedCourse] = useState<string>("");
	const [selectedTest, setSelectedTest] = useState<string>("");
	const navigate = useNavigate();

	useEffect(() => {
		const storedUser = apiService.getStoredUser();
		if (!storedUser) {
			navigate("/login");
			return;
		}
		if (storedUser.role !== "faculty") {
			navigate("/dashboard");
			return;
		}
		setUser(storedUser);
	}, [navigate]);

	const handleLogout = async () => {
		await apiService.logout();
		navigate("/login");
	};

	const handleCOChange = (
		questionNum: number,
		subQuestion: string,
		co: string | null
	) => {
		const key = `q${questionNum}_${subQuestion}`;
		if (co === null) {
			// Remove the mapping if unselected
			setCoMapping((prev) => {
				const newMapping = { ...prev };
				delete newMapping[key];
				return newMapping;
			});
		} else {
			setCoMapping((prev) => ({
				...prev,
				[key]: co,
			}));
		}
	};

	const getCOValue = (questionNum: number, subQuestion: string): string => {
		const key = `q${questionNum}_${subQuestion}`;
		return coMapping[key] || "Select CO";
	};

	if (!user) {
		return null;
	}

	return (
		<div className="flex h-screen bg-gray-50 dark:bg-gray-950">
			{/* Sidebar */}
			<aside
				className={`${
					sidebarOpen ? "w-64" : "w-0"
				} transition-all duration-300 ease-in-out bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-hidden`}
			>
				<div className="flex flex-col h-full">
					{/* University Info */}
					<div className="p-6 border-b border-gray-200 dark:border-gray-800">
						<div className="flex items-center gap-3">
							<div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
								TU
							</div>
							<div className="flex-1 min-w-0">
								<h2 className="text-sm font-bold text-gray-900 dark:text-white">
									Tezpur University
								</h2>
								<p className="text-xs text-gray-600 dark:text-gray-400 truncate">
									{user.department_name || "Department"}
								</p>
							</div>
						</div>
					</div>

					{/* Navigation */}
					<ScrollArea className="flex-1 px-3 py-4">
						<nav className="space-y-1">
							<button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 transition-all">
								<ClipboardList className="w-5 h-5" />
								<span>Assessments</span>
							</button>
						</nav>

						<Separator className="my-4" />

						{/* Logout */}
						<div className="space-y-1">
							<button
								onClick={handleLogout}
								className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-all"
							>
								<LogOut className="w-5 h-5" />
								<span>Logout</span>
							</button>
						</div>
					</ScrollArea>

					{/* User Profile */}
					<div className="p-4 border-t border-gray-200 dark:border-gray-800">
						<div className="flex items-center gap-3">
							<Avatar>
								<AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-600 text-white">
									{user.username
										.split(" ")
										.map((n) => n[0])
										.join("")
										.toUpperCase()
										.slice(0, 2)}
								</AvatarFallback>
							</Avatar>
							<div className="flex-1 min-w-0">
								<p className="text-sm font-medium text-gray-900 dark:text-white truncate">
									{user.username}
								</p>
								<p className="text-xs text-gray-500 dark:text-gray-400 truncate">
									{user.email}
								</p>
							</div>
						</div>
					</div>
				</div>
			</aside>

			{/* Main Content */}
			<div className="flex-1 flex flex-col overflow-hidden">
				{/* Header */}
				<header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6">
					<div className="flex items-center gap-4">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setSidebarOpen(!sidebarOpen)}
							className="text-gray-700 dark:text-gray-300"
						>
							{sidebarOpen ? (
								<X className="w-5 h-5" />
							) : (
								<Menu className="w-5 h-5" />
							)}
						</Button>
						<div>
							<h1 className="text-xl font-bold text-gray-900 dark:text-white">
								Question CO Mapping
							</h1>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Map questions to Course Outcomes (CO1-CO6)
							</p>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<AnimatedThemeToggler />
					</div>
				</header>

				{/* Dashboard Content */}
				<main className="flex-1 overflow-auto">
					<ScrollArea className="h-full">
						<div className="p-6">
							{/* Course and Test Selection */}
							<Card className="mb-6">
								<CardHeader>
									<CardTitle className="text-gray-900 dark:text-white">
										Select Course and Test
									</CardTitle>
									<CardDescription className="text-gray-600 dark:text-gray-400">
										Choose the course and test type for CO
										mapping
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{/* Course Selection */}
										<div className="space-y-2">
											<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
												Course
											</label>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant="outline"
														className="w-full justify-between text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
													>
														<span className="text-sm truncate">
															{selectedCourse
																? COURSES.find(
																		(c) =>
																			c.id ===
																			selectedCourse
																  )?.name ||
																  "Select Course"
																: "Select Course"}
														</span>
														<ChevronDown className="h-4 w-4 opacity-50 ml-2 flex-shrink-0" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent className="w-[400px]">
													{COURSES.map((course) => (
														<DropdownMenuItem
															key={course.id}
															onClick={() =>
																setSelectedCourse(
																	course.id
																)
															}
															className="cursor-pointer text-gray-900 dark:text-white"
														>
															<div className="flex flex-col">
																<span className="font-medium">
																	{course.id}
																</span>
																<span className="text-sm text-gray-600 dark:text-gray-400">
																	{
																		course.name
																	}
																</span>
															</div>
														</DropdownMenuItem>
													))}
												</DropdownMenuContent>
											</DropdownMenu>
										</div>

										{/* Test Selection */}
										<div className="space-y-2">
											<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
												Test Type
											</label>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant="outline"
														className="w-full justify-between text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
													>
														<span className="text-sm">
															{selectedTest ||
																"Select Test"}
														</span>
														<ChevronDown className="h-4 w-4 opacity-50 ml-2 flex-shrink-0" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent className="w-[200px]">
													{TEST_OPTIONS.map(
														(test) => (
															<DropdownMenuItem
																key={test}
																onClick={() =>
																	setSelectedTest(
																		test
																	)
																}
																className="cursor-pointer text-gray-900 dark:text-white"
															>
																{test}
															</DropdownMenuItem>
														)
													)}
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="text-gray-900 dark:text-white">
										Question CO Mapping Table
									</CardTitle>
									<CardDescription className="text-gray-600 dark:text-gray-400">
										Select Course Outcome (CO1-CO6) for each
										sub-question
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="overflow-x-auto">
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead className="text-gray-700 dark:text-gray-300 font-bold w-24">
														Question
													</TableHead>
													{SUB_QUESTIONS.map((sq) => (
														<TableHead
															key={sq}
															className="text-center text-gray-700 dark:text-gray-300 font-bold"
														>
															{sq.toUpperCase()}
														</TableHead>
													))}
												</TableRow>
											</TableHeader>
											<TableBody>
												{QUESTIONS.map((qNum) => (
													<TableRow key={qNum}>
														<TableCell className="font-bold text-gray-900 dark:text-white">
															Q{qNum}
														</TableCell>
														{SUB_QUESTIONS.map(
															(sq) => (
																<TableCell
																	key={`${qNum}_${sq}`}
																	className="text-center"
																>
																	<DropdownMenu>
																		<DropdownMenuTrigger
																			asChild
																		>
																			<Button
																				variant="outline"
																				className="w-28 justify-between text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
																			>
																				<span className="text-sm">
																					{getCOValue(
																						qNum,
																						sq
																					)}
																				</span>
																				<ChevronDown className="h-4 w-4 opacity-50" />
																			</Button>
																		</DropdownMenuTrigger>
																		<DropdownMenuContent className="w-28">
																			<DropdownMenuItem
																				onClick={() =>
																					handleCOChange(
																						qNum,
																						sq,
																						null
																					)
																				}
																				className="cursor-pointer text-gray-500 dark:text-gray-400 italic"
																			>
																				Select
																				CO
																			</DropdownMenuItem>
																			{CO_OPTIONS.map(
																				(
																					co
																				) => (
																					<DropdownMenuItem
																						key={
																							co
																						}
																						onClick={() =>
																							handleCOChange(
																								qNum,
																								sq,
																								co
																							)
																						}
																						className="cursor-pointer text-gray-900 dark:text-white"
																					>
																						{
																							co
																						}
																					</DropdownMenuItem>
																				)
																			)}
																		</DropdownMenuContent>
																	</DropdownMenu>
																</TableCell>
															)
														)}
													</TableRow>
												))}
											</TableBody>
										</Table>
									</div>
								</CardContent>
							</Card>

							{/* Save Button */}
							<div className="mt-6 flex justify-end">
								<Button
									size="lg"
									className="bg-blue-600 hover:bg-blue-700 text-white"
									disabled={!selectedCourse || !selectedTest}
									onClick={() => {
										console.log("CO Mapping:", {
											course: selectedCourse,
											test: selectedTest,
											mapping: coMapping,
										});
										// TODO: Save to API
									}}
								>
									Save Mapping
								</Button>
							</div>
						</div>
					</ScrollArea>
				</main>
			</div>
		</div>
	);
}
