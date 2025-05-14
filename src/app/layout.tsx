import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Sweet Creations - Dessert Classes",
	description: "Premium online and offline dessert making classes",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<header className="border-b py-4">
					<div className="container mx-auto px-4 flex justify-between items-center">
						<Link href="/">
							<h1 className="font-bold text-2xl text-primary">
								SweetCreations
							</h1>
						</Link>
					</div>
				</header>
				<main>{children}</main>
			</body>
		</html>
	);
}
