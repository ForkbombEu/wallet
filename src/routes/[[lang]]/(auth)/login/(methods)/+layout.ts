import { get } from 'svelte/store';
import { redirect } from '@sveltejs/kit';
import { userEmailStore } from '../_lib';
import { r } from '$lib/i18n';

export const load = async () => {
	const userEmail = get(userEmailStore);
	if (!userEmail) redirect(303, r('/login'));
	return { userEmail };
};
