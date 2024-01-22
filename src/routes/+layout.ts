import { lockApp } from '$lib/preferences/locked';

export const ssr = false;

export const load = async () => {
	await lockApp(); // At startup, the app is locked by default
};
