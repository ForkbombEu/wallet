import { Preferences } from '@capacitor/preferences';

export const setPreference = async (key: string, value: string) => {
	await Preferences.set({
		key,
		value
	});
};

export const getPreference = async (key: string) => {
	const { value } = await Preferences.get({ key });
	return value;
};

export const removePreference = async (key: string) => {
	await Preferences.remove({ key });
};

export const getStructuredPreferences = async <T>(key: string): Promise<T | undefined> => {
	try {
		const { value } = await Preferences.get({ key });
		if (value) {
			// Attempt to parse the JSON string, and cast it to the specified type
			return JSON.parse(value) as T;
		}
	} catch (error) {
		console.error(`Error while getting preference: ${key}`, error);
	}
	return undefined;
};