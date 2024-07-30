import { getStructuredPreferences, setStructuredPreferences } from './preferences';
import type { Feedback } from './utils/types';

const HOME_FEEDBACK_KEY = 'homeFeedback';

export type HomeFeedback = {
	count: number;
	seen: boolean;
};

export type HomeFeedbackList = {
	newActivities?: HomeFeedback;
	expiredCredentials?: HomeFeedback;
};

export type HomeFeedbackType = 'newActivities' | 'expiredCredentials';

export async function getHomeFeedbackPreference(): Promise<HomeFeedbackList | undefined> {
	return await getStructuredPreferences<HomeFeedbackList>(HOME_FEEDBACK_KEY);
}

export async function setHomeFeedbackPreference(homeFeedback: HomeFeedbackList) {
	await setStructuredPreferences(HOME_FEEDBACK_KEY, homeFeedback);
}

export async function getNewActivities(): Promise<HomeFeedback | undefined> {
	const homeFeedback = await getHomeFeedbackPreference();
	if (!homeFeedback) return;
	return homeFeedback.newActivities;
}

export async function getExpiredCredentials(): Promise<HomeFeedback | undefined> {
	const homeFeedback = await getHomeFeedbackPreference();
	if (!homeFeedback) return;
	return homeFeedback.expiredCredentials;
}

export async function setNewActivitiesInHome(homeFeedback: HomeFeedback) {
	const homeFeedbacks = await getHomeFeedbackPreference();
	if (!homeFeedbacks) {
		await setHomeFeedbackPreference({ newActivities: homeFeedback });
		return;
	}
	await setHomeFeedbackPreference({ ...homeFeedbacks, newActivities: homeFeedback });
}

export async function setExpiredCredentialsInHome(homeFeedback: HomeFeedback) {
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
}

export async function getHomeFeedbacks(): Promise<{ content: Feedback; type: HomeFeedbackType }[]> {
	const newActivities = await getNewActivities();
	const expiredCredentials = await getExpiredCredentials();
	const feedbacks: { content: Feedback; type: HomeFeedbackType }[] = [];
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
