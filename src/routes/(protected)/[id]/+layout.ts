import { getService } from '$lib/slangroom/services.js';

export const load = async ({ params }) => {
	const credential = getService(params.id)
	return {credential};
};