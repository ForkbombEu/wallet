import { getDebugMode } from '$lib/preferences/debug';
import { writable } from 'svelte/store';

export const debugPopup = writable(true);

function createDebugPopupContent() {
	const { subscribe, set, update } = writable<string | undefined>(undefined);

	return {
		subscribe,
		set,
		update,
		push: (newContent: string) => {
			update((content) => {
				if (content) {
					return content + '\n' + newContent;
				} else {
					return newContent;
				}
			});
		}
	};
}

export const debugPopupContent = createDebugPopupContent();

export const debugDismiss = async () => {
	if (!(await getDebugMode())) return;
	return new Promise<void>((resolve) => {
		const unsubscribe = debugPopup.subscribe((value) => {
			if (value === false) {
				debugPopupContent.set(undefined);
				unsubscribe();
				resolve();
			}
		});
	});
};
