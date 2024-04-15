import { getStructuredPreferences } from '.';

//

export const CREDENTIALS_PREFERENCES_KEY = 'pb_auth';

export type UserPreference = {
	avatar: string;
	bitcoin_public_key: string;
	collectionId: string;
	collectionName: string;
	created: string;
	ecdh_public_key: string;
	eddsa_public_key: string;
	email: string;
	emailVisibility: boolean;
	es256_public_key: string;
	ethereum_address: string;
	id: string;
	name: string;
	reflow_public_key: string;
	updated: string;
	username: string;
	verified: boolean;
};

export async function getUser(): Promise<UserPreference | undefined> {
	const auth = (await getStructuredPreferences(CREDENTIALS_PREFERENCES_KEY, true)) as {
		model: UserPreference;
	} | undefined;
	return auth?.model;
}
