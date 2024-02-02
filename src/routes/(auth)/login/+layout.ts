import { getKeypairPreference } from '$lib/preferences/keypair';
import { getPreference } from '$lib/preferences';
import { redirect } from '@sveltejs/kit';

export const load = async () => {
	// const keypair = await getKeypairPreference();
	// if (Boolean(keypair)) redirect(303, '/wallet');
	/**
	 * Note
	 * Temporairly commenting this, as it disrupts the user flow in /login
	 * See note in /login/questions
	 */
};
