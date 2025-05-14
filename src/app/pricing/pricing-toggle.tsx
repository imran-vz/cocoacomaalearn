"use client";

import { cn } from "@/lib/utils";
import usePlanStore from "@/store/plan";

export default function PricingToggle() {
	const plan = usePlanStore((state) => state.plan);
	const setPlan = usePlanStore((state) => state.setPlan);

	return (
		<div className="flex justify-center">
			<div className="relative inline-flex rounded-full border border-gray-300 p-1 w-full max-w-md">
				<button
					type="button"
					onClick={() => setPlan("online")}
					className={cn(
						"flex-1 py-1.5 text-center rounded-full font-medium transition-all hover:cursor-pointer z-10",
						plan === "online"
							? "text-white"
							: "text-primary hover:text-primary/90",
					)}
				>
					ONLINE
				</button>
				<button
					type="button"
					onClick={() => setPlan("offline")}
					className={cn(
						"flex-1 py-1.5 text-center rounded-full font-medium transition-all hover:cursor-pointer z-10",
						plan === "offline"
							? "text-white"
							: "text-primary hover:text-primary/90",
					)}
				>
					OFFLINE
				</button>
				<div
					className={cn(
						"absolute top-1 bottom-1 rounded-full bg-primary transition-all duration-200 ease-in-out",
						plan === "online" ? "left-1 right-[50%]" : "left-[50%] right-1",
					)}
				/>
			</div>
		</div>
	);
}
