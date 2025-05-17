"use client";

import usePlanStore from "@/store/plan";
import PricingToggle from "./pricing-toggle";
import FeatureItem from "./feature-item";
import type { Session } from "next-auth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Plans({ session }: { session: Session }) {
	const plan = usePlanStore((state) => state.plan);

	const createOrderId = async () => {
		try {
			const response = await fetch("/api/order", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					amount: (100 * 100).toString(),
					currency: "INR",
				}),
			});

			console.log(" :24 | createOrderId | response:", response);
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			const data = await response.json();
			return data.orderId;
		} catch (error) {
			console.error("There was a problem with your fetch operation:", error);
		}
	};

	const processPayment = async () => {
		try {
			const orderId: string = await createOrderId();
			const options = {
				key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
				amount: 100 * 100,
				currency: "INR",
				name: "Cocoa Comaa",
				description: "Payment for the course",
				order_id: orderId,
				handler: async (response: {
					razorpay_payment_id: string;
					razorpay_order_id: string;
					razorpay_signature: string;
				}) => {
					const data = {
						orderCreationId: orderId,
						razorpayPaymentId: response.razorpay_payment_id,
						razorpayOrderId: response.razorpay_order_id,
						razorpaySignature: response.razorpay_signature,
					};

					const result = await fetch("/api/verify", {
						method: "POST",
						body: JSON.stringify(data),
						headers: { "Content-Type": "application/json" },
					});
					const res = await result.json();
					if (res.isOk) {
						toast.success("payment succeed");
					} else {
						toast.info(res.message);
					}
				},
				prefill: {
					name: session.user.name,
					email: session.user.email,
				},
				theme: { color: "#804134" },
			};
			// @ts-ignore
			const paymentObject = new window.Razorpay(options);
			paymentObject.on(
				"payment.failed",
				(response: { error: { description: string } }) => {
					toast.error(response.error.description);
				},
			);
			paymentObject.open();
		} catch (error) {
			console.log(error);
		}
	};

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

				<div className="flex justify-center">
					<Button onClick={processPayment}>Pay Now</Button>
				</div>
			</div>
		</div>
	);
}
