"use client";

import { Eye, EyeOff, GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { SignIn } from "./signin-button";
import { signInWithCredentials } from "../../actions/sign-in";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const passwordRegex =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const loginSchema = z.object({
	email: z.string().email(),
	password: z
		.string()
		.min(8)
		.max(30)
		.superRefine((val, ctx) => {
			if (val.length === 0) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Password is required",
				});
			}

			if (!passwordRegex.test(val)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message:
						"Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one special character",
				});
			}
		}),
});

export function LoginForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	const router = useRouter();
	const [fieldType, setFieldType] = useState<"text" | "password">("password");
	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: z.infer<typeof loginSchema>) => {
		const formData = new FormData();
		formData.append("email", data.email);
		formData.append("password", data.password);
		try {
			const result = await signInWithCredentials(formData);
			if (result) {
				console.error(result);
				toast.error(result);
				return;
			}

			router.push("/pricing");
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className="flex flex-col gap-6">
						<div className="flex flex-col items-center gap-2">
							<Link
								href="#"
								className="flex flex-col items-center gap-2 font-medium"
							>
								<div className="flex h-8 w-8 items-center justify-center rounded-md">
									<GalleryVerticalEnd className="size-6" />
								</div>
								<span className="sr-only">Cocoa Comaa</span>
							</Link>
							<h1 className="text-xl font-bold">Welcome to Cocoa Comaa</h1>
							<div className="text-center text-sm">
								Don&apos;t have an account?{" "}
								<Link href="/signup" className="underline underline-offset-4">
									Sign up
								</Link>
							</div>
						</div>
						<div className="flex flex-col gap-6">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												id="email"
												required
												placeholder="me@example.com"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl className="">
											<div className="relative ">
												<Input
													id="password"
													required
													placeholder="********"
													type={fieldType}
													{...field}
												/>
												<Button
													variant="ghost"
													size="icon"
													className="absolute right-2 top-1/2 -translate-y-1/2"
													onClick={() =>
														setFieldType(
															fieldType === "text" ? "password" : "text",
														)
													}
												>
													{fieldType === "text" ? <Eye /> : <EyeOff />}
												</Button>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button type="submit" className="w-full">
								Login
							</Button>
						</div>
						<div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
							<span className="relative z-10 bg-background px-2 text-muted-foreground">
								Or
							</span>
						</div>
					</div>
				</form>
			</Form>

			<div className="grid gap-4 sm:grid-cols-2">
				<SignIn />
			</div>
		</div>
	);
}
