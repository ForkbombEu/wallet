import { verificationStore } from '$lib/verificationStore';
import { get } from 'svelte/store';

export const load = async () => {
	const { vps } = get(verificationStore);
	const credentials = vps.map((vp) => vp.card)
	return { credentials };
};
