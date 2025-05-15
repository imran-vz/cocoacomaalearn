import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
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
	providers: [],
} satisfies NextAuthConfig;
