import { redirect } from '@sveltejs/kit';
import { r } from '$lib/i18n';
import { logout } from '$lib/preferences/logout';

export const load = async () => {
	await logout();
	redirect(303, r('/register-login'));
};
