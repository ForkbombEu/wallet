import { routeHistory } from '../routeStore';
import { createI18n } from '@inlang/paraglide-js-adapter-sveltekit';
import * as runtime from '$paraglide/runtime';
import * as messages from '$paraglide/messages';
import { replaceState, goto as svelteGoto } from '$app/navigation';
import { get } from 'svelte/store';

export const i18n = createI18n(runtime, {
	prefixDefaultLanguage: 'always'
});

export type Langs = ReturnType<typeof i18n.getLanguageFromUrl>;
export const m = messages;
export const r = (link: string, tag?: Langs) => i18n.resolveRoute(link, tag);
export const goto = async (link: string, tag?: Langs, dontSaveHistory: boolean = false) => {
	const history = get(routeHistory);
	const lastEntry = history[history.length - 1];
	const previousPath = i18n.route(window.location.pathname);
	console.log(previousPath, dontSaveHistory, tag);

	if (!dontSaveHistory && (!lastEntry || lastEntry.previousPath !== previousPath)) {
		const p = new Error
		console.log('saving history', previousPath, dontSaveHistory, p.stack);

		routeHistory.set([...history, { previousPath }]);
	}

	console.log(history, get(routeHistory));
	await svelteGoto(r(link, tag), { replaceState: true });
};
