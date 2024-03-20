import { getCredentialPreference } from '$lib/preferences/credentials.js';

export const load = async ({ params }) => {
	const id = params['id'];
	const credential = await getCredentialPreference(id);
	return { credential };
};
