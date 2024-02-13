import fakeCredentials from '$lib/fakeCredentials.js';
import { getService } from '$lib/slangroom/services.js';

export const load = async ({ params }) => {
	const id = params['id'];
	if (id.length < 3) {
		const credential = fakeCredentials.find((c) => c.id === id);
		return { credential };
	}
	const credential = await getService(id);
	return { credential };
};
