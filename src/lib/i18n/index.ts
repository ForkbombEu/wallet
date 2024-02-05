import { createI18n } from '@inlang/paraglide-js-adapter-sveltekit';
import * as runtime from '$paraglide/runtime';

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

