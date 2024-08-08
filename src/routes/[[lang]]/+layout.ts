import { type Langs, r } from '$lib/i18n';
import { getLanguagePreference } from '$lib/preferences/lang';
import { availableLanguageTags } from '$paraglide/runtime';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';

const getLang = async () => {
	const lang = await getLanguagePreference();
	//@ts-expect-error - This is a valid check
	if (lang && availableLanguageTags.includes(lang)) return lang as Langs;
	return 'en';
};

export const load = async ({ url }) => {
	const lang = await getLang();
	const urlSplit = url.pathname.split('/');
	const urlLangCode = urlSplit[1];
	if (urlLangCode !== lang && availableLanguageTags.includes(urlLangCode)) {
		redirect(303, `/${lang}/${urlSplit.slice(2).join('/')}`);
	}
};
