import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { db } from "./db";
import { usersTable } from "./db/schema";

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Google,
		Credentials({
			credentials: {
				email: { label: "Email" },
				password: { label: "Password", type: "password" },
			},
			async authorize({ email, password }) {
				const [user] = await db
					.select({
						id: usersTable.id,
						email: usersTable.email,
						profilePicture: usersTable.profilePicture,
						password: usersTable.password,
					})
					.from(usersTable)
					.where(eq(usersTable.email, email as string))
					.limit(1);

				if (!user) return null;

				if (user.password !== password) return null;

				// biome-ignore lint/suspicious/noExplicitAny: Remove password from response
				(user as any).password = undefined;
				return user;
			},
		}),
	],
	pages: {
		signIn: "/login",
	},

	callbacks: {
		signIn: async ({ profile, account }) => {
			if (profile?.email_verified && profile.email) {
				const [user] = await db
					.select()
					.from(usersTable)
					.where(eq(usersTable.email, profile.email))
					.limit(1);

				if (!user) {
					await db.insert(usersTable).values({
						email: profile.email,
						name: profile.name,
						profilePicture: profile.profile,
						provider: account?.provider,
						role: "user",
						emailVerified: true,
					});
				}

				return true;
			}

			return true;
		},
	},
});
