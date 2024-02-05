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

export const m = messages
export const r = (link: string) => i18n.resolveRoute(link);
export const goto = (link:string)=>svelteGoto(r(link))
