import { getStructuredPreferences, setStructuredPreferences } from '.';

//

export const CREDENTIALS_PREFERENCES_KEY = 'user';

type UserPreference = {
	id: string;
	email: string;
	name?: string;
	logo?: string;
};

export const setUser = async (id: string, email: string, name?:string, logo?:string) => {
	await setStructuredPreferences(CREDENTIALS_PREFERENCES_KEY, { id, email, name, logo }, true);
};

export async function getUser(): Promise<UserPreference | undefined> {
	return await getStructuredPreferences(CREDENTIALS_PREFERENCES_KEY, true);
}