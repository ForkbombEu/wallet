import { z } from 'zod';

export type ParseQrResults =
	| {
			result: 'error';
			message: string;
	  }
	| {
			result: 'ok';
			credential: Credential;
	  }
	| undefined;

const credentialSchema = z.object({
	name: z.string(),
	issuedBy: z.string(),
	url: z.string().url(),
	registrationToken: z.string()
});

export type Credential = z.infer<typeof credentialSchema>;

const allowedDomains = ['http://localhost', 'https://beta.signroom.io'];

function isUrlAllowed(url: string): boolean {
	const urlObject = new URL(url);
	const urlHost = urlObject.hostname;

	return allowedDomains.some((domain) => {
		const regex = new RegExp(`^${domain.replace(/\./g, '\\.')}(\\.\\w+)*$`, 'i');
		return regex.test(urlHost);
	});
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
