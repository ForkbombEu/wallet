import { getStructuredPreferences, setStructuredPreferences } from '.';

//

export const CREDENTIALS_PREFERENCES_KEY = 'signroomUser';

export const setUser = async (id: string, password:string, email:string) => {
    await setStructuredPreferences(CREDENTIALS_PREFERENCES_KEY, {id, password, email}, true);
}

export const getUser = async () => {
    return await getStructuredPreferences(CREDENTIALS_PREFERENCES_KEY, true);
}
