import { getServices } from '$lib/slangroom/services';

export const load = async () => {
	const services = await getServices();
	return { services };
};
