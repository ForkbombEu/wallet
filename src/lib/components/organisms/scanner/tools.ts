import { getCredentialsSdjwt } from '$lib/preferences/credentials';
import { CapacitorHttp, type HttpResponse } from '@capacitor/core';
import { z } from 'zod';
import { Slangroom } from '@slangroom/core';
import { helpers } from '@slangroom/helpers';
import { zencode } from '@slangroom/zencode';
import { pocketbase } from '@slangroom/pocketbase';
import { http } from '@slangroom/http';
import verQrToInfo from '$lib/mobile_zencode/wallet/ver_qr_to_info.zen?raw'
import verQrToInfoKeys from '$lib/mobile_zencode/wallet/ver_qr_to_info.keys.json?raw'

const slangroom = new Slangroom(helpers, zencode, pocketbase, http);

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
			credential: Credential;
	  }
	| {
			type: 'service';
			service: Service;
	  };

const allowedDomains = [
	'http://oracle1.zenswarm.forkbomb.eu:3366/verify-credential',
	'https://beta.signroom.io',
	'https://dashboard.didroom.com',
	'htps://admin.didroom.com'
];

function isUrlAllowed(url: string): boolean {
	return allowedDomains.includes(url);
}

export const parseQr = (value: string): ParseQrResults => {
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
		delete parsedValue.type
		return { result: 'ok', data: { type, service: parsedValue as Service } };
	} else {
		const p = getCredentialQrInfo(parsedValue as Credential)
		console.log(p);
		return { result: 'ok', data: { type, credential: parsedValue as Credential } };
	}
};

export const verifyCredential = async (credential: Credential) => {
	const options = {
		url: credential.url,
		headers: {
			'Content-Type': 'application/json'
		},
		data: { registrationToken: credential.registrationToken, message: 'ok' }
	};

	const response: HttpResponse = await CapacitorHttp.post(options);
	return response;
};

export const getCredentialQrInfo = async (qrJSON:Credential)=> {
	console.log(qrJSON)
	const myCredentials = await getCredentialsSdjwt()
	console.log(myCredentials)
	if (!myCredentials) return { result: 'error', message: 'no credentials' };
	const data = {
		...qrJSON,
		credential_array: myCredentials
	}
	console.log(data)

	const res = await slangroom.execute(verQrToInfo, { data, keys: JSON.parse(verQrToInfoKeys) });
	console.log(res)
	const res2 = await slangroom.execute(`Rule unknown ignore
	Given I connect to 'url' and send object 'body' and do post and output into 'result'
	Given I have a 'string dictionary' named 'result'
	Then print data`, {
		data: res.result.post
	})

	console.log(res2)
	return res;
}

