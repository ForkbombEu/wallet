import { getPreference, setPreference } from '.';

//

export const DID_PREFERENCES_KEY = 'did';

export async function setDIDPreference(did: object) {
	await setPreference(DID_PREFERENCES_KEY, JSON.stringify(did), true);
}

export async function getDIDPreference(): Promise<object | undefined> {
	const DIDString = await getPreference(DID_PREFERENCES_KEY, true);
	if (!DIDString) return undefined;
	const parsedDid = JSON.parse(DIDString);
	return parsedDid.result || parsedDid
}
