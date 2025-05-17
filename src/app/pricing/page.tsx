import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Plans from "./plans";
import Script from "next/script";

export default async function PricingPage() {
	const session = await auth();

	if (!session) {
		redirect("/login");
	}

	return (
		<>
			<Script
				id="razorpay-checkout-js"
				src="https://checkout.razorpay.com/v1/checkout.js"
			/>
			<Plans session={session} />
		</>
	);
}
