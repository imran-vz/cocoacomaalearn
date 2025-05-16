"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { updateUser } from "@/actions/update-user";
import { toast } from "sonner";
import { PhoneNumberFormat, PhoneNumberUtil } from "google-libphonenumber";

const phoneUtil = PhoneNumberUtil.getInstance();

const onboardingSchema = z.object({
	name: z.string().min(3, { message: "Name must be at least 3 characters" }),
	phone: z
		.string()
		.refine((phone) => phoneUtil.isValidNumber(phoneUtil.parse(phone, "IN")), {
			message: "Invalid phone number",
		}),
});

export function OnboardingForm({
	user,
	userID,
}: {
	userID: string;
	user: { name: string | null; phone: string | null } | null;
}) {
	const form = useForm<z.infer<typeof onboardingSchema>>({
		resolver: zodResolver(onboardingSchema),
		defaultValues: {
			name: user?.name ?? "",
			phone: user?.phone ?? "",
		},
	});

	const onSubmit = async (data: z.infer<typeof onboardingSchema>) => {
		try {
			const phoneNumber = phoneUtil.parse(data.phone, "IN");
			const phone = phoneNumber.getNationalNumber();
			if (!phone) {
				throw new Error("Invalid phone number");
			}
			await updateUser(userID, {
				name: data.name,
				phone: phoneUtil.format(phoneNumber, PhoneNumberFormat.E164),
			});
			window.location.reload();
		} catch (error) {
			console.error(error);
			if (error instanceof Error) {
				toast.error(error.message || "Failed to update user");
			} else {
				toast.error("Failed to update user");
			}
		}
	};

	return (
		<div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="phone"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Phone</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" className="w-full">
						Submit
					</Button>
				</form>
			</Form>
		</div>
	);
}
