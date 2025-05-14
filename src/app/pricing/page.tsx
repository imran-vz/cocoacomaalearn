import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Plans from "./plans";

export default async function PricingPage() {
	const session = await auth();
	console.log(" :7 | PricingPage | session:", session);

	if (!session) {
		redirect("/login");
	}

	return <Plans />;
}
