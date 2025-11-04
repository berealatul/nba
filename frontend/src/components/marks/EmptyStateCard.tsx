import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface EmptyStateCardProps {
	title: string;
	description: string;
}

export function EmptyStateCard({ title, description }: EmptyStateCardProps) {
	return (
		<Card>
			<CardContent className="p-12 text-center">
				<div className="flex flex-col items-center gap-4">
					<FileText className="w-16 h-16 text-gray-400" />
					<div>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
							{title}
						</h3>
						<p className="text-gray-500 dark:text-gray-400 mt-1">
							{description}
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
