import { getStructuredPreferences, setStructuredPreferences } from '.';

//

export const CREDENTIALS_PREFERENCES_KEY = 'credentials';

export type Credential = {
	id: string;
	configuration_ids: string[];
	sdJwt: string;
	issuer: string;
	name: string;
	description: string;
	expirationDate: string;
	verified: boolean;
	logo: { url: string; alt_text: string };
};

export async function setCredentialPreference(credential: Credential) {
	const credentials = await getCredentialsPreference();
	const c = {
		...credential
	};
	if (credentials) {
		credentials.push(c);
		await setStructuredPreferences(CREDENTIALS_PREFERENCES_KEY, credentials, true);
		return;
	}

	await setStructuredPreferences(CREDENTIALS_PREFERENCES_KEY, [c], true);
}

export async function getCredentialsPreference(): Promise<Credential[] | undefined> {
	return await getStructuredPreferences(CREDENTIALS_PREFERENCES_KEY, true);
}

export async function removeCredentialPreference(id: string) {
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
	return credentials.find((credential) => credential.id === id);
}
