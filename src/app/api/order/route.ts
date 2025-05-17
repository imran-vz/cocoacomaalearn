import Razorpay from "razorpay";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const razorpay = new Razorpay({
	key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
	key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrderSchema = z.object({
	amount: z.coerce.string(),
	currency: z.string(),
});

export async function POST(request: NextRequest) {
	const body = await request.json();

	const { success, data, error } = createOrderSchema.safeParse(body);

	if (!success) {
		return NextResponse.json(
			{ status: "error", message: "Invalid request", error },
			{ status: 400 },
		);
	}

	const options = {
		amount: data.amount,
		currency: data.currency,
		receipt: "rcp1",
	};

	const order = await razorpay.orders.create(options);
	return NextResponse.json({ orderId: order.id }, { status: 200 });
}
