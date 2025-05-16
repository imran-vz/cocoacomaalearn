import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { z } from "zod";

import { authConfig } from "./auth.config";
import { getUserByEmail } from "./db/modules/users";

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
				const [user, err] = await getUserByEmail(parsedCredentials.data.email);
				if (err) {
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

				return {
					email: user.email,
					name: user.name,
					id: user.id,
					image: user.profilePicture,
				};
			},
		}),
	],
});
