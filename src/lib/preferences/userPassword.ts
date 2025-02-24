import { getPreference } from ".";
import { setPreference } from ".";

export const USER_PASSWORD_KEY = "USER_PASSWORD";

export const getUserPassword = async (): Promise<string | null> => {
    return await getPreference(USER_PASSWORD_KEY);
};

export const setUserPassword = async (password: string) => {
    await setPreference(USER_PASSWORD_KEY, password);
};