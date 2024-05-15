import { getCredentialsPreference } from '$lib/preferences/credentials.js';
import { getActivities } from "$lib/preferences/activity";

export const load = async ()=> {
    const activities = await getActivities();
    const credentials = await getCredentialsPreference();
    return { activities, credentials };
}

