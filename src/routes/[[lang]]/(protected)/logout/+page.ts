import { KEYPAIR_PREFERENCES_KEY } from '$lib/preferences/keypair';
import { removePreference } from '$lib/preferences';
import { redirect } from '@sveltejs/kit';
import { lockApp } from '$lib/preferences/locked';
import { r } from '$lib/i18n';

export const load = async () => {
	await removePreference(KEYPAIR_PREFERENCES_KEY);
	await lockApp();
	redirect(303, r('/login'));
};
