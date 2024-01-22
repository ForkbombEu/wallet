import type { Keypair } from '$lib/keypairoom';
import TEE from '$lib/nativeHooks/TEEPlugin';
import { getPreference, setPreference } from '.';

//

export const KEYPAIR_PREFERENCES_KEY = 'keyring';

export async function setKeypairPreference(keypair: Keypair) {
	await TEE.generateKey();
	await setPreference(KEYPAIR_PREFERENCES_KEY, JSON.stringify(keypair), true);
}

export async function getKeypairPreference(): Promise<Keypair | undefined> {
	const keypairString = await getPreference(KEYPAIR_PREFERENCES_KEY, true);
	if (!keypairString) return undefined;
	return JSON.parse(keypairString) as Keypair;
}
