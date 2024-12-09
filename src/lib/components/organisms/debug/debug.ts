import { getDebugMode } from '$lib/preferences/debug';
import { writable } from 'svelte/store';

export const debugPopup = writable(true);
export const debugPopupContent = writable<string | undefined>(undefined);

export const debugDismiss = async () => {
	if (!(await getDebugMode())) return;
	return new Promise<void>((resolve) => {
		const unsubscribe = debugPopup.subscribe((value) => {
			if (value === false) {
				unsubscribe();
				resolve();
			}
		});
	});
};
