import { getCredentialsbySdjwts } from '$lib/preferences/credentials';
import { verificationStore } from '$lib/verificationStore';
import { get } from 'svelte/store';

export const load = async () => {
	const { vps } = get(verificationStore);
	const credentials = await getCredentialsbySdjwts(vps);
    return { credentials };
};
