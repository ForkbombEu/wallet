import { getStructuredPreferences, setStructuredPreferences } from '.';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { getCredentialsPreference } from './credentials';
import type { Credential } from '$lib/preferences/credentials';
import { setNewActivitiesInHome } from '$lib/homeFeedbackPreferences';
import { invalidate } from '$app/navigation';
import { _protectedLayoutKey } from '../../routes/[[lang]]/(protected)/+layout';
import type { Info } from '$lib/components/organisms/scanner/tools';
import { filesUri } from '$lib/backendUri';
import type { Logo } from '$lib/utils/types';

dayjs.extend(relativeTime);

export type IssuedCredential = {
	type: 'credential';
	id: number;
};

export type Verification = {
	type: 'verification';
	verifier_name: string;
	success: boolean;
	rp_name: string;
	sid: string;
	properties: string[];
	avatar: { id: string; collection: string; fileName: string };
};

export type ExpiredCredential = {
	type: 'expired';
	id: number;
};

export type Activity = {
	at: number;
	read?: boolean;
} & (IssuedCredential | Verification | ExpiredCredential);

export type ParsedActivity = {
	name: string;
	logo: Logo;
	description: string;
	date: string;
	message: string;
	credential?: Credential;
	read?: boolean;
	at: number;
};

export const ACTIVITY_PREFERENCES_KEY = 'activity';

export async function getNotReadedActivities() {
	const activities = await getActivities();
	if (!activities) return;
	return activities.filter((activity) => !activity.read).length || undefined;
}

export async function addActivity(activity: Activity) {
	const activities = await getActivities();
	const at = dayjs().unix();
	if (activities) {
		activities.push({ ...activity, at });
		await setStructuredPreferences(ACTIVITY_PREFERENCES_KEY, activities);
		const unreads = await getNotReadedActivities();
		if (unreads) {
			await setNewActivitiesInHome({ count: unreads, seen: false });
		}
		invalidate(_protectedLayoutKey);
		return;
	}
	await setStructuredPreferences(ACTIVITY_PREFERENCES_KEY, [{ ...activity, at }]);
	setNewActivitiesInHome({ count: 1, seen: false });
	invalidate(_protectedLayoutKey);
}

export async function addVerificationActivity(sid: string, info: Info, success: boolean) {
	const at = dayjs().unix();
	const { asked_claims, avatar } = info;
	const { properties } = asked_claims;
	const propertiesArray = Object.values(properties).map((property) => property.title);
	await addActivity({
		type: 'verification',
		verifier_name: info.verifier_name,
		avatar,
		success,
		rp_name: info.rp_name,
		sid,
		properties: propertiesArray,
		at
	});
}

export async function getActivities(): Promise<Activity[] | undefined> {
	return await getStructuredPreferences(ACTIVITY_PREFERENCES_KEY);
}

export async function getParsedActivities(): Promise<ParsedActivity[]> {
	const activities = (await getActivities()) || [];
	const credentials = (await getCredentialsPreference()) || [];
	function findCredentialById(id: number) {
		return credentials?.find((cred) => cred.id === id);
	}

	function formatActivity(activity: Activity) {
		let parsedActivity: ParsedActivity = {
			name: '',
			logo: { uri: '', alt_text: '' },
			description: '',
			date: '',
			message: '',
			at: 0,
			read: false
		};
		parsedActivity.date = dayjs().to(dayjs.unix(activity.at));
		parsedActivity.at = activity.at;
		parsedActivity.read = activity.read;

		if (activity.type === 'credential' || activity.type === 'expired') {
			const credential = findCredentialById(activity.id);
			if (!credential) {
				return;
			}
			parsedActivity.name = credential.display_name;
			parsedActivity.logo = credential.logo;
			parsedActivity.description = credential.description;
			parsedActivity.credential = credential;
			if (activity.type === 'credential') {
				parsedActivity.message = `${credential.issuer} issued ${credential.display_name} to you`;
			} else {
				parsedActivity.message = `${credential.display_name} is expired`;
			}
		} else if (activity.type === 'verification') {
			const { verifier_name, success, rp_name, properties, avatar } = activity;
			parsedActivity.name = verifier_name;

			if (avatar) {
				parsedActivity.logo = {
					uri: filesUri(avatar.fileName, avatar.collection, avatar.id),
					alt_text: verifier_name
				};
			}
			parsedActivity.message = `${verifier_name} verified yours: ${properties.join(', ')} via ${rp_name} and it was a ${
				success ? 'success' : 'failure'
			}`;
		}
		return parsedActivity;
	}

	return activities
		.reverse()
		.map(formatActivity)
		.filter((activity): activity is ParsedActivity => Boolean(activity));
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

export async function setActivityAsRead(at: number) {
	const activities = await getActivities();
	if (!activities) return;
	const newActivities = activities.map((activity) => {
		if (activity.at === at) {
			return { ...activity, read: true };
		}
		return activity;
	});
	await setStructuredPreferences(ACTIVITY_PREFERENCES_KEY, newActivities);
}

export async function setAllActivitiesAsRead() {
	const activities = await getActivities();
	if (!activities) return;
	const newActivities = activities.map((activity) => {
		return { ...activity, read: true };
	});
	await setStructuredPreferences(ACTIVITY_PREFERENCES_KEY, newActivities);
}

export const addExpiredCredentialActivity = async (credentialId: number) => {
	const activities = await getActivities();
	if (activities?.find((activity) => activity.type === 'expired' && activity.id === credentialId))
		return;
	await addActivity({ type: 'expired', id: credentialId, at: dayjs().unix() });
};
