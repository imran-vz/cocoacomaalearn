import { getUserByEmail } from "@/db/modules/users";
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const resetPasswordSchema = z
	.object({
		email: z.string().email(),
		password: z.string().min(8),
		confirmPassword: z.string().min(8),
		token: z.string(),
	})
	.superRefine((data, ctx) => {
		if (data.password !== data.confirmPassword) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Passwords do not match",
			});
		}
	});

export async function POST(req: Request) {
	const body = await req.json();

	const { success, data } = resetPasswordSchema.safeParse(body);

	if (!success) {
		return NextResponse.json({ error: "Invalid email" }, { status: 400 });
	}

	const [user, err] = await getUserByEmail(data.email);

	if (err) {
		return NextResponse.json({ error: "User not found" }, { status: 404 });
	}

	if (user.token !== data.token) {
		return NextResponse.json({ error: "Invalid token" }, { status: 401 });
	}

	if (user.token === null) {
		return NextResponse.json({ error: "Token expired" }, { status: 401 });
	}

	const hashedPassword = await bcrypt.hash(data.password, 10);

	await db
		.update(users)
		.set({ password: hashedPassword, token: null })
		.where(eq(users.id, user.id));

	return NextResponse.json(
		{ message: "Password reset successful" },
		{ status: 200 },
	);
}
