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
	} catch {
		feedbackData = {
			type: 'error',
			feedback: m.The_credential_issuer_is_currently_offline_you_may_try_again_later()
		};
	}
	if (!wn) {
		feedbackData = {
			type: 'error',
			feedback: m.The_credential_issuer_is_currently_offline_you_may_try_again_later()
		};
	}
	let parResult;
	let authorizeUrl;
	if (!wn) return { wn, authorizeUrl, parResult, feedbackData };
	const data = {
		credential_parameters: wn?.credential_parameters
	};

	const r = await callPar(data);
	parResult = r.parResult;
	authorizeUrl = r.authorizeUrl;

	if (!authorizeUrl) {
		feedbackData = {
			type: 'error',
			feedback: m.The_credential_issuer_is_currently_offline_you_may_try_again_later()
		};
	}
	return { wn, authorizeUrl, parResult, feedbackData };
};
