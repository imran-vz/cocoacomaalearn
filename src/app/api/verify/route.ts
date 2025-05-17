import { type NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { z } from "zod";

const generatedSignature = (
	razorpayOrderId: string,
	razorpayPaymentId: string,
) => {
	const keySecret = process.env.RAZORPAY_KEY_SECRET;
	if (!keySecret) {
		throw new Error(
			"Razorpay key secret is not defined in environment variables.",
		);
	}
	const sig = crypto
		.createHmac("sha256", keySecret)
		.update(`${razorpayOrderId}|${razorpayPaymentId}`)
		.digest("hex");
	return sig;
};

const verifyPaymentSchema = z.object({
	orderCreationId: z.string(),
	razorpayPaymentId: z.string(),
	razorpaySignature: z.string(),
	razorpayOrderId: z.string(),
});

export async function POST(request: NextRequest) {
	const body = await request.json();

	const { success, data } = verifyPaymentSchema.safeParse(body);

	if (!success) {
		return NextResponse.json({ error: "Invalid request" }, { status: 400 });
	}

	const signature = generatedSignature(
		data.razorpayOrderId,
		data.razorpayPaymentId,
	);
	if (signature !== data.razorpaySignature) {
		return NextResponse.json(
			{ message: "payment verification failed", isOk: false },
			{ status: 400 },
		);
	}
	return NextResponse.json(
		{ message: "payment verified successfully", isOk: true },
		{ status: 200 },
	);
}
