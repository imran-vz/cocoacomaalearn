import type React from "react";
import { Check } from "lucide-react";

interface FeatureItemProps {
	children: React.ReactNode;
}

export default function FeatureItem({ children }: FeatureItemProps) {
	return (
		<div className="flex items-start gap-3 border border-gray-200 rounded-lg p-4">
			<div className="mt-0.5 flex-shrink-0">
				<Check className="h-5 w-5 text-primary" />
			</div>
			<div className="font-medium">{children}</div>
		</div>
	);
}
