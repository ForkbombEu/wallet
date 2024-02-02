import { getPreference, setPreference } from '.';

//

export async function isAppLocked() {
	return await getLockedPreference();
}

export async function lockApp() {
	await setLockedPreference(true);
}

export async function unlockApp() {
	await setLockedPreference(false);
}

//

export const LOCKED_PREFERENCE_KEY = 'locked';

export async function getLockedPreference(): Promise<boolean> {
	const lockedPreference = await getPreference(LOCKED_PREFERENCE_KEY);
	if (!lockedPreference) return false;
	return JSON.parse(lockedPreference);
}

export async function setLockedPreference(state: boolean) {
	await setPreference(LOCKED_PREFERENCE_KEY, JSON.stringify(state));
}
