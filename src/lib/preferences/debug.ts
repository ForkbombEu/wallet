import { getPreference, setPreference } from '.';

export const DEBUG_KEY = 'debug';
export async function setDebugModeTrue() {
	await setPreference(DEBUG_KEY, "true", false);
}
export async function setDebugModeFalse() {
    await setPreference(DEBUG_KEY, "false", false);
}
export async function getDebugMode() {
    const debug = await getPreference(DEBUG_KEY, false);
	return "true" == debug
}
