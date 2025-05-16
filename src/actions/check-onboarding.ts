import { getUserByEmail } from "@/db/modules/users";

export async function checkOnboarding(email: string) {
	const [user, err] = await getUserByEmail(email);

	if (err) {
		return false;
	}

	return user?.phone !== null && user?.name !== null;
}
