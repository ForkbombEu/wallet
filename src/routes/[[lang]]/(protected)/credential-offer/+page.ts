import { debugPopupContent } from '$lib/components/organisms/debug/debug';
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
		return;
	}
	const data = {
		credential_parameters: wn.credential_parameters
	};

	const par = await callPar(data);
	const { parResult, authorizeUrl } = par;

	if (!authorizeUrl) {
		feedbackData = {
			type: 'error',
			feedback: m.The_credential_issuer_is_currently_offline_you_may_try_again_later()
		};
	}
	debugPopupContent.set(JSON.stringify(parResult, null, 2));
	return { wn, authorizeUrl, parResult, feedbackData };
};
