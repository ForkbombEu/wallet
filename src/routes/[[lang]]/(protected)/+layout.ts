import { r } from '$lib/i18n';
import { getKeypairPreference } from '$lib/preferences/keypair';
import { isAppLocked, lockApp } from '$lib/preferences/locked.js';
import { redirect } from '@sveltejs/kit';

export const load = async () => {
	const keypair = await getKeypairPreference();
	if (!keypair) redirect(303, r('/login'));

	const isLocked = await isAppLocked();
	if (isLocked) redirect(303, r('/unlock'));
	else await lockApp(); // Locking back after the user has got in
};
