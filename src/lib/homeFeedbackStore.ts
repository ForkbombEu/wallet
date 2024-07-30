import { derived, writable } from 'svelte/store';
import type { Feedback } from './utils/types';
import { getStructuredPreferences, setStructuredPreferences } from './preferences';

const HOME_FEEDBACK_KEY = 'homeFeedback';

export async function createHomeFeedbackStore() {
	const persistedStore =
		(await getStructuredPreferences<{ feedback: Feedback; read?: boolean }[]>(HOME_FEEDBACK_KEY)) ||
		[];
	const { subscribe, set, update } =
		writable<{ feedback: Feedback; read?: boolean }[]>(persistedStore);

	return {
		subscribe,
		set: (feedbacks: { feedback: Feedback; read?: boolean }[]) => set(feedbacks),
		push: (feedback: { feedback: Feedback; read?: boolean }) =>
			update((feedbacks) => {
				const alreadyRegistered = feedbacks.some(
					(f) => f.feedback.feedback === feedback.feedback.feedback
				);
				const newFeedbacks = alreadyRegistered ? feedbacks : [...feedbacks, feedback];
				setStructuredPreferences(HOME_FEEDBACK_KEY, newFeedbacks);
				return newFeedbacks;
			}),
		getUnread: () => {
			return subscribe((feedbacks) => {
				return feedbacks.filter((feedback) => !feedback.read);
			});
		},
		markAsRead: (feedback: { feedback: Feedback; read?: boolean }) => {
			update((feedbacks) => {
				return feedbacks.map((f) => {
					if (f.feedback.feedback === feedback.feedback.feedback) f.read = true;
					setStructuredPreferences(HOME_FEEDBACK_KEY, feedbacks);
					return f;
				});
			});
		},

		clear: () => {
			setStructuredPreferences(HOME_FEEDBACK_KEY, []);
			set([]);
		}
	};
}

export const homeFeedbackStore = await createHomeFeedbackStore();

export const lastHomeFeedback = derived(
	homeFeedbackStore,
	($homeFeedbackStore) => $homeFeedbackStore.filter((feedback) => !feedback.read)[0]
);
