import { KEYRING_PREFERENCES_KEY } from '$lib/keypairoom';
import { getPreference } from '$lib/preferences/prefereces';
import { redirect } from '@sveltejs/kit';

export const load = async () => {
	const keyring = await getPreference(KEYRING_PREFERENCES_KEY);
	if (!Boolean(keyring)) throw redirect(303, '/auth');
};
