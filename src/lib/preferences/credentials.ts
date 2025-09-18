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
	return credentials.filter(
		(credential) =>
			credential.type === 'sdjwt' &&
			sdjwtsWithoutDisclosures.includes(credential.sdJwt.split('~')[0])
	);
}

export async function getCredentialsbyByCredentialSubject(credentialSubject: string[]): Promise<Credential[]> {
	const credentials = await getCredentialsPreference();
	if (!credentials) return [];
	return credentials.filter((credential) => {
		if (credential.type === 'ldp_vc') {
			credentialSubject.forEach((cs) => {
				if (Object.keys(credential.ldpVc.credentialSubject).includes(cs)) {
					return true;
				}
			});
			return false;
		} else if (credential.type === 'sdjwt') {
			// const sdJwtClaims = credential.sdJwt.split('~')[1];
			// return credentialSubject.some((cs) => sdJwtClaims.includes(cs));
			return false; // TODO: Implement sdjwt claims filtering
		}
		return false;
	});
};

export async function getCredentialsFormat(): Promise<{ 'dc+sd-jwt': string[]; ldp_vc: LdpVc[] }> {
	const credentials = await getCredentialsPreference();
	if (!credentials) return {} as { 'dc+sd-jwt': string[]; ldp_vc: LdpVc[] };
	return credentials.reduce(
		(acc, credential) => {
			if (credential.type === 'sdjwt') {
				acc['dc+sd-jwt'].push(credential.sdJwt);
			} else if (credential.type === 'ldp_vc') {
				acc.ldp_vc[credential.id] = credential.ldpVc;
			}
			return acc;
		},
		{ 'dc+sd-jwt': [], ldp_vc: [] } as { 'dc+sd-jwt': string[]; ldp_vc: LdpVc[] }
	);
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
