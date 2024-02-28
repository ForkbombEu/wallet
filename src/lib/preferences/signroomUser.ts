import { getStructuredPreferences, setStructuredPreferences } from '.';

//

export const CREDENTIALS_PREFERENCES_KEY = 'signroomUser';

type UserPreference = {
	id: string;
	password: string;
	email: string;
};

export const setUser = async (id: string, password: string, email: string) => {
	await setStructuredPreferences(CREDENTIALS_PREFERENCES_KEY, { id, password, email }, true);
};

export function getUser(): Promise<UserPreference | undefined> {
	return getStructuredPreferences(CREDENTIALS_PREFERENCES_KEY, true);
}
