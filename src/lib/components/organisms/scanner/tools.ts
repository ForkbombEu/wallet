import { z } from 'zod';
//@ts-ignore
import { Slangroom } from '@slangroom/core';
//@ts-ignore
import { http } from '@slangroom/http';
import { CapacitorHttp, type HttpResponse } from '@capacitor/core';

export type ParseQrResults =
	| {
			result: 'error';
			message: string;
	  }
	| {
			result: 'ok';
			credential: Credential;
	  };

const credentialSchema = z.object({
	name: z.string(),
	issuedBy: z.string(),
	url: z.string().url(),
	registrationToken: z.string()
});

export type Credential = z.infer<typeof credentialSchema>;

const allowedDomains = ['http://192.168.1.36:3000/verify-credential', 'https://beta.signroom.io'];

function isUrlAllowed(url: string): boolean {
	return allowedDomains.includes(url);
}

export const parseQr = (value: string): ParseQrResults => {
	const notValidQr = 'not valid qr';
	let parsedValue: Record<string, unknown>;
	try {
		parsedValue = JSON.parse(value);
	} catch (e) {
		return { result: 'error', message: notValidQr };
	}
	try {
		credentialSchema.parse(parsedValue);
	} catch (e) {
		return { result: 'error', message: notValidQr };
	}
	if (!isUrlAllowed(parsedValue.url as string)) {
		return { result: 'error', message: 'not allowed verifier url' };
	}
	return { result: 'ok', credential: parsedValue as Credential };
};

// const verifyContract = `
// Rule unknown ignore

// Given I have a 'string dictionary' named 'headers'
// Then I connect to 'url' and send object 'dict' and send headers 'headers' and do post and output into 'results'
// `;

// const slangroom = new Slangroom(http);

export const verifyCredential = async (credential: Credential) => {
	// const res = await slangroom.execute(verifyContract(credential.url, credential.registrationToken), {
	// 	data: {
	// 		url: credential.url,
	// 		dict: {registrationToken:credential.registrationToken}
	// 	},
	// });
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
