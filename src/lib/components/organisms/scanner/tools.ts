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
import { goto } from '$app/navigation';
import { verificationStore } from '$lib/verificationStore';
import { credentialOfferStore } from '$lib/credentialOfferStore';

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

export const gotoQrResult = async (url: string) => {
	const urlParams = new URLSearchParams(url.split('://?')[1]);
	const getUrlParams = (params: (string | [string, 'number' | 'array'])[]) =>
		params.reduce((object, value) => {
			const isValueString = typeof value === 'string';
			const key = isValueString ? value : value[0];
			const type = isValueString ? 'string' : value[1];

			return {
				...object,
				[key]:
					type === 'string'
						? urlParams.get(key)?.trim()
						: type === 'array'
							? [urlParams.get(key)]
							: Number(urlParams.get(key)?.trim())
			};
		}, {});

	const parsedVerification = credentialSchema.safeParse(
		getUrlParams(['rp', 't', 'm', ['exp', 'number'], 'ru', 'sid', 'id'])
	);

	if (parsedVerification.success) {
		try {
			const credential = await getCredentialQrInfo(parsedVerification.data);
			verificationStore.set(credential);
			return await goto('/verification');
		} catch (err) {
			return log(`Failed verification: ${err}`);
		}
	}

	const parsedService = serviceSchema.safeParse(
		getUrlParams([['credential_configuration_ids', 'array'], 'credential_issuer'])
	);

	if (parsedService.success) {
		credentialOfferStore.set(parsedService.data);
		return await goto('/credential-offer');
	}
	log('Failed to parse URL data for either credential offer or verification.');
};
