import { auth } from "@/auth";
import { SignOut } from "@/components/auth/signout-button";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import type React from "react";
import "./globals.css";

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

	return (
		<html lang="en">
			<body className={inter.className}>
				<header className="border-b py-4">
					<div className="container mx-auto px-4 flex justify-between items-center">
						<Link href="/">
							<h1 className="font-bold text-2xl text-primary">Cocoa Comaa</h1>
						</Link>
						{session ? (
							<div className="flex items-center gap-2">
								<SignOut />
							</div>
						) : null}
					</div>
				</header>
				<main>{children}</main>
			</body>
		</html>
	);
}
