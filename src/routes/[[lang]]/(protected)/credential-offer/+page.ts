import { credentialOfferStore } from '$lib/credentialOfferStore';
import { m } from '$lib/i18n';
import { callPar, holderQrToWellKnown, type QrToWellKnown } from '$lib/openId4vci';
import type { Feedback } from '$lib/utils/types';
import { get } from 'svelte/store';

export const load = async () => {
	const credentialOffer = get(credentialOfferStore);
	let feedbackData: Feedback | undefined;
	let wn: QrToWellKnown | undefined;
	try {
		wn = await holderQrToWellKnown(credentialOffer);
	} catch (e) {
		console.error(e);
		feedbackData = {
			type: 'error',
			feedback: m.The_credential_issuer_is_currently_offline_you_may_try_again_later()
		};
	}
	if (!wn) {
		console.error('No well known');
		feedbackData = {
			type: 'error',
			feedback: m.The_credential_issuer_is_currently_offline_you_may_try_again_later()
		};
	}
	let parResult;
	let authorizeUrl;
	if (!wn) return { wn, authorizeUrl, parResult, feedbackData };
	const data = {
		credential_parameters: wn?.credential_parameters,
		redirect_uri: 'openid-credential-offer://callback?'
	};

	try {
		const r = await callPar(data);
		parResult = r.parResult;
		authorizeUrl = r.authorizeUrl;
	} catch (e) {
		console.error(e);
		feedbackData = {
			type: 'error',
			feedback: m.The_credential_issuer_is_currently_offline_you_may_try_again_later()
		};
	}

	if (!authorizeUrl) {
		console.error('No authorize url');
		feedbackData = {
			type: 'error',
			feedback: m.The_credential_issuer_is_currently_offline_you_may_try_again_later()
		};
	}
	return { wn, authorizeUrl, parResult, feedbackData };
};
