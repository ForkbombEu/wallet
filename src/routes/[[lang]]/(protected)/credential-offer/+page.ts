import { credentialOfferStore } from '$lib/credentialOfferStore';
import { m } from '$lib/i18n';
import { callPar, holderQrToWellKnown, type QrToWellKnown, type CallParResult } from '$lib/openId4vci';
import { setCredentialAuthenticationPreference } from '$lib/preferences/credentialAuthentication';
import { get } from 'svelte/store';

export const load = async () => {
	const credentialOffer = get(credentialOfferStore);

	if (!credentialOffer) {
		return {
			feedbackData: {
				type: 'error',
				feedback: m.no_credential_offer_found()
			}
		};
	};

	let wn: QrToWellKnown | undefined;
	try {
		wn = await holderQrToWellKnown(credentialOffer);
	} catch(e) {
		return {
			feedbackData: {
				type: 'error',
				message: (e as Error).message,
				feedback: m.this_service_is_not_compatible_or_is_currently_offline()
			}
		};
	};

	let par: { parResult: CallParResult; authorizeUrl: string;} | undefined;
	try {
		par = await callPar({
			credential_parameters: wn.credential_parameters
		});
	} catch(e) {
		return {
			feedbackData: {
				type: 'error',
				message: (e as Error).message,
				feedback: m.call_to_par_endpoint_failed()
			}
		};
	};

	const { parResult, authorizeUrl } = par;
	if (!authorizeUrl) {
		return {
			feedbackData: {
				type: 'error',
				feedback: m.The_credential_issuer_is_currently_offline_you_may_try_again_later()
			}
		};
	}

	await setCredentialAuthenticationPreference({
		wn,
		parResult
	});

	return { wn, authorizeUrl, parResult };
};
