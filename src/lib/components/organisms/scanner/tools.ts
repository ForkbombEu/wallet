import { z } from 'zod';
import { CapacitorHttp, type HttpResponse } from '@capacitor/core';

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
	name: z.string(),
	issuedBy: z.string(),
	url: z.string().url(),
	registrationToken: z.string()
});
const serviceSchema = z.object({
	scope: z.string(),
	id: z.string(),
	relying_party: z.string().url(),
	resource: z.string().url(),
	authorization_server: z.string().url()
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

const allowedDomains = ['http://oracle1.zenswarm.forkbomb.eu:3366/verify-credential', 'https://beta.signroom.io'];

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

	if (type == 'credential' && !isUrlAllowed(parsedValue.url as string)) {
		return { result: 'error', message: 'not allowed verifier url' };
	}
	//todo: validate service urls
	if (type == 'service') {
		return { result: 'ok', data: { type, service: parsedValue as Service } };
	} else {
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
