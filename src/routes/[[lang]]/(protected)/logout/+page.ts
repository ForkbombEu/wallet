import { redirect } from '@sveltejs/kit';
import { lockApp } from '$lib/preferences/locked';
import { r } from '$lib/i18n';
import { logout } from '$lib/preferences/logout';

export const load = async () => {
	await logout();
	await lockApp();
	redirect(303, r('/register-login'));
};
