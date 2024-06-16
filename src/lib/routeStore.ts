import { writable } from 'svelte/store';
import { goto } from './i18n';

export type RouteEntry = {
	previousPath: string;
};
export function createRouteStore() {
	const { subscribe, set, update } = writable<RouteEntry[]>([]);

	return {
		subscribe,
		set: (route: RouteEntry[]) => set(route),
		back: () =>
			update((route) => {
				const bb = route.pop();
                console.log(bb, 'route.pop()', route);
				if (bb) goto(bb!.previousPath, undefined, true)
				return route;
			}),
		clear: () => set([])
	};
}

export const routeHistory = createRouteStore();
