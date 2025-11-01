import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { AlertCircle, Apple, Github } from "lucide-react";

interface LoginFormProps {
	onSubmit: (identifier: string, password: string) => Promise<void>;
	loading: boolean;
	error: string;
}

export function LoginForm({ onSubmit, loading, error }: LoginFormProps) {
	const [identifier, setIdentifier] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await onSubmit(identifier, password);
	};

	const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setIdentifier(e.target.value);
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};

	return (
		<div className="flex flex-col justify-center p-8 md:p-12">
			<div className="mx-auto w-full max-w-md space-y-8">
				{/* Header */}
				<div className="space-y-2 text-center">
					<h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
						Welcome Back
					</h1>
					<p className="text-slate-600 dark:text-slate-400">
						Enter your credentials to access your account
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
				<form onSubmit={handleSubmit} className="space-y-6">
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
							{loading ? "Signing in..." : "Sign In"}
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
							<span className="sr-only">Apple</span>
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
							<span className="sr-only">Google</span>
						</Button>
						<Button
							type="button"
							variant="outline"
							className="border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-900 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-800 dark:text-white"
						>
							<Github className="h-5 w-5" />
							<span className="sr-only">GitHub</span>
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
	);
}
