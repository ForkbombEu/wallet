import { decodeSdJwt } from '$lib/openId4vci';
import { verificationStore } from '$lib/verificationStore';
import { get } from 'svelte/store';

export const load = async () => {
	const { vps } = get(verificationStore);
	let credentials;
	if (typeof vps[0].card === 'string') {
		credentials = await Promise.all(
			vps.map(async (vp) => {
				const decodedSdJwt = await decodeSdJwt(vp.card as string);
				const res: Record<string, unknown> = {};
				res.issuer = decodedSdJwt.credential.jwt.payload.iss;
				res.type = [ '', decodedSdJwt.credential.jwt.payload.type ]
				res.credentialSubject = decodedSdJwt.credential.disclosures.reduce((acc, [_, s, t]) => {
					acc[s] = t;
					return acc;
				}, {} as Record<string, unknown>);
				return res;
			})
		);
	} else {
		credentials = vps.map((vp) => vp.card);
	}
	return { credentials };
};
