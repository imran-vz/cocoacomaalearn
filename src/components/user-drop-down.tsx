import type { Session } from "next-auth";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutButton } from "./auth/signout-button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function UserDropDown({ session }: { session: Session }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Avatar className="w-10 h-10" key={session.user?.image}>
					<AvatarImage
						src={session.user?.image || ""}
						loading="eager"
						alt={session.user?.name || ""}
					/>
					<AvatarFallback>
						{(
							session.user?.name?.slice(0, 2) ||
							session.user?.email?.slice(0, 2) ||
							"UN"
						).toUpperCase()}
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-42">
				<DropdownMenuItem>
					<SignOutButton />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
