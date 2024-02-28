import TEE from '$lib/nativeHooks/TEEPlugin';
import { getPreference, setPreference } from '.';

//

export const DID_PREFERENCES_KEY = 'did';

export async function setDIDPreference(did: object) {
	await TEE.generateKey();
	await setPreference(DID_PREFERENCES_KEY, JSON.stringify(did), true);
}

export async function getDIDPreference(): Promise<object | undefined> {
	const DIDString = await getPreference(DID_PREFERENCES_KEY, true);
	if (!DIDString) return undefined;
	return JSON.parse(DIDString);
}
