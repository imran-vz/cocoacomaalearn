import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { z } from "zod";
import { authConfig } from "./auth.config";
import { db } from "./db";
import { usersTable } from "./db/schema";

async function getUser(email: string) {
	try {
		const [user] = await db
			.select({
				id: usersTable.id,
				email: usersTable.email,
				profilePicture: usersTable.profilePicture,
				password: usersTable.password,
			})
			.from(usersTable)
			.where(eq(usersTable.email, email))
			.limit(1);

		if (!user) return null;

		return user;
	} catch (error) {
		console.error("Failed to fetch user:", error);
		throw new Error("Failed to fetch user.");
	}
}
export const { handlers, signIn, signOut, auth } = NextAuth({
	...authConfig,
	providers: [
		Google,
		Credentials({
			credentials: {
				email: { label: "Email" },
				password: { label: "Password", type: "password" },
			},
			async authorize({ email, password }) {
				const parsedCredentials = z
					.object({ email: z.string().email(), password: z.string().min(6) })
					.safeParse({ email, password });

				if (!parsedCredentials.success) return null;
				const user = await getUser(parsedCredentials.data.email);
				if (!user) {
					console.log("User not found");
					return null;
				}
				if (!user.password) {
					console.log("User has no password");
					return null;
				}
				const passwordMatch = await bcrypt.compare(
					parsedCredentials.data.password,
					user.password,
				);
				if (!passwordMatch) {
					console.log("Password does not match");
					return null;
				}

				// biome-ignore lint/suspicious/noExplicitAny: Remove password from response
				(user as any).password = undefined;

				return user;
			},
		}),
	],
});
