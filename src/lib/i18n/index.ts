import { createI18n } from '@inlang/paraglide-js-adapter-sveltekit';
import * as runtime from '$paraglide/runtime';
import * as messages from '$paraglide/messages';
import { goto as svelteGoto } from '$app/navigation';


export const i18n = createI18n(runtime, {
	pathnames: {
		// '/home': {
		// 	en: '/home',
		// 	it: '/casa'
		// },
        // '/wallet': {
        //     en: '/wallet',
        //     it: '/portafoglio'
        // },
		// '/request/[id]': {
		// 	en: '/request/[id]',
		// 	it: '/richiesta/[id]'
		// }
	},
    prefixDefaultLanguage: "always",
	textDirection: {
		en: 'ltr',
		it: 'ltr'
	}
});

type Langs = ReturnType<typeof i18n.getLanguageFromUrl> 
export const m = messages
export const r = (link: string, tag?:Langs) => i18n.resolveRoute(link, tag);
export const goto = (link: string, tag?: Langs) => svelteGoto(r(link, tag));
