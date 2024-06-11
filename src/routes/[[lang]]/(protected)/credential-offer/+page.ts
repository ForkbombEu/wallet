import { credentialOfferStore } from '$lib/credentialOfferStore';
import { homeFeedbackStore } from '$lib/homeFeedbackStore';
import { m, r, type Langs } from '$lib/i18n';
import { callPar, holderQrToWellKnown, type QrToWellKnown } from '$lib/openId4vci';
import { getLanguagePreference } from '$lib/preferences/lang';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';

const goToHomeWithError = async () => {
	homeFeedbackStore.set({
		type: 'error',
		feedback: m.The_credential_issuer_is_currently_offline_you_may_try_again_later()
	});
	const lang = await getLang();
	redirect(303, r('/home', lang));
};
const getLang = async () => {
	const lang = await getLanguagePreference();
	if (lang && ['it', 'en'].includes(lang)) return lang as Langs;
	return 'en' as Langs;
};

export const load = async () => {
	const credentialOffer = get(credentialOfferStore);
	let wn: QrToWellKnown | undefined;
	try {
		wn = await holderQrToWellKnown(credentialOffer);
	} catch {
		return await goToHomeWithError();
	}
	if (!wn) {
		return await goToHomeWithError();
	}
	const data = {
		credential_parameters: wn!.credential_parameters
	};
	const { parResult, authorizeUrl } = await callPar(data);

	if (!authorizeUrl) {
		return await goToHomeWithError();
	}
	return { wn, authorizeUrl, parResult };
};
