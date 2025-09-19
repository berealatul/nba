import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export default function Home() {
	const navigate = useNavigate();

	const handleGoToDashboard = () => {
		navigate("/dashboard");
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
			<div className="container mx-auto px-4 py-16">
				{/* Header Section */}
				<div className="text-center mb-16">
					<h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
						Welcome to Our Platform
					</h1>
					<p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
						Experience the power of modern web development with
						React, Vite, and ShadCN UI components. Built for
						performance, designed for developers.
					</p>
				</div>

				{/* Features Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
					<Card className="hover:shadow-lg transition-shadow duration-300">
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle className="text-xl">
									⚡ Lightning Fast
								</CardTitle>
								<Badge variant="secondary">New</Badge>
							</div>
							<CardDescription>
								Built with Vite for incredibly fast development
								and build times.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Experience instant hot module replacement and
								optimized production builds that load in
								milliseconds.
							</p>
						</CardContent>
					</Card>

					<Card className="hover:shadow-lg transition-shadow duration-300">
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle className="text-xl">
									🎨 Beautiful UI
								</CardTitle>
								<Badge variant="outline">Featured</Badge>
							</div>
							<CardDescription>
								Stunning components powered by ShadCN UI and
								Tailwind CSS.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Pre-built accessible components that look great
								out of the box with full customization support.
							</p>
						</CardContent>
					</Card>

					<Card className="hover:shadow-lg transition-shadow duration-300">
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle className="text-xl">
									🔧 Developer Ready
								</CardTitle>
								<Badge variant="destructive">Hot</Badge>
							</div>
							<CardDescription>
								TypeScript, ESLint, and modern tooling included
								by default.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Everything you need for professional development
								with type safety and code quality tools.
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Call to Action Section */}
				<div className="text-center">
					<Card className="max-w-2xl mx-auto bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
						<CardHeader>
							<CardTitle className="text-2xl">
								Ready to Get Started?
							</CardTitle>
							<CardDescription className="text-lg">
								Explore our dashboard to see all the features in
								action.
							</CardDescription>
						</CardHeader>
						<CardContent className="pt-6">
							<Button
								onClick={handleGoToDashboard}
								size="lg"
								className="text-lg px-8 py-3"
							>
								Go to Dashboard →
							</Button>
							<p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
								No account required • Free to explore
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Footer */}
				<footer className="text-center mt-16 text-gray-500 dark:text-gray-400">
					<p>
						&copy; 2025 Our Platform. Built with ❤️ using React +
						Vite + ShadCN UI
					</p>
				</footer>
			</div>
		</div>
	);
}
