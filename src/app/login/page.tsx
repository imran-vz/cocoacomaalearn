import { auth } from "@/auth";
import { LoginForm } from "@/components/auth/login-form";
import { redirect } from "next/navigation";

export default async function LoginPage() {
	const session = await auth();
	if (session) {
		redirect("/pricing");
	}

	return (
		<div className="flex min-h-[calc(100vh-65px)] w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm -mt-20">
				<LoginForm />
			</div>
		</div>
	);
}
