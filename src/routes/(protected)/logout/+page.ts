import { KEYPAIR_PREFERENCES_KEY } from '$lib/preferences/keypair';
import { removePreference } from '$lib/preferences';
import { redirect } from '@sveltejs/kit';
import { lockApp } from '$lib/preferences/locked';

export const load = async () => {
	await removePreference(KEYPAIR_PREFERENCES_KEY);
	await lockApp();
	throw redirect(303, '/login');
};
