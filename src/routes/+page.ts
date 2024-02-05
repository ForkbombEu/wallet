import { r } from '$lib/i18n';
import { redirect } from '@sveltejs/kit';

export const load = async () => {
	redirect(303, r('/home'));
};
