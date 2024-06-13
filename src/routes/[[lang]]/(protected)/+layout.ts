import { isAlreadyBoarded } from '$lib/components/onBoarding/utils';
import { r, type Langs } from '$lib/i18n';
import { addActivity, getActivities } from '$lib/preferences/activity';
import { getExpiredCredentials } from '$lib/preferences/credentials';
import { getDIDPreference } from '$lib/preferences/did';
import { getKeypairPreference } from '$lib/preferences/keypair';
import { getLanguagePreference } from '$lib/preferences/lang';
import { isAppLocked, lockApp } from '$lib/preferences/locked.js';
import { getUser } from '$lib/preferences/user';
import { availableLanguageTags } from '$paraglide/runtime';
import { redirect } from '@sveltejs/kit';
import dayjs from 'dayjs';

const getLang = async () => {
	const lang = await getLanguagePreference();
	//@ts-expect-error - This is a valid check
	if (lang && availableLanguageTags.includes(lang)) return lang as Langs;
	return undefined;
};

const checkIfThereAreExpiredCredentialsAndSetActivity = async () => {
	const expiredCredential = await getExpiredCredentials();
	expiredCredential.forEach(async (credential) => {
		const activities = await getActivities();
		if (
			activities?.find((activity) => activity.type === 'expired' && activity.id === credential.id)
		)
			return;
		await addActivity({ type: 'expired', id: credential.id, at: dayjs().unix() });
	});
};

export const load = async () => {
	const lang = await getLang();
	const boarded = await isAlreadyBoarded();
	if (!boarded) throw redirect(303, r('/on-boarding', lang));
	const keypair = await getKeypairPreference();
	const did = await getDIDPreference();
	const user = await getUser();
	if (!(keypair && did && user)) redirect(303, r('/register-login', lang));
	await checkIfThereAreExpiredCredentialsAndSetActivity()
	const isLocked = await isAppLocked();
	if (isLocked) redirect(303, r('/unlock', lang));
	else await lockApp(); // Locking back after the user has got in
};
