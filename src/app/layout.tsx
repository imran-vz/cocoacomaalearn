import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";

import { auth } from "@/auth";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/navbar";

import "./globals.css";
import { Onboarding } from "@/components/onboarding";
import { checkOnboarding } from "@/actions/check-onboarding";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Cocoa Comaa",
	description: "Premium online and offline dessert making classes",
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();
	let isOnboarded = false;

	if (session?.user?.email) {
		isOnboarded = await checkOnboarding(session.user.email);
	}

	return (
		<html lang="en">
			<body className={inter.className}>
				<Toaster richColors position="top-center" />
				<Navbar />
				{session && isOnboarded === false ? (
					<main>
						<Onboarding />
					</main>
				) : (
					<main>{children}</main>
				)}
			</body>
		</html>
	);
}
