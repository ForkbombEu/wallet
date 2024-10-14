import { invalidate } from '$app/navigation';
import { _protectedLayoutKey } from '../routes/[[lang]]/(protected)/+layout';
import { getStructuredPreferences, setStructuredPreferences } from './preferences';
import type { Feedback } from './utils/types';

const HOME_FEEDBACK_KEY = 'homeFeedback';

export type HomeFeedbackContent = {
	count: number;
	seen: boolean;
};

export type HomeFeedbackRecord = {
	newActivities?: HomeFeedbackContent;
	expiredCredentials?: HomeFeedbackContent;
};

export type HomeFeedbackType = 'newActivities' | 'expiredCredentials';

export type HomeFeedbacksList = {
	type: HomeFeedbackType;
	content: Feedback;
}[];

export async function getHomeFeedbackPreference(): Promise<HomeFeedbackRecord> {
	return await getStructuredPreferences<HomeFeedbackRecord>(HOME_FEEDBACK_KEY) || {};
}

export async function setHomeFeedbackPreference(homeFeedback: HomeFeedbackRecord) {
	await setStructuredPreferences(HOME_FEEDBACK_KEY, homeFeedback);
}

export async function getNewActivities(): Promise<HomeFeedbackContent | undefined> {
	const homeFeedback = await getHomeFeedbackPreference();
	if (!homeFeedback) return;
	return homeFeedback.newActivities;
}

export async function getExpiredCredentials(): Promise<HomeFeedbackContent | undefined> {
	const homeFeedback = await getHomeFeedbackPreference();
	if (!homeFeedback) return;
	return homeFeedback.expiredCredentials;
}

export async function setNewActivitiesInHome(homeFeedback: HomeFeedbackContent) {
	const homeFeedbacks = await getHomeFeedbackPreference();
	if (!homeFeedbacks) {
		await setHomeFeedbackPreference({ newActivities: homeFeedback });
		return;
	}
	await setHomeFeedbackPreference({ ...homeFeedbacks, newActivities: homeFeedback });
}

export async function setExpiredCredentialsInHome(homeFeedback: HomeFeedbackContent) {
	const homeFeedbacks = await getHomeFeedbackPreference();
	if (!homeFeedbacks) {
		await setHomeFeedbackPreference({ expiredCredentials: homeFeedback });
		return;
	}
	if (homeFeedback.count === homeFeedbacks.expiredCredentials?.count) return;
	await setHomeFeedbackPreference({ ...homeFeedbacks, expiredCredentials: homeFeedback });
}

export async function setFeedbackAsSeen(type: HomeFeedbackType) {
	const homeFeedback = await getHomeFeedbackPreference();
	if (!homeFeedback) return;
	await setHomeFeedbackPreference({
		...homeFeedback,
		[type]: { count: homeFeedback[type]?.count || 0, seen: true }
	});
	invalidate(_protectedLayoutKey);
}

export async function getHomeFeedbacks(): Promise<HomeFeedbacksList> {
	const newActivities = await getNewActivities();
	const expiredCredentials = await getExpiredCredentials();
	const feedbacks: HomeFeedbacksList = [];
	if (newActivities && !newActivities.seen) {
		feedbacks.push({
			type: 'newActivities',
			content: {
				type: 'success',
				feedback: `You have ${newActivities.count} new activit${
					newActivities.count > 1 ? 'ies' : 'y'
				}`
			}
		});
	}
	if (expiredCredentials && !expiredCredentials.seen) {
		feedbacks.push({
			type: 'expiredCredentials',
			content: {
				type: 'error',
				feedback: `You have ${expiredCredentials.count} expired credential${
					expiredCredentials.count > 1 ? 's' : ''
				}`
			}
		});
	}
	return feedbacks;
}
