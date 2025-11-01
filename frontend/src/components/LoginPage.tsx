import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { DotPattern } from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";

export function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle login logic here
		console.log("Login attempt with:", { email, password });
	};

	return (
		<div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-slate-800">
			{/* Animated Dot Pattern Background */}
			<DotPattern
				className={cn(
					"mask-[radial-gradient(600px_circle_at_center,white,transparent)]"
				)}
				width={20}
				height={20}
				cx={1}
				cy={1}
				cr={1}
			/>

			{/* Main Content Container */}
			<div className="relative z-10 w-full max-w-6xl px-4">
				<Card className="overflow-hidden border-slate-700/50 bg-slate-900/90 backdrop-blur-xl shadow-2xl">
					<CardContent className="grid p-0 md:grid-cols-2">
						{/* Login Form Section */}
						<div className="flex flex-col justify-center p-8 md:p-12">
							<div className="mx-auto w-full max-w-md space-y-8">
								{/* Header */}
								<div className="space-y-2 text-center">
									<h1 className="text-4xl font-bold tracking-tight text-white">
										Welcome Back
									</h1>
									<p className="text-slate-400">
										Enter your credentials to access your
										account
									</p>
								</div>

								{/* Form */}
								<form
									onSubmit={handleSubmit}
									className="space-y-6"
								>
									{/* Email Field */}
									<div className="space-y-2">
										<Label
											htmlFor="email"
											className="text-slate-200"
										>
											Email Address
										</Label>
										<Input
											id="email"
											type="email"
											placeholder="you@example.com"
											value={email}
											onChange={(e) =>
												setEmail(e.target.value)
											}
											required
											className="border-slate-700 bg-slate-800/50 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
										/>
									</div>

									{/* Password Field */}
									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<Label
												htmlFor="password"
												className="text-slate-200"
											>
												Password
											</Label>
											<a
												href="#"
												className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
											>
												Forgot password?
											</a>
										</div>
										<Input
											id="password"
											type="password"
											placeholder="••••••••"
											value={password}
											onChange={(e) =>
												setPassword(e.target.value)
											}
											required
											className="border-slate-700 bg-slate-800/50 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
										/>
									</div>

									{/* Submit Button */}
									<ShimmerButton
										className="w-full"
										type="submit"
									>
										<span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white">
											Sign In
										</span>
									</ShimmerButton>

									{/* Divider */}
									<div className="relative">
										<div className="absolute inset-0 flex items-center">
											<div className="w-full border-t border-slate-700"></div>
										</div>
										<div className="relative flex justify-center text-xs uppercase">
											<span className="bg-slate-900 px-2 text-slate-400">
												Or continue with
											</span>
										</div>
									</div>

									{/* Social Login Buttons */}
									<div className="grid grid-cols-3 gap-3">
										<Button
											type="button"
											variant="outline"
											className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-white"
										>
											<svg
												className="h-5 w-5"
												fill="currentColor"
												viewBox="0 0 24 24"
											>
												<path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
											</svg>
											<span className="sr-only">
												Apple
											</span>
										</Button>
										<Button
											type="button"
											variant="outline"
											className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-white"
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
											className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-white"
										>
											<svg
												className="h-5 w-5"
												fill="currentColor"
												viewBox="0 0 24 24"
											>
												<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
											</svg>
											<span className="sr-only">
												GitHub
											</span>
										</Button>
									</div>
								</form>

								{/* Sign Up Link */}
								<div className="text-center text-sm text-slate-400">
									Don't have an account?{" "}
									<a
										href="#"
										className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
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
												<svg
													className="h-6 w-6 text-white"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M5 13l4 4L19 7"
													/>
												</svg>
											</div>
											<p className="text-white">
												Secure and encrypted
											</p>
										</div>
										<div className="flex items-center space-x-3">
											<div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
												<svg
													className="h-6 w-6 text-white"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M5 13l4 4L19 7"
													/>
												</svg>
											</div>
											<p className="text-white">
												24/7 customer support
											</p>
										</div>
										<div className="flex items-center space-x-3">
											<div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
												<svg
													className="h-6 w-6 text-white"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M5 13l4 4L19 7"
													/>
												</svg>
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
				<p className="mt-6 text-center text-xs text-slate-500">
					By continuing, you agree to our{" "}
					<a href="#" className="text-slate-400 hover:text-slate-300">
						Terms of Service
					</a>{" "}
					and{" "}
					<a href="#" className="text-slate-400 hover:text-slate-300">
						Privacy Policy
					</a>
					.
				</p>
			</div>
		</div>
	);
}
