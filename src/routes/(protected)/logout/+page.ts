import { KEYRING_PREFERENCES_KEY } from '$lib/keypairoom';
import { removePreference } from '$lib/preferences/prefereces';
import { redirect } from '@sveltejs/kit';

export const load = async () => {
	await removePreference(KEYRING_PREFERENCES_KEY);
	throw redirect(303, '/register');
};
