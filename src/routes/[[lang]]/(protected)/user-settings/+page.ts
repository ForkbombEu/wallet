import { getUser } from '$lib/preferences/user';

// export const _userSettingsKey = 'load:user-settings';

export const load = async ({depends}) => {
	// depends(_userSettingsKey);
	const user = await getUser();
	return { user };
};
