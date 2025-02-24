import { getStructuredPreferences } from '.';

//

export const USER_PREFERENCES_KEY = 'pb_auth';

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
	const auth = (await getStructuredPreferences(USER_PREFERENCES_KEY)) as {
		record: UserPreference;
	} | undefined;
	return auth?.record;
}
