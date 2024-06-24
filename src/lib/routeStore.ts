import { get, writable } from 'svelte/store';
import { goto } from './i18n';
import { getLanguagePreference } from './preferences/lang';
import { navigating } from '$app/stores';

export type RouteEntry = {
	previousPath: string;
};
export function createRouteStore() {
	const { subscribe, set, update } = writable<RouteEntry[]>([]);

	return {
		subscribe,
		set: (routes: RouteEntry[]) => set(routes),
		push: (route: RouteEntry) =>
			update((routes) => {
				if (routes.length > 0) {
					const lastRoute = routes[routes.length - 1];
					if (lastRoute.previousPath === route.previousPath) return routes;
				}
				return [...routes, route];
			}),
		back: async () => {
			const lang = await getLanguagePreference().then((r) => (r != null ? r : undefined));
			update((routes) => {
				if (!get(navigating)) {
					const route = routes.pop();
					//@ts-expect-error language is a string
					if (route) goto(route!.previousPath, lang, false);
					// return routes;
				}
				return routes;
			});
		},
		clear: () => set([])
	};
}

export const routeHistory = createRouteStore();
