import { getCredentialsSdjwt } from '$lib/preferences/credentials';
import { z } from 'zod';
import { Slangroom } from '@slangroom/core';
import { helpers } from '@slangroom/helpers';
import { zencode } from '@slangroom/zencode';
import { pocketbase } from '@slangroom/pocketbase';
import { http } from '@slangroom/http';
import verQrToInfo from '$lib/mobile_zencode/wallet/ver_qr_to_info.zen?raw';
import verQrToInfoKeys from '$lib/mobile_zencode/wallet/ver_qr_to_info.keys.json?raw';
import { log } from '$lib/log';
import { verificationStore } from '$lib/verificationStore';
import { credentialOfferStore } from '$lib/credentialOfferStore';
import type { Feedback } from '$lib/utils/types';
import { m, goto } from '$lib/i18n';
import { verificationResultsStore } from '$lib/verificationResultsStore';

const slangroom = new Slangroom(helpers, zencode, pocketbase, http);

export type QrToInfoResults = {
	info: Info;
	post: Post;
};

export type Info = {
	asked_claims: AskedClaims;
	rp_name: string;
	verifier_name: string;
};

export type AskedClaims = {
	properties: Properties;
	required: string[];
	type: string;
};

export type Properties = Record<string, { title: string; type: string }>;

export type Post = {
	body: Body;
	url: string;
};

export type Body = {
	id: string;
	m: string;
	registrationToken: string;
	vp: string;
};

export type ParseQrError = {
	message: string;
};

export const credentialSchema = z.object({
	rp: z.string().url(),
	t: z.string(),
	m: z.literal('f'),
	exp: z.number(),
	ru: z.string().url(),
	sid: z.string().length(5),
	id: z.string()
});

export const serviceSchema = z.object({
	credential_configuration_ids: z.array(z.string()),
	credential_issuer: z.string().url()
});
export type Credential = z.infer<typeof credentialSchema>;
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

export const verifyCredential = async (post: Post) => {
	const res = await slangroom.execute(
		`Rule unknown ignore
	Given I connect to 'url' and send object 'body' and do post and output into 'result'
	Given I have a 'string dictionary' named 'result'
	Then print data`,
		{
			data: post
		}
	);

	return res;
};

export const getCredentialQrInfo = async (qrJSON: Credential) => {
	const myCredentials = await getCredentialsSdjwt();
	if (!myCredentials) throw new Error('No credentials');
	const data = {
		...qrJSON,
		credential_array: myCredentials
	};
	log(JSON.stringify(data));
	try {
		const res = await slangroom.execute(verQrToInfo, { data, keys: JSON.parse(verQrToInfoKeys) });
		log(JSON.stringify(res));
		return res.result as QrToInfoResults;
	} catch (err) {
		log(JSON.stringify(err));
		throw new Error(`error executing zencode: ${err}`);
	}
};

const parseBarcodeErrors = (barcodeResultMessage?: string) => {
	if (!barcodeResultMessage) return;
	if (!(typeof barcodeResultMessage === 'string')) return;
	if (barcodeResultMessage.includes('QR code is expired')) {
		return m.QR_code_is_expired();
	}
	if (
		barcodeResultMessage.includes(
			'no_signed_selective_disclosure_found_that_matched_the_requested_claims'
		)
	) {
		return m.You_have_no_signed_selective_disclosure_that_matched_the_requested_claims_or_your_credential_is_expired();
	}
	return barcodeResultMessage;
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
	} catch (err: { message: unknown }) {
		return {
			success: false,
			feedback: {
				type: 'error',
				feedback: 'Verification failed',
				message: parseBarcodeErrors(err.message)
			}
		};
	}
};

const extractUrlParams = (
	params: { [key: string]: 'string' | 'number' | 'array' },
	urlSearchParams: URLSearchParams
) =>
	Object.entries(params).reduce((result, [key, type]) => {
		const value = urlSearchParams.get(key)?.trim();
		let parsedValue;

		switch (type) {
			case 'array':
				parsedValue = value ? [value] : [];
				break;
			case 'number':
				parsedValue = value ? Number(value) : undefined;
				break;
			default:
				parsedValue = value;
		}

		return {
			...result,
			[key]: parsedValue
		};
	}, {});

const parseParams = (urlParams: URLSearchParams, params: any, schema: any) => {
	return schema.safeParse(extractUrlParams(params, urlParams));
};

const handleVerificationSuccess = async (verificationData: any) => {
	const info = await infoFromVerificationData(verificationData);
	if (info.success) {
		verificationStore.set(info.info);
		return await goto('/verification');
	} else {
		verificationResultsStore.set({
			feedback: info.feedback,
			date: new Date().toISOString(),
			id: verificationData.sid,
			success: false
		});
		return await goto('/verification/results');
	}
};

const handleServiceSuccess = async (serviceData: any) => {
	credentialOfferStore.set(serviceData);
	return await goto('/credential-offer');
};

export const gotoQrResult = async (url: string) => {
	const urlParams = new URLSearchParams(url.split('://?')[1]);

	const verificationParams = {
		rp: 'string',
		t: 'string',
		m: 'string',
		exp: 'number',
		ru: 'string',
		sid: 'string',
		id: 'string'
	};

	const parsedVerification = parseParams(urlParams, verificationParams, credentialSchema);
	if (parsedVerification.success) {
		return handleVerificationSuccess(parsedVerification.data);
	}

	const serviceParams = {
		credential_configuration_ids: 'array',
		credential_issuer: 'string'
	};

	const parsedService = parseParams(urlParams, serviceParams, serviceSchema);
	if (parsedService.success) {
		return handleServiceSuccess(parsedService.data);
	}

	return await goto('/unlock');
};
