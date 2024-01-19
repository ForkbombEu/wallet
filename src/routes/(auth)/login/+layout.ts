import { KEYRING_PREFERENCES_KEY } from '$lib/utils/constants';
import { getPreference } from '$lib/preferences';
import { redirect } from '@sveltejs/kit';

export const load = async () => {
	// const keyring = await getPreference(KEYRING_PREFERENCES_KEY);
	// if (Boolean(keyring)) throw redirect(303, '/wallet');
	/**
	 * Note
	 * Temporairly commenting this, as it disrupts the user flow in /login
	 * See note in /login/questions
	 */
};
