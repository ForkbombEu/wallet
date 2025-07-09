import dayjs from 'dayjs';
import { getStructuredPreferences, setStructuredPreferences } from '.';
import type { Logo } from '$lib/utils/types';

//

export const CREDENTIALS_PREFERENCES_KEY = 'credentials';

export type LdpVc = {
	'@context': Array<string>;
	credentialSubject: Record<string, unknown>;
	issuer: string;
	proof: {
		created: string;
		cryptosuite: string;
		proofPurpose: string;
		proofValue: string;
		type: string;
		verificationMethod: string;
	};
	type: Array<string>;
	validUntil: string;
};

export type Credential = // soon will be implemented also mdoc
	| {
			id: number;
			type: 'ldp_vc';
			configuration_ids: string[];
			ldpVc: LdpVc;
			issuer: string;
			issuerUrl: string;
			display_name: string;
			description: string;
			expirationDate: number;
			verified: boolean;
			logo: Logo;
	  }
	| {
			id: number;
			type: 'sdjwt';
			configuration_ids: string[];
			sdJwt: string;
			issuer: string;
			issuerUrl: string;
			display_name: string;
			description: string;
			expirationDate: number;
			verified: boolean;
			logo: Logo;
	  };

const progressiveId = async () => {
	const preferences = await getCredentialsPreference();
	if (preferences) {
		return Math.max(...preferences.map((m) => m.id)) + 1;
	}
	return 1;
};

export async function setCredentialPreference(
	credential: Omit<Credential, 'id'>
): Promise<Credential> {
	const credentials = await getCredentialsPreference();
	const id = await progressiveId();
	let c: any;
	if (credential.type === 'ldp_vc') {
		c = {
			...credential,
			id
		};
	} else {
		c = {
			...credential,
			id
		};
	}
	if (credentials) {
		credentials.push(c);
		await setStructuredPreferences(CREDENTIALS_PREFERENCES_KEY, credentials, true);
		return c;
	}

	await setStructuredPreferences(CREDENTIALS_PREFERENCES_KEY, [c], true);
	return c;
}

export async function getCredentialsPreference(): Promise<Credential[] | undefined> {
	return await getStructuredPreferences(CREDENTIALS_PREFERENCES_KEY, true);
}

export async function getCredentialsbySdjwts(sdjwts: string[]): Promise<Credential[]> {
	const credentials = await getCredentialsPreference();
	if (!credentials) return [];
	const sdjwtsWithoutDisclosures = sdjwts.map((sdjwt) => sdjwt.split('~')[0]);
	return credentials.filter((credential) =>
		credential.type === "sdjwt" && sdjwtsWithoutDisclosures.includes(credential.sdJwt.split('~')[0])
	);
}

export async function getCredentialsFormat(): Promise<(string | LdpVc | undefined)[]> {
	const credentials = await getCredentialsPreference();
	if (!credentials) return [];
	return credentials.map((credential) => {
		if (credential.type === 'ldp_vc') {
			return credential.ldpVc;
		} else if (credential.type === 'sdjwt') {
			return credential.sdJwt;
		}
	});
}

export async function removeCredentialPreference(id: number) {
	const credentials = await getCredentialsPreference();
	if (!credentials) return;
	const newCredentials = credentials.filter((credential) => credential.id !== id);
	await setStructuredPreferences(CREDENTIALS_PREFERENCES_KEY, newCredentials, true);
}

export async function updateCredentialPreference(credential: Credential) {
	const credentials = await getCredentialsPreference();
	if (!credentials) return;
	const newCredentials = credentials.map((c) => (c.id === credential.id ? credential : c));
	await setStructuredPreferences(CREDENTIALS_PREFERENCES_KEY, newCredentials, true);
}

export async function getCredentialPreference(id: string): Promise<Credential | undefined> {
	const credentials = await getCredentialsPreference();
	if (!credentials) return;
	return credentials.find((credential) => String(credential.id) === id);
}

export async function getExpiredCredentials(): Promise<Credential[]> {
	const credentials = await getCredentialsPreference();
	if (!credentials) return [];
	return credentials.filter((credential) => credential.expirationDate < dayjs().unix());
}
