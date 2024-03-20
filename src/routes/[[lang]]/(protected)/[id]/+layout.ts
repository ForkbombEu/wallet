import { getCredentialPreference } from '$lib/preferences/credentials.js';
import { getService } from '$lib/slangroom/services.js';

export const load = async ({ params }) => {
	const id = params['id'];
	const credential = await getCredentialPreference(id);
	return { credential };
};
