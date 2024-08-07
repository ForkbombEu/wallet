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

export const load = async ({url}) => {
	const lang = await getLang();
	if (
		url.pathname.split('/')[1] !== lang &&
		availableLanguageTags.includes(url.pathname.split('/')[1])
	) {
		window.location.replace(`/${lang}/${url.pathname.split('/').slice(2).join('/')}`);
	} 
}