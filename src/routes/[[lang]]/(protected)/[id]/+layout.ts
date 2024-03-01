import { getService } from '$lib/slangroom/services.js';

export const load = async ({ params }) => {
	const id = params['id'];
	const credential = await getService(id);
	return { credential };
};
