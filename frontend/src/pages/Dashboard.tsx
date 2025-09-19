import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
	const navigate = useNavigate();

	const handleGoHome = () => {
		navigate("/");
	};

	const stats = [
		{
			title: "Total Users",
			value: "2,847",
			change: "+12.5%",
			trend: "up",
			description: "Active users this month",
		},
		{
			title: "Revenue",
			value: "$12,450",
			change: "+8.2%",
			trend: "up",
			description: "Total earnings",
		},
		{
			title: "Orders",
			value: "1,234",
			change: "-2.1%",
			trend: "down",
			description: "Orders processed",
		},
		{
			title: "Conversion Rate",
			value: "3.2%",
			change: "+0.5%",
			trend: "up",
			description: "Visitor to customer",
		},
	];

	const recentActivities = [
		{
			user: "John Doe",
			action: "created a new project",
			time: "2 minutes ago",
			avatar: "JD",
		},
		{
			user: "Sarah Wilson",
			action: "updated the dashboard",
			time: "15 minutes ago",
			avatar: "SW",
		},
		{
			user: "Mike Johnson",
			action: "completed task review",
			time: "1 hour ago",
			avatar: "MJ",
		},
		{
			user: "Emily Chen",
			action: "added new team member",
			time: "2 hours ago",
			avatar: "EC",
		},
	];

	const quickActions = [
		{
			title: "Create Project",
			description: "Start a new project",
			icon: "📝",
		},
		{ title: "Add User", description: "Invite team members", icon: "👥" },
		{
			title: "View Reports",
			description: "Analyze performance",
			icon: "📊",
		},
		{ title: "Settings", description: "Configure system", icon: "⚙️" },
	];

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			{/* Header */}
			<div className="border-b bg-white dark:bg-gray-800">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
								Dashboard
							</h1>
							<Breadcrumb>
								<BreadcrumbList>
									<BreadcrumbItem>
										<BreadcrumbLink
											href="#"
											onClick={handleGoHome}
											className="cursor-pointer"
										>
											Home
										</BreadcrumbLink>
									</BreadcrumbItem>
									<BreadcrumbSeparator />
									<BreadcrumbItem>
										<BreadcrumbPage>
											Dashboard
										</BreadcrumbPage>
									</BreadcrumbItem>
								</BreadcrumbList>
							</Breadcrumb>
						</div>
						<Button onClick={handleGoHome} variant="outline">
							← Back to Home
						</Button>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 py-8">
				{/* Welcome Section */}
				<div className="mb-8">
					<h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
						Welcome back! 👋
					</h2>
					<p className="text-gray-600 dark:text-gray-300">
						Here's what's happening with your projects today.
					</p>
				</div>

				{/* Stats Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					{stats.map((stat, index) => (
						<Card
							key={index}
							className="hover:shadow-lg transition-shadow duration-300"
						>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
									{stat.title}
								</CardTitle>
								<Badge
									variant={
										stat.trend === "up"
											? "default"
											: "destructive"
									}
									className="text-xs"
								>
									{stat.change}
								</Badge>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
									{stat.value}
								</div>
								<p className="text-xs text-gray-600 dark:text-gray-400">
									{stat.description}
								</p>
							</CardContent>
						</Card>
					))}
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Recent Activity */}
					<div className="lg:col-span-2">
						<Card>
							<CardHeader>
								<CardTitle className="text-xl">
									Recent Activity
								</CardTitle>
								<CardDescription>
									Latest updates from your team and projects
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{recentActivities.map((activity, index) => (
										<div
											key={index}
											className="flex items-center space-x-4"
										>
											<Avatar className="h-10 w-10">
												<AvatarImage src="" />
												<AvatarFallback className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
													{activity.avatar}
												</AvatarFallback>
											</Avatar>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium text-gray-900 dark:text-white">
													{activity.user}
												</p>
												<p className="text-sm text-gray-600 dark:text-gray-400">
													{activity.action}
												</p>
											</div>
											<div className="text-sm text-gray-500 dark:text-gray-400">
												{activity.time}
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Quick Actions */}
					<div>
						<Card>
							<CardHeader>
								<CardTitle className="text-xl">
									Quick Actions
								</CardTitle>
								<CardDescription>
									Common tasks and shortcuts
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{quickActions.map((action, index) => (
										<Button
											key={index}
											variant="ghost"
											className="w-full justify-start h-auto p-4 hover:bg-gray-100 dark:hover:bg-gray-700"
										>
											<div className="flex items-center space-x-3">
												<span className="text-2xl">
													{action.icon}
												</span>
												<div className="text-left">
													<div className="font-medium">
														{action.title}
													</div>
													<div className="text-sm text-gray-600 dark:text-gray-400">
														{action.description}
													</div>
												</div>
											</div>
										</Button>
									))}
								</div>
							</CardContent>
						</Card>

						{/* Performance Summary */}
						<Card className="mt-6">
							<CardHeader>
								<CardTitle className="text-xl">
									Performance
								</CardTitle>
								<CardDescription>
									This month's overview
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<span className="text-sm font-medium">
											Projects Completed
										</span>
										<Badge variant="outline">12</Badge>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm font-medium">
											Team Members
										</span>
										<Badge variant="outline">8</Badge>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm font-medium">
											Client Satisfaction
										</span>
										<Badge variant="default">98%</Badge>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm font-medium">
											Task Completion
										</span>
										<Badge variant="default">94%</Badge>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* Footer Info */}
				<div className="mt-12 text-center text-gray-500 dark:text-gray-400">
					<p>Dashboard built with React + Vite + ShadCN UI</p>
				</div>
			</div>
		</div>
	);
}
