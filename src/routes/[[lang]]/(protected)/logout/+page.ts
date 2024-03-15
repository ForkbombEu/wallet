import { KEYPAIR_PREFERENCES_KEY } from '$lib/preferences/keypair';
import { removePreference } from '$lib/preferences';
import { redirect } from '@sveltejs/kit';
import { lockApp } from '$lib/preferences/locked';
import { r } from '$lib/i18n';
import { DID_PREFERENCES_KEY } from '$lib/preferences/did';
import { CREDENTIALS_PREFERENCES_KEY } from '$lib/preferences/signroomUser';

export const load = async () => {
	await removePreference(KEYPAIR_PREFERENCES_KEY);
	await removePreference(DID_PREFERENCES_KEY);
	await removePreference(CREDENTIALS_PREFERENCES_KEY);
	await lockApp();
	redirect(303, r('/login'));
};
