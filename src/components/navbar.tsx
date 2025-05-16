import { auth } from "@/auth";
import Link from "next/link";
import { UserDropDown } from "./user-drop-down";

export async function Navbar() {
	const session = await auth();

	return (
		<header className="border-b py-4">
			<div className="container mx-auto px-4 flex justify-between items-center">
				<Link href="/">
					<h1 className="font-bold text-2xl text-primary">Cocoa Comaa</h1>
				</Link>

				{session ? <UserDropDown session={session} /> : null}
			</div>
		</header>
	);
}
