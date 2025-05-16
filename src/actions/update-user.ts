"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function updateUser(
	userID: string,
	user: { name: string; phone: string },
) {
	await db
		.update(users)
		.set({
			name: user.name,
			phone: user.phone,
		})
		.where(eq(users.id, userID));
}
