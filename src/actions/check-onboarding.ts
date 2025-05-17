import { signOut } from "@/auth";
import { getUserByEmail } from "@/db/modules/users";

export async function checkOnboarding(email: string) {
	const [user, err] = await getUserByEmail(email);

	if (err) {
		await signOut().catch((err) => {
			console.error(err);
		});
		return false;
	}

	return user?.phone !== null && user?.name !== null;
}
