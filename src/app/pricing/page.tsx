import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Plans from "./plans";

export default async function PricingPage() {
	const session = await auth();

	if (!session) {
		redirect("/login");
	}

	return <Plans />;
}
