import { getStructuredPreferences, setStructuredPreferences } from '.';

//

export const CREDENTIALS_PREFERENCES_KEY = 'credentials';

export type Credential = {
	id: string;
	issuer: string;
	name: string;
	description: string;
	expirationDate: string;
	verified: boolean;
};

const generateId = (credentials?: Credential[]) => {
	let id = Math.random().toString(36).substring(7);
	if (!credentials) return id;
	const ids = credentials.map((c) => c.id);
	while (ids.includes(id)) {
		id = Math.random().toString(36).substring(7);
	}
	return id;
};

export async function setCredentialPreference(credential: Omit<Credential, 'id'>) {
	const credentials = await getCredentialsPreference();
	const c = {
		...credential,
		id: generateId(credentials)
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
