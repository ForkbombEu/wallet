import { getPreference } from "$lib/preferences/prefereces";
import { redirect } from "@sveltejs/kit";
import TEE from '$lib/nativeHooks/TEEPlugin';

export const load = async () => {
	if (Boolean(await getPreference('keyring'))) throw redirect(303, 'r/wallet');
	TEE.generateKey();
};


