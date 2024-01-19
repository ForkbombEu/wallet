import { KEYRING_PREFERENCES_KEY } from '$lib/utils/constants';
import { removePreference } from '$lib/preferences';
import { redirect } from '@sveltejs/kit';

export const load = async () => {
	await removePreference(KEYRING_PREFERENCES_KEY);
	throw redirect(303, '/login');
};
