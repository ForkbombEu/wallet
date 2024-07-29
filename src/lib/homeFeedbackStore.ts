import { writable } from "svelte/store";
import type { Feedback } from "./utils/types";

// export const homeFeedbackStore = writable<{Feedback:Feedback, read:boolean}[]>();
export function createHomeFeedbackStore() {
    const { subscribe, set, update } = writable<{Feedback:Feedback, read:boolean}[]>([]);
    return {
        subscribe,
        set: (feedbacks: {Feedback:Feedback, read:boolean}[]) => set(feedbacks),
        push: (feedback: {Feedback:Feedback, read:boolean}) =>
            update((feedbacks) => {
                return [...feedbacks, feedback];
            }),
            getUnread: () => {
                return subscribe((feedbacks) => {
                    return feedbacks.filter((feedback) => !feedback.read);
                });
            },
            getLastUnread: () => subscribe((feedbacks) => {
                return feedbacks.filter((feedback) => !feedback.read).pop();
            }),
            markAsRead: (feedback: {Feedback:Feedback, read:boolean}) => {
                update((feedbacks) => {
                    return feedbacks.map((f) => {
                        if (f.Feedback.id === feedback.Feedback.id) {
                            f.read = true;
                        }
                        return f;
                    });
                });
            },
            
        clear: () => set([])
    };
}
