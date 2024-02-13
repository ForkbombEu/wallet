import { r, type Langs } from '$lib/i18n';
import { getKeypairPreference } from '$lib/preferences/keypair';
import { getLanguagePreference } from '$lib/preferences/lang';
import { isAppLocked, lockApp } from '$lib/preferences/locked.js';
import { redirect } from '@sveltejs/kit';
import { availableLanguageTags } from '$paraglide/runtime';

const getLang = async () => {
	const lang = await getLanguagePreference();
	//@ts-ignore
	if (lang && availableLanguageTags.includes(lang)) return lang as Langs;
	return undefined;
};

export const load = async () => {
	const lang = await getLang();
	const keypair = await getKeypairPreference();
	if (!keypair) redirect(303, r('/login', lang));

	const isLocked = await isAppLocked();
	if (isLocked) redirect(303, r('/unlock', lang));
	else await lockApp(); // Locking back after the user has got in
};
