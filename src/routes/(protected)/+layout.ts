import { getKeypairPreference } from '$lib/preferences/keypair';
import { isAppLocked, lockApp } from '$lib/preferences/locked.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ parent }) => {
	const keypair = await getKeypairPreference();
	if (!Boolean(keypair)) throw redirect(303, '/login');

	await parent(); // We need to wait for the root layout to set the 'locked' preference
	const isLocked = await isAppLocked();
	if (isLocked) throw redirect(303, '/unlock');
	else await lockApp(); // Locking back after the user has got in
};
