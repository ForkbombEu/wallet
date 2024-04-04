import { clearPreferences } from '$lib/preferences';
import { redirect } from '@sveltejs/kit';
import { lockApp } from '$lib/preferences/locked';
import { r } from '$lib/i18n';
import { DID_PREFERENCES_KEY } from '$lib/preferences/did';

export const load = async () => {
	await clearPreferences();
	await lockApp();
	redirect(303, r('/register-login'));
};
