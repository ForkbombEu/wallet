import { get } from 'svelte/store';
import { userEmailStore } from '../+page.svelte';
import { redirect } from '@sveltejs/kit';

export const load = async () => {
	const userEmail = get(userEmailStore);
	if (!userEmail) throw redirect(303, '/login');
	return { userEmail };
};
