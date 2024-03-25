import { get } from 'svelte/store';
import { redirect } from '@sveltejs/kit';
import { userEmailStore } from '../_lib';
import { r } from '$lib/i18n';

export const load = async () => {
	const store = get(userEmailStore)
	const {email:userEmail, registration} = store;
	if (!userEmail) redirect(303, r('/login'));
	return { userEmail, registration };
};
