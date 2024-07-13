import { log } from '$lib/log';
import type { HandleClientError } from '@sveltejs/kit';


export const handleError: HandleClientError = async ({ error, event, status, message }) => {
	await log(String(error))
    await log(JSON.stringify(event))
    await log(JSON.stringify(status));
    await log(message)

	return {
		message,
		status,
		event,
		error
	};
};
