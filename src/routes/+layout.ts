import { setLockedPreference } from '$lib/preferences/locked';

export const ssr = false;

export const load = async () => {
	await setLockedPreference(true); // At startup, the app is locked by default
};
