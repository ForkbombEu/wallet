import { getStructuredPreferences, setStructuredPreferences } from '.';
import dayjs from 'dayjs';

export type IssuedCredential = {
    type: 'credential',
    id: number;
}

export type Verification = {
	type: 'verification';
	verifier_name: string;
	success: boolean;
	rp_name: string;
    sid: string;
    properties: string[];
};

export type ExpiredCredential = {
    type: 'expired';
    id: number;
};

export type Activity = {
	at: number;
} & (IssuedCredential | Verification | ExpiredCredential);

export const ACTIVITY_PREFERENCES_KEY = 'activity';

export async function addActivity(activity: Activity) {
    const activities = await getActivities();
    const at = dayjs().unix();
    if (activities) {
        activities.push({ ...activity, at });
        await setStructuredPreferences(ACTIVITY_PREFERENCES_KEY, activities);
        return;
    }
    await setStructuredPreferences(ACTIVITY_PREFERENCES_KEY, [{ ...activity, at }]);
}

export async function getActivities(): Promise<Activity[] | undefined> {
    return await getStructuredPreferences(ACTIVITY_PREFERENCES_KEY);
}

export async function clearActivities() {
    await setStructuredPreferences(ACTIVITY_PREFERENCES_KEY, []);
}


export async function removeActivities(at: number[]) {
    const activities = await getActivities();
    if (!activities) return;
    const newActivities = activities.filter((activity) => !at.includes(activity.at));
    await setStructuredPreferences(ACTIVITY_PREFERENCES_KEY, newActivities);
}