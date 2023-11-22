import { getPreference } from '$lib/preferences/prefereces';
import { redirect } from '@sveltejs/kit';

export const load = async () => {
	if (!Boolean(await getPreference('keyring'))) throw redirect(303, '/login');
};
