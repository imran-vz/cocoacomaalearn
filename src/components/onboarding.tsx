import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { OnboardingForm } from "./onboarding-form";
import { Separator } from "./ui/separator";

export async function Onboarding() {
	const session = await auth();

	if (!session || !session.user?.email) {
		redirect("/");
	}

	const user = await db.query.users.findFirst({
		where: eq(users.email, session.user?.email),
	});

	return (
		<div className="container mx-auto px-4 py-6 max-w-4xl">
			<h1 className="text-4xl font-bold mb-2">Onboarding</h1>

			<Separator className="my-4" />

			<OnboardingForm
				key={user?.id}
				userID={user?.id ?? ""}
				user={{ name: user?.name ?? null, phone: user?.phone ?? null }}
			/>
		</div>
	);
}
