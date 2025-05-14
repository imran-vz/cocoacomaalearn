"use server";

import { signIn } from "@/auth";

export async function signInWithCredentials(formData: FormData) {
	const email = formData.get("email");
	const password = formData.get("password");

	if (!email || !password) {
		return { error: "Email and password are required" };
	}
	try {
		await signIn("credentials", {
			email,
			password,
			redirectTo: "/pricing",
		});
	} catch (error) {
		console.error(error);
		return { error: "Invalid email or password" };
	}
}
