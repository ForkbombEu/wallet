import { r, type Langs } from '$lib/i18n';
import { redirect } from '@sveltejs/kit';
import { Device } from '@capacitor/device';
import { getLanguagePreference, setLanguagePreference } from '$lib/preferences/lang';
import { availableLanguageTags } from '$paraglide/runtime';

const setInitialLanguage = async () => {
	if (!(await getLanguagePreference())) {
		const lang = await Device.getLanguageTag();
		await setLanguagePreference(lang.value.split('-')[0]);
	}
};

const getLang = async () => {
	const lang = await getLanguagePreference();
	//@ts-expect-error lang is a string
	if (lang && availableLanguageTags.includes(lang)) return lang as Langs;
	return 'en' as Langs;
};

export const load = async () => {
	await setInitialLanguage();
	const lang = await getLang();
	redirect(303, r('/home', lang));
};
