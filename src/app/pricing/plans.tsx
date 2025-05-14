"use client";

import usePlanStore from "@/store/plan";
import PricingToggle from "./pricing-toggle";
import FeatureItem from "./feature-item";

export default function Plans() {
	const plan = usePlanStore((state) => state.plan);

	return (
		<div className="container mx-auto px-4 py-6 max-w-4xl">
			<div className="text-center mb-8">
				<h1 className="text-4xl font-bold mb-2">
					Pricing specially designed for you!!
				</h1>
				<p className="text-gray-600">
					(Whether you're a beginner or professional)
				</p>
			</div>

			<div className="mb-8">
				<h2 className="text-2xl font-bold text-center mb-6">
					Choose your Class Type
				</h2>
				<PricingToggle />
			</div>

			<div className="mb-8">
				{plan === "online" ? (
					<>
						<h2 className="text-3xl font-bold mb-4">Online Class</h2>
						<p className="text-gray-700 mb-6">
							Unlock expert-level dessert making skills with personalized
							guidance
						</p>

						<div className="mb-8">
							<div className="text-4xl font-bold text-primary mb-1">$299</div>
							<div className="text-lg">Full Course Access Fee</div>
						</div>
					</>
				) : (
					<>
						<h2 className="text-3xl font-bold mb-4">Offline Class</h2>
						<p className="text-gray-700 mb-6">
							Unlock expert-level dessert making skills with personalized
							guidance
						</p>

						<div className="mb-8">
							<div className="text-4xl font-bold text-primary mb-1">$299</div>
							<div className="text-lg">Full Course Access Fee</div>
						</div>
					</>
				)}

				<div className="mb-8">
					<h3 className="font-bold mb-4">Additional Features:</h3>
					<div className="space-y-3">
						<FeatureItem>Everything in Basic Class Package</FeatureItem>
						<FeatureItem>
							Custom recipe book tailored to your preferences
						</FeatureItem>
						<FeatureItem>One-on-one virtual coaching sessions</FeatureItem>
						<FeatureItem>Personal instructor for offline classes</FeatureItem>
						<FeatureItem>
							Access to exclusive masterclass events (12 month period)
						</FeatureItem>
					</div>
				</div>

				<div className="border-t border-gray-200 pt-6">
					<h3 className="text-xl font-bold text-center mb-4">
						Monthly Subscription Options:
					</h3>
					{/* Subscription options would go here */}
				</div>
			</div>
		</div>
	);
}
