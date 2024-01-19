import { getKeypairPreference } from '$lib/preferences/keypair';
import { redirect } from '@sveltejs/kit';

export const load = async () => {
	const keypair = await getKeypairPreference();
	if (!Boolean(keypair)) throw redirect(303, '/login');
};
