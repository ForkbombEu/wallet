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
import { backendUri } from '$lib/backendUri';

const slangroom = new Slangroom(helpers, zencode, pocketbase, http);

export type QrToInfoResults = {
	info: Info;
	post_without_vp: PostWithoutVp;
	vps: string[];
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

export type ParseQrResults =
	| {
			result: 'error';
			message: string;
	  }
	| {
			result: 'ok';
			data: Data;
	  };

const credentialSchema = z.object({
	rp: z.string().url(),
	t: z.string(),
	m: z.literal('f'),
	exp: z.number(),
	ru: z.string().url(),
	sid: z.string().length(5),
	id: z.string()
});

const serviceSchema = z.object({
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

export const parseQr = async (value: string): Promise<ParseQrResults> => {
	const notValidQr = 'not valid qr';
	let parsedValue: Record<string, unknown>;
	let type: 'credential' | 'service';
	try {
		parsedValue = JSON.parse(value);
	} catch (e) {
		return { result: 'error', message: notValidQr };
	}
	if (credentialSchema.safeParse(parsedValue).success) {
		type = 'credential';
		parsedValue.type = 'credential';
	} else if (serviceSchema.safeParse(parsedValue).success) {
		type = 'service';
		parsedValue.type = 'service';
	} else {
		return { result: 'error', message: notValidQr };
	}

	// if (type == 'credential' && !isUrlAllowed(parsedValue.url as string)) {
	// 	return { result: 'error', message: 'not allowed verifier url' };
	// }

	//todo: validate service urls
	if (type == 'service') {
		delete parsedValue.type;
		return { result: 'ok', data: { type, service: parsedValue as Service } };
	} else {
		try {
			const credential = await getCredentialQrInfo(parsedValue as Credential);
			return { result: 'ok', data: { type, credential } };
		} catch (err) {
			return { result: 'error', message: `error getting credential info: ${err}` };
		}
	}
};

export const verifyCredential = async (postWVP: PostWithoutVp, vp: string) => {
	const post = {
		...postWVP,
		body: {
			...postWVP.body,
			vp
		}
	};
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
		credential_array: myCredentials,
		pb_url: backendUri
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
