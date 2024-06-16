import { writable } from 'svelte/store';
import { goto } from './i18n';

export type RouteEntry = {
	previousPath: string;
};
export function createRouteStore() {
	const { subscribe, set, update } = writable<RouteEntry[]>([]);

	return {
		subscribe,
		set: (routes: RouteEntry[]) => set(routes),
        push: (route: RouteEntry) => update((routes) => [...routes, route]),
		back: () =>
			update((routes) => {
				const route = routes.pop();
				if (route) goto(route!.previousPath, undefined, false)
				return routes;
			}),
		clear: () => set([])
	};
}

export const routeHistory = createRouteStore();
