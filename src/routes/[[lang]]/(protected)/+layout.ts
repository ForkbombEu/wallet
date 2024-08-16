import {
	getHomeFeedbackPreference,
	setExpiredCredentialsInHome
} from '$lib/homeFeedbackPreferences';
import { r, type Langs } from '$lib/i18n';
import { addExpiredCredentialActivity, getNotReadedActivities } from '$lib/preferences/activity';
import { getExpiredCredentials } from '$lib/preferences/credentials';
import { getDIDPreference } from '$lib/preferences/did';
import { getKeypairPreference } from '$lib/preferences/keypair';
import { getLanguagePreference } from '$lib/preferences/lang';
import { isAlreadyBoarded } from '$lib/preferences/onBoarding';
import { getUser } from '$lib/preferences/user';
import { availableLanguageTags } from '$paraglide/runtime';
import { redirect } from '@sveltejs/kit';

const getLang = async () => {
	const lang = await getLanguagePreference();
	//@ts-expect-error - This is a valid check
	if (lang && availableLanguageTags.includes(lang)) return lang as Langs;
	return undefined;
};

const checkIfThereAreExpiredCredentialsAndSetActivity = async () => {
	const expiredCredentials = await getExpiredCredentials();
	expiredCredentials.forEach(async (credential) => {
		await addExpiredCredentialActivity(credential.id);
	});
	setExpiredCredentialsInHome({ count: expiredCredentials.length, seen: false });
};

export const _protectedLayoutKey = 'load:protected-layout';

export const load = async ({ depends }) => {
	depends(_protectedLayoutKey);
	const ff = await getHomeFeedbackPreference();
	const hasHomeFeedback = !(ff?.expiredCredentials?.seen && ff?.newActivities?.seen);
	const lang = await getLang();
	const boarded = await isAlreadyBoarded();
	if (!boarded) throw redirect(303, r('/on-boarding', lang));
	const keypair = await getKeypairPreference();
	const did = await getDIDPreference();
	const user = await getUser();
	if (!(keypair && did && user)) redirect(303, r('/register-login', lang));
	checkIfThereAreExpiredCredentialsAndSetActivity();
	const notReadedActivities = await getNotReadedActivities();
	return { notReadedActivities, hasHomeFeedback };
};
