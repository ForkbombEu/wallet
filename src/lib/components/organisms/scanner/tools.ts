import { getCredentialsFormat, type LdpVc } from '$lib/preferences/credentials';
import { z, ZodSchema } from 'zod';
import { Slangroom, type Plugins } from '@slangroom/core';
import { did } from '@slangroom/did';
import { helpers } from '@slangroom/helpers';
import { zencode } from '@slangroom/zencode';
import { pocketbase } from '@slangroom/pocketbase';
import { http } from '@slangroom/http';
import verQrToInfo from '$lib/mobile_zencode/wallet/opneid4vp_qr_to_info.zen?raw';
import verQrToInfoKeys from '$lib/mobile_zencode/wallet/opneid4vp_qr_to_info.keys.json?raw';
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
	console.log(postWVP);
	try {
	await slangroom.execute(
		`Scenario 'http': params
		Rule unknown ignore
		Given I have a 'string dictionary' in path 'body.vp_token'
		Given I have a 'string' named 'url'

		When I create 'string dictionary' named 'body_params'
		When I create json escaped string of 'vp_token'
		When I move 'json escaped string' to 'vp_token' in 'body_params'
		When I create http get parameters from 'body_params' using percent encoding
		Then print the 'http get parameters'
		Then print the 'url'
		Then I connect to 'url' and send object 'http_get_parameters' and send headers 'headers' and do post and output into 'result'
		`,
		{
			data: postWVP,
			keys: {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			}
		}
	)} catch(e) {
		console.log(e)
	}};

export const getCredentialQrInfo = async (qrJSON: Credential) => {
	const myCredentials = await getCredentialsFormat();
	if (!myCredentials) throw new Error('No credentials');
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
				throw new Error(`Failed to execute verQrToInfo: ${err}`);
			});
		console.log('res: ', res.result);
		return res.result as QrToInfoResults;
	} catch (err) {
		log(JSON.stringify(err));
		console.error('Error executing zencode:', err);
		throw new Error(`error executing zencode: ${err}`);
	}
};

const parseQrCodeErrors = (qrcodeResultMessage?: string) => {
	if (!qrcodeResultMessage) return;
	if (!(typeof qrcodeResultMessage === 'string')) return;
	if (qrcodeResultMessage.includes('QR code is expired')) {
		return m.QR_code_is_expired();
	}
	if (
		qrcodeResultMessage.includes(
			'no_signed_selective_disclosure_found_that_matched_the_requested_claims'
		)
	) {
		return m.You_have_no_signed_selective_disclosure_that_matched_the_requested_claims_or_your_credential_is_expired();
	}
	return qrcodeResultMessage;
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
				feedback: 'Verification failed',
				message: parseQrCodeErrors(err.message)
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
