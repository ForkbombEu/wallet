import { getCredentialsFormat, type LdpVc } from '$lib/preferences/credentials';
import { z, ZodSchema } from 'zod';
import { Slangroom, type Plugins } from '@slangroom/core';
import { did } from '@slangroom/did';
import { helpers } from '@slangroom/helpers';
import { zencode } from '@slangroom/zencode';
import { pocketbase } from '@slangroom/pocketbase';
import { http } from '@slangroom/http';
import verQrToInfo from '$lib/mobile_zencode/wallet/openid4vp_qr_to_info.zen?raw';
import verQrToInfoKeys from '$lib/mobile_zencode/wallet/openid4vp_qr_to_info.keys.json?raw';
import verResponse from '$lib/mobile_zencode/wallet/openid4vp_response.zen?raw';
import verResponseKeys from '$lib/mobile_zencode/wallet/openid4vp_response.keys.json?raw';
import { log } from '$lib/log';
import { verificationStore } from '$lib/verificationStore';
import { credentialOfferStore } from '$lib/credentialOfferStore';
import type { Feedback } from '$lib/utils/types';
import { m, goto } from '$lib/i18n';
import { verificationResultsStore } from '$lib/verificationResultsStore';
import { getDIDPreference } from '$lib/preferences/did';
import { getKeypairPreference } from '$lib/preferences/keypair';
import { credential } from '$paraglide/messages';

const slangroom = new Slangroom(did, helpers, zencode, pocketbase, http as unknown as Plugins);

export type QrToInfoResults = {
	post_url: string;
	vps: Array<{
		card: LdpVc | string;
		presentation: {
			'@context': Array<string>;
			holder: string;
			id: string;
			proof: {
				challenge: string;
				created: string;
				cryptosuite: string;
				domain: string;
				proofPurpose: string;
				proofValue: string;
				type: string;
				verificationMethod: string;
			};
			type: Array<string>;
			verifiableCredential: Array<LdpVc>;
		} | string;
	}>;
};

export type AskedClaims = {
	properties: Properties;
	required: string[];
	type: string;
};

export type Properties = Record<string, { title: string; type: string }>;

export type PostWithoutVp = {
	body: Body;
	url: string;
};

export type Body = {
	id: string;
	m: string;
	registrationToken: string;
	vp: string;
};

export const verificationQRSchema = z.object({
	request_uri_method: z.enum(['get', 'post']).optional(),
	client_id: z.string(),
	request_uri: z.string().url()
});

export const serviceSchema = z.object({
	credential_configuration_ids: z.array(z.string()),
	credential_issuer: z.string().url()
});
export type Credential = z.infer<typeof verificationQRSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type Data =
	| {
			type: 'credential';
			credential: QrToInfoResults;
	  }
	| {
			type: 'service';
			service: Service;
	  };

export const verifyCredential = async (postWVP: PostWithoutVp) => {
	return await slangroom
		.execute(verResponse, { data: postWVP, keys: JSON.parse(verResponseKeys) })
		.catch((err) => {
			throw new Error(m.Failed_verResponse({err}))
		})
}

export const getCredentialQrInfo = async (qrJSON: Credential) => {
	const myCredentials = await getCredentialsFormat();
	if (!myCredentials || Object.entries(myCredentials).length === 0) throw new Error(m.No_credentials_found());
	const did = await getDIDPreference();
	const keyring = await getKeypairPreference();
	// eliminate null values from ldp_vc
	const ldp_vc = myCredentials.ldp_vc.filter((vc) => vc !== null);
	const data = {
		...qrJSON,
		credentials: {
			...myCredentials,
			ldp_vc: ldp_vc
		},
	};
	const keys = JSON.parse(verQrToInfoKeys);
	keys.keyring = keyring?.keyring;
	keys.did = did.didDocument.id;
	try {
		const res = await slangroom
			//@ts-ignore
			.execute(verQrToInfo, { data, keys })
			.catch((err) => {
				throw new Error(m.Failed_verQrToInfo({err}));
			});
		return res.result as QrToInfoResults;
	} catch (err) {
		log(JSON.stringify(err));
		console.error(m.Error_executing_zencode({err: err as string}));
		throw new Error(m.Error_executing_zencode({err: err as string}));
	}
};

const infoFromVerificationData = async (
	data: Credential
): Promise<
	| {
			success: true;
			info: QrToInfoResults;
	  }
	| {
			success: false;
			feedback: Feedback;
	  }
> => {
	try {
		const credential = await getCredentialQrInfo(data);
		if (credential.vps.length === 0) {
			throw new Error(m.You_have_no_signed_selective_disclosure_that_matched_the_requested_claims_or_your_credential_is_expired())
		}
		verificationStore.set(credential);
		return {
			success: true,
			info: credential
		};
		//@ts-ignore
	} catch (err: { message: unknown }) {
		return {
			success: false,
			feedback: {
				type: 'error',
				feedback: m.Verification_failed(),
				message: err.message
			}
		};
	}
};

const fromSearchQueryToJSON = <T extends Record<string, any>>(
	urlSearchParams: URLSearchParams
): T => {
	const result: Record<string, any> = {};
	for (const [key, value] of urlSearchParams.entries()) {
		const defaultValue = ({} as T)[key];
		let parsedValue;
		if (Array.isArray(defaultValue)) {
			parsedValue = value !== undefined ? [value] : [];
		} else if (typeof defaultValue === 'number') {
			parsedValue = value !== undefined ? Number(value) : 0;
		} else {
			parsedValue = value !== undefined ? value : '';
		}
		result[key] = parsedValue;
	}
	return result as T;
};

const parseParams = <T extends Record<string, any>>(
	urlParams: URLSearchParams,
	schema: ZodSchema
) =>
	schema.safeParse(fromSearchQueryToJSON<T>(urlParams)) as
		| {
				success: true;
				data: T;
		  }
		| {
				success: false;
				error: string;
		  };

const handleVerificationSuccess = async (verificationData: Credential) => {
	const info = await infoFromVerificationData(verificationData);
	if (info.success) {
		verificationStore.set(info.info);
		return await goto('/verification');
	} else {
		verificationResultsStore.set({
			feedback: info.feedback,
			date: new Date().toISOString(),
			id: verificationData.client_id,
			success: false
		});
		return await goto('/verification/results');
	}
};

const handleServiceSuccess = async (serviceData: Service) => {
	credentialOfferStore.set(serviceData);
	return await goto('/credential-offer');
};

export const gotoQrResult = async (url: string) => {
	let urlParams = new URLSearchParams(url.split('://?')[1]);
	if (urlParams.size < 1) {
		urlParams = new URLSearchParams(url.split('://')[1]);
	}
	const parsedVerification = parseParams<Credential>(urlParams, verificationQRSchema);
	if (parsedVerification.success) {
		return handleVerificationSuccess(parsedVerification.data);
	}

	const legacyParsedService = parseParams<Service>(urlParams, serviceSchema);
	if (legacyParsedService.success) {
		return handleServiceSuccess(legacyParsedService.data);
	}

	const parsedServiceUri = fromSearchQueryToJSON<{ credential_offer_uri: 'string' }>(
		urlParams
	).credential_offer_uri;

	if (parsedServiceUri) {
		const service = await fetch(parsedServiceUri as string);
		const parsedService = serviceSchema.safeParse(await service.json());
		if (parsedService.success) {
			return handleServiceSuccess(parsedService.data);
		} else throw new Error(JSON.stringify({ issuer: parsedService.error }));
	}

	const parsedService = serviceSchema.safeParse(
		JSON.parse(
			fromSearchQueryToJSON<{ credential_offer: string }>(urlParams).credential_offer || '{}'
		)
	);
	if (parsedService.success) {
		return handleServiceSuccess(parsedService.data);
	}

	throw new Error(
		JSON.stringify({ issuance: legacyParsedService.error, verify: parsedVerification.error })
	);

	// return await goto('/unlock');
};
