import { Check } from "lucide-react";

export function LoginHero() {
	return (
		<div className="relative hidden md:block bg-linear-to-br from-blue-600 to-purple-700">
			<div className="absolute inset-0 bg-black/20"></div>
			<div className="relative flex h-full flex-col justify-center p-12">
				<div className="space-y-4">
					<h2 className="text-4xl font-bold text-white">
						Start your journey today
					</h2>
					<p className="text-lg text-blue-100">
						Join thousands of users who trust our platform for their
						daily needs.
					</p>
					<div className="mt-8 space-y-4">
						<div className="flex items-center space-x-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
								<Check className="h-6 w-6 text-white" />
							</div>
							<p className="text-white">Secure and encrypted</p>
						</div>
						<div className="flex items-center space-x-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
								<Check className="h-6 w-6 text-white" />
							</div>
							<p className="text-white">24/7 customer support</p>
						</div>
						<div className="flex items-center space-x-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
								<Check className="h-6 w-6 text-white" />
							</div>
							<p className="text-white">Easy to use interface</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
