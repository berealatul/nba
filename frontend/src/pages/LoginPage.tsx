import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { DotPattern } from "@/components/ui/dot-pattern";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Apple, Github, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiService } from "@/services/api";

export function LoginPage() {
	const [identifier, setIdentifier] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const response = await apiService.login({
				employeeIdOrEmail: identifier,
				password: password,
			});

			if (response.success) {
				const { user } = response.data;

				// Route based on role
				if (user.role === "faculty") {
					navigate("/assessments");
				} else {
					navigate("/dashboard");
				}
			}
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "Login failed. Please try again."
			);
		} finally {
			setLoading(false);
		}
	};

	const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setIdentifier(e.target.value);
		if (error) setError("");
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
		if (error) setError("");
	};

	return (
		<div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-linear-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
			{/* Theme Toggle Button */}
			<div className="absolute top-6 right-6 z-50">
				<AnimatedThemeToggler className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm text-slate-900 dark:text-white hover:bg-white dark:hover:bg-slate-600 transition-colors border border-slate-300 dark:border-slate-700/50 shadow-lg" />
			</div>

			{/* Animated Dot Pattern Background */}
			<DotPattern
				className={cn(
					"mask-[radial-gradient(600px_circle_at_center,white,transparent)] text-slate-400/50 dark:text-neutral-400/80"
				)}
				width={20}
				height={20}
				cx={1}
				cy={1}
				cr={1}
			/>

			{/* Main Content Container */}
			<div className="relative z-10 w-full max-w-6xl px-4">
				<Card className="overflow-hidden border-slate-200 bg-white backdrop-blur-xl shadow-2xl dark:border-slate-700/50 dark:bg-slate-900/90">
					<CardContent className="grid p-0 md:grid-cols-2">
						{/* Login Form Section */}
						<div className="flex flex-col justify-center p-8 md:p-12">
							<div className="mx-auto w-full max-w-md space-y-8">
								{/* Header */}
								<div className="space-y-2 text-center">
									<h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
										Welcome Back
									</h1>
									<p className="text-slate-600 dark:text-slate-400">
										Enter your credentials to access your
										account
									</p>
								</div>

								{/* Error Message */}
								{error && (
									<div className="rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 p-4">
										<div className="flex items-center gap-2">
											<AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
											<p className="text-sm text-red-600 dark:text-red-400">
												{error}
											</p>
										</div>
									</div>
								)}

								{/* Form */}
								<form
									onSubmit={handleSubmit}
									className="space-y-6"
								>
									{/* Email or Employee ID Field */}
									<div className="space-y-2">
										<Label
											htmlFor="identifier"
											className="text-slate-700 dark:text-slate-200"
										>
											Email or Employee ID
										</Label>
										<Input
											id="identifier"
											type="text"
											placeholder="you@example.com or EMP12345"
											value={identifier}
											onChange={handleIdentifierChange}
											required
											autoComplete="username"
											className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500"
										/>
									</div>

									{/* Password Field */}
									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<Label
												htmlFor="password"
												className="text-slate-700 dark:text-slate-200"
											>
												Password
											</Label>
											<a
												href="#"
												className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
											>
												Forgot password?
											</a>
										</div>
										<Input
											id="password"
											type="password"
											placeholder="••••••••"
											value={password}
											onChange={handlePasswordChange}
											required
											autoComplete="current-password"
											className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500"
										/>
									</div>

									{/* Submit Button */}
									<ShimmerButton
										className="w-full"
										type="submit"
										disabled={loading}
									>
										<span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white">
											{loading
												? "Signing in..."
												: "Sign In"}
										</span>
									</ShimmerButton>

									{/* Divider */}
									<div className="relative">
										<div className="absolute inset-0 flex items-center">
											<div className="w-full border-t border-slate-300 dark:border-slate-700"></div>
										</div>
										<div className="relative flex justify-center text-xs uppercase">
											<span className="bg-white dark:bg-slate-900 px-2 text-slate-500 dark:text-slate-400">
												Or continue with
											</span>
										</div>
									</div>

									{/* Social Login Buttons */}
									<div className="grid grid-cols-3 gap-3">
										<Button
											type="button"
											variant="outline"
											className="border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-900 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-800 dark:text-white"
										>
											<Apple className="h-5 w-5" />
											<span className="sr-only">
												Apple
											</span>
										</Button>
										<Button
											type="button"
											variant="outline"
											className="border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-900 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-800 dark:text-white"
										>
											<svg
												className="h-5 w-5"
												fill="currentColor"
												viewBox="0 0 24 24"
											>
												<path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
											</svg>
											<span className="sr-only">
												Google
											</span>
										</Button>
										<Button
											type="button"
											variant="outline"
											className="border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-900 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-800 dark:text-white"
										>
											<Github className="h-5 w-5" />
											<span className="sr-only">
												GitHub
											</span>
										</Button>
									</div>
								</form>

								{/* Sign Up Link */}
								<div className="text-center text-sm text-slate-600 dark:text-slate-400">
									Don't have an account?{" "}
									<a
										href="#"
										className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
									>
										Sign up
									</a>
								</div>
							</div>
						</div>

						{/* Image Section */}
						<div className="relative hidden md:block bg-linear-to-br from-blue-600 to-purple-700">
							<div className="absolute inset-0 bg-black/20"></div>
							<div className="relative flex h-full flex-col justify-center p-12">
								<div className="space-y-4">
									<h2 className="text-4xl font-bold text-white">
										Start your journey today
									</h2>
									<p className="text-lg text-blue-100">
										Join thousands of users who trust our
										platform for their daily needs.
									</p>
									<div className="mt-8 space-y-4">
										<div className="flex items-center space-x-3">
											<div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
												<Check className="h-6 w-6 text-white" />
											</div>
											<p className="text-white">
												Secure and encrypted
											</p>
										</div>
										<div className="flex items-center space-x-3">
											<div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
												<Check className="h-6 w-6 text-white" />
											</div>
											<p className="text-white">
												24/7 customer support
											</p>
										</div>
										<div className="flex items-center space-x-3">
											<div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
												<Check className="h-6 w-6 text-white" />
											</div>
											<p className="text-white">
												Easy to use interface
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Terms and Privacy */}
				<p className="mt-6 text-center text-xs text-slate-600 dark:text-slate-500">
					By continuing, you agree to our{" "}
					<a
						href="#"
						className="text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300"
					>
						Terms of Service
					</a>{" "}
					and{" "}
					<a
						href="#"
						className="text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300"
					>
						Privacy Policy
					</a>
					.
				</p>
			</div>
		</div>
	);
}
