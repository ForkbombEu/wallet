import { getService } from '$lib/slangroom/services.js';

export const load = async ({ params }) => {
	const credential = await getService(params.id);
	return { credential };
};
