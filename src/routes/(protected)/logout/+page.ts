import { KEYPAIR_PREFERENCES_KEY } from '$lib/preferences/keypair';
import { removePreference } from '$lib/preferences';
import { redirect } from '@sveltejs/kit';

export const load = async () => {
	await removePreference(KEYPAIR_PREFERENCES_KEY);
	throw redirect(303, '/login');
};
