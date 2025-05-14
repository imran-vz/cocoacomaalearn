import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { SignIn } from "./signin-button";

export function SignupForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<form>
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
						<h1 className="text-xl font-bold">Create your account</h1>
						<div className="text-center text-sm">
							Already have an account?{" "}
							<Link href="/login" className="underline underline-offset-4">
								Login
							</Link>
						</div>
					</div>
					<div className="flex flex-col gap-6">
						<div className="grid gap-2">
							<Label htmlFor="name">Name</Label>
							<Input id="name" type="text" placeholder="John Doe" required />
						</div>
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="m@example.com"
								required
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								placeholder="••••••••"
								required
							/>
						</div>
						<Button type="submit" className="w-full">
							Sign up
						</Button>
					</div>
					<div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
						<span className="relative z-10 bg-background px-2 text-muted-foreground">
							Or
						</span>
					</div>
				</div>
			</form>
			<div className="grid gap-4 sm:grid-cols-2">
				<SignIn />
			</div>
		</div>
	);
}
