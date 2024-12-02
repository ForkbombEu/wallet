import { getUser } from '$lib/preferences/user';

export const load = async () => {
	const user = await getUser();
	return { user };
};
