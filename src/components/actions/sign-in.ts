"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function signInToGoogleAction() {
	await signIn("google", { redirectTo: "/pricing" });
}

export async function signInWithCredentials(formData: FormData) {
	const email = formData.get("email");
	const password = formData.get("password");

	if (!email || !password) {
		return { error: "Email and password are required" };
	}
	try {
		await signIn("credentials", { email, password, redirect: false });
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return "Invalid credentials.";
				default:
					return "Something went wrong.";
			}
		}

		console.error(error);
		return "Invalid email or password";
	}
}
