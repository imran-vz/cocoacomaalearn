import { db } from "@/db";
import { users } from "@/db/schema";
import type { NextAuthConfig } from "next-auth";
import { getUserByEmail } from "./db/modules/users";
import redis from "./db/cache";

export const authConfig = {
	pages: {
		signIn: "/login",
	},

	callbacks: {
		signIn: async ({ profile, account }) => {
			if (profile?.email_verified && profile.email) {
				const [, err] = await getUserByEmail(profile.email);

				console.log(" :27 | awaitdb.insert | profile:", profile);
				if (err) {
					await db.insert(users).values({
						email: profile.email,
						name: profile.name,
						profilePicture: profile.picture,
						provider: account?.provider,
						role: "user",
						emailVerified: true,
					});
				}

				return true;
			}

			return true;
		},
		async session(sessionArgs) {
			const session = sessionArgs.session;

			let isOnboarded = await redis.get<boolean>(
				`onboarding:${session.user.id}`,
			);

			if (!isOnboarded) {
				const [user, err] = await getUserByEmail(session.user.email);
				if (err) {
					console.error(err);
				} else {
					isOnboarded = user?.phone !== null && user?.name !== null;
				}
				await redis.set(`onboarding:${session.user.id}`, isOnboarded ?? false);
			}

			session.user.onboarded = isOnboarded ?? false;

			return session;
		},
	},
	providers: [],
} satisfies NextAuthConfig;
