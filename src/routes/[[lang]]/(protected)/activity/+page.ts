import { getCredentialsPreference } from '$lib/preferences/credentials.js';
import { getActivities, getParsedActivities } from '$lib/preferences/activity';

export const _activityKey = 'load:activities';

export const load = async ({ depends }) => {
	depends(_activityKey);
	const activities = await getParsedActivities()
	return { activities };
};
