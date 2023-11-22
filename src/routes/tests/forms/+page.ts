import { PUBLIC_BACKEND_URL } from '$env/static/public';

export const load = async ({ fetch }) => {
	const res = await fetch(`${PUBLIC_BACKEND_URL}/api/collections/templates/records`);
	const templates = await res.json();
	return { templates };
};
