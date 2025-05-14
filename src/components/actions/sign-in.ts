"use server";

import { signIn } from "@/auth";

export async function signInToGoogleAction() {
	await signIn("google", { redirectTo: "/pricing" });
}
