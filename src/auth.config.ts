import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { NextAuthConfig } from "next-auth";
import { getUserByEmail } from "./db/modules/users";

export const authConfig = {
	pages: {
		signIn: "/login",
	},

	callbacks: {
		signIn: async ({ profile, account }) => {
			if (profile?.email_verified && profile.email) {
				const user = await getUserByEmail(profile.email);

				if (!user) {
					await db.insert(users).values({
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
