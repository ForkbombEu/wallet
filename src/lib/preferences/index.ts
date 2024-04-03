import { Preferences } from '@capacitor/preferences';
import TEE from '$lib/nativeHooks/TEEPlugin';

export const setPreference = async (key: string, value: string, confidential: boolean = false) => {
	if (confidential) {
		const res = await TEE.doEncrypt({ msg: value });
		if (!res.success) {
			throw new Error(res.error);
		}
		value = res.result;
	}
	await Preferences.set({
		key,
		value
	});
};

export const getPreference = async (key: string, confidential: boolean = false) => {
	const { value } = await Preferences.get({ key });
	if (confidential && value) {
		const res = await TEE.doDecrypt({ msg: value });
		if (!res.success) {
			throw new Error(res.error);
		}
		return res.result;
	}
	return value;
};

export const removePreference = async (key: string) => {
	await Preferences.remove({ key });
};

export const clearPreferences = async () => {
	await Preferences.clear();
}

export const getStructuredPreferences = async <T>(
	key: string,
	confidential: boolean = false
): Promise<T | undefined> => {
	try {
		const value = await getPreference(key, confidential);
		if (value) {
			// Attempt to parse the JSON string, and cast it to the specified type
			return JSON.parse(value) as T;
		}
	} catch (error) {
		console.error(`Error while getting preference: ${key}`, error);
	}
	return undefined;
};

export const setStructuredPreferences = async <T>(
	key: string,
	value: T,
	confidential: boolean = false
) => {
	await setPreference(key, JSON.stringify(value), confidential);
}

