import { r, type Langs } from '$lib/i18n';
import { redirect } from '@sveltejs/kit';
import { Device } from '@capacitor/device';
import { getLanguagePreference, setLanguagePreference } from '$lib/preferences/lang';
import { availableLanguageTags } from '$paraglide/runtime';
import { getKeypairPreference } from '$lib/preferences/keypair';
import { getDIDPreference } from '$lib/preferences/did';
import { getUser } from '$lib/preferences/user';
import { isAlreadyBoarded } from '$lib/preferences/onBoarding';

const setInitialLanguage = async () => {
	if (!(await getLanguagePreference())) {
		const lang = await Device.getLanguageCode();
		await setLanguagePreference(lang?.value || 'en');
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
	const boarded = await isAlreadyBoarded();
	if (!boarded) throw redirect(303, r('/on-boarding', lang));
	const keypair = await getKeypairPreference();
	const did = await getDIDPreference();
	const user = await getUser();
	if (!(keypair && did && user)) redirect(303, r('/register-login', lang));
	redirect(303, r('/unlock', lang));
};
