import { getLogsPreference } from '$lib/preferences/logs.js';

export const load = async () => {
	const logs = await getLogsPreference() || [];
	return { logs };
};
