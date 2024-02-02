import { get } from 'svelte/store';
import { redirect } from '@sveltejs/kit';
import { userEmailStore } from '../_lib';

export const load = async () => {
	const userEmail = get(userEmailStore);
	if (!userEmail) redirect(303, '/login');
	return { userEmail };
};
