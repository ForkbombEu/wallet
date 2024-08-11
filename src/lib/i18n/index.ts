import { createI18n } from '@inlang/paraglide-js-adapter-sveltekit';
import * as runtime from '$paraglide/runtime';
import * as messages from '$paraglide/messages';
import { goto as svelteGoto } from '$app/navigation';

export const i18n = createI18n(runtime, {
	prefixDefaultLanguage: 'always'
});

const isNotYetRegistered = (
	previousPath: string,
	lastEntry: { previousPath: string } | undefined
) => !lastEntry || lastEntry.previousPath !== previousPath;

export type Langs = ReturnType<typeof i18n.getLanguageFromUrl>;
export const m = messages;
export const r = (link: string, tag?: Langs) => i18n.resolveRoute(link, tag);
export const goto = async (link: string, tag?: Langs) => await svelteGoto(r(link, tag));
