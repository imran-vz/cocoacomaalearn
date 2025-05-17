import { z } from "zod";
import { NextResponse } from "next/server";
import { getUserByEmail } from "@/db/modules/users";
import crypto from "node:crypto";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const forgotPasswordSchema = z.object({
	email: z.string().email(),
});

export async function POST(req: Request) {
	const body = await req.json();

	const { success, data } = forgotPasswordSchema.safeParse(body);

	if (!success) {
		return NextResponse.json({ error: "Invalid email" }, { status: 400 });
	}

	const [, err] = await getUserByEmail(data.email);

	if (err) {
		return NextResponse.json({ error: "User not found" }, { status: 404 });
	}

	const token = crypto.randomBytes(32).toString("hex");

	await db.update(users).set({ token }).where(eq(users.email, data.email));

	// const resetPasswordUrl = `${process.env.APP_URL}/reset-password?token=${token}`;

	// const emailContent = `
	// 	<p>Click the link below to reset your password:</p>
	// 	<a href="${resetPasswordUrl}">Reset Password</a>
	// `;

	return NextResponse.json({ message: "Email sent" }, { status: 200 });
}
