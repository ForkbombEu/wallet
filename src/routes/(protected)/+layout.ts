import { isAlreadyBoarded } from '$lib/components/onBoarding/utils';
import { getKeypairPreference } from '$lib/preferences/keypair';
import { isAppLocked, lockApp } from '$lib/preferences/locked.js';
import { redirect } from '@sveltejs/kit';

export const load = async () => {
	const boarded = await isAlreadyBoarded
	if (!(Boolean(boarded))) throw redirect(303, '/on-boarding');
	const keypair = await getKeypairPreference();
	if (!Boolean(keypair)) throw redirect(303, '/login');

	const isLocked = await isAppLocked();
	if (isLocked) throw redirect(303, '/unlock');
	else await lockApp(); // Locking back after the user has got in
};
