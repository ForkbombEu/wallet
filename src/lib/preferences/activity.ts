import { getStructuredPreferences, setStructuredPreferences } from '.';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { getCredentialsPreference } from './credentials';
import type { Credential } from '$lib/preferences/credentials';
import { setNewActivitiesInHome } from '$lib/homeFeedbackPreferences';
import { invalidate } from '$app/navigation';
import { _protectedLayoutKey } from '../../routes/[[lang]]/(protected)/+layout';
import type { Logo } from '$lib/utils/types';
import { m } from '$lib/i18n';

dayjs.extend(relativeTime);

export type IssuedCredential = {
	type: 'credential';
	id: number;
};

export type NotIssuedCredential = {
	type: 'notIssuedCredential';
	name: string;
	logo: Logo;
	description: string;
	issuer: string;
	displayName: string;
};

export type Verification = {
	type: 'verification';
	verifier_name: string;
	success: boolean;
	properties: string[];
	logo: Logo;
};

export type ExpiredCredential = {
	type: 'expired';
	id: number;
};

export type Activity = {
	at: number;
	read?: boolean;
} & (IssuedCredential | Verification | ExpiredCredential | NotIssuedCredential);

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

export async function addVerificationActivity(sid: string, success: boolean, verifierUrl: string | null, properties: string[] = []) {
	const at = dayjs().unix();
	await addActivity({
		type: 'verification',
		verifier_name: verifierUrl || '',
		success,
		properties: properties,
		at,
		logo: {uri: '', alt_text: verifierUrl || ''}
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
	function parseCredentialActivity(parsedActivity: ParsedActivity, activity: Extract<Activity, IssuedCredential | ExpiredCredential>) {
		const credential = findCredentialById(activity.id);
		if (!credential) {
			return;
		}
		parsedActivity.name = credential.display_name;
		parsedActivity.logo = credential.logo;
		parsedActivity.description = credential.description;
		parsedActivity.credential = credential;
		return credential;
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

		switch (activity.type) {
			case 'credential':
				const issuedCredential = parseCredentialActivity(parsedActivity, activity);
				if (!issuedCredential) return;
				parsedActivity.message = m.issued_to_you({iss: issuedCredential.issuer, name: issuedCredential.display_name});
				break;
			case 'expired':
				const expiredCredential = parseCredentialActivity(parsedActivity, activity);
				if (!expiredCredential) return;
				parsedActivity.message = `${expiredCredential.display_name} ${m.is_expired()}`;
				break;
			case 'notIssuedCredential':
				parsedActivity.name = activity.name;
				parsedActivity.logo = activity.logo;
				parsedActivity.description = activity.description;
				parsedActivity.message = m.fail_to_issue_to_you({iss: activity.issuer, name: activity.displayName});
				break;
			case 'verification':
				const { verifier_name, properties } = activity;
				parsedActivity.name = activity.verifier_name;
				parsedActivity.logo = activity.logo;
				parsedActivity.message = m.You_send_to_verification_via_and_result_is({ properties: properties.join(','), rp_name: verifier_name.split('//')[1].split('/')[0], result: activity.success ? m.successful() : m.failed() });
				parsedActivity.description = verifier_name;
				break;
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
