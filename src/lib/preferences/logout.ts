import { KEYPAIR_PREFERENCES_KEY } from './keypair';
import { USER_PREFERENCES_KEY } from './user';
import { CREDENTIALS_PREFERENCES_KEY } from './credentials';
import { DID_PREFERENCES_KEY } from './did';
import { removePreference } from '.';

export const logout = async () => {
	await removePreference(KEYPAIR_PREFERENCES_KEY);
	await removePreference(USER_PREFERENCES_KEY);
	await removePreference(CREDENTIALS_PREFERENCES_KEY);
	await removePreference(DID_PREFERENCES_KEY);
};
