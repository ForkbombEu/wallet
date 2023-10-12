import { Preferences } from '@capacitor/preferences';

export const setPreference = async (key: string, value: string) => {
	await Preferences.set({
		key,
		value
	});
};

export const getPreference = async (key: string) => {
	const { value } = await Preferences.get({ key });
    console.log(value);
	return value;
};

export const removePreference = async (key: string) => {
	await Preferences.remove({ key });
};
