import { Button } from "@/components/ui/button";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Menu, X } from "lucide-react";

interface AssessmentsHeaderProps {
	sidebarOpen: boolean;
	onToggleSidebar: () => void;
}

export function AssessmentsHeader({
	sidebarOpen,
	onToggleSidebar,
}: AssessmentsHeaderProps) {
	return (
		<header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6">
			<div className="flex items-center gap-4">
				<Button
					variant="ghost"
					size="icon"
					onClick={onToggleSidebar}
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
	);
}
