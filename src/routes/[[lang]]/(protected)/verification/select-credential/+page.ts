import { decodeSdJwt } from '$lib/openId4vci';
import { verificationStore } from '$lib/verificationStore';
import { get } from 'svelte/store';
import type { LdpVc } from '$lib/preferences/credentials';

type signedLdpVc = {
	'@context': Array<string>;
	holder: string;
	id: string;
	proof: {
		challenge: string;
		created: string;
		cryptosuite: string;
		domain: string;
		proofPurpose: string;
		proofValue: string;
		type: string;
		verificationMethod: string;
	};
	type: Array<string>;
	verifiableCredential: Array<LdpVc>;
}
type Claim = {
	issuer: string;
	type: string[];
	claims: Record<string, unknown>
};;
interface ClaimSet {
  required: boolean;
  claims: Array<
    Array<
      [string, Array<Claim>, (string | signedLdpVc)[]]
    >
  >;
}

async function handleSdJwt(card: string): Promise<Claim> {
    const decodedSdJwt = await decodeSdJwt(card);
    const d = decodedSdJwt.credential.disclosures.reduce((acc, [_, s, t]) => {
		acc[s] = t;
		return acc;
	}, {} as Record<string, unknown>);
	return {
		issuer: decodedSdJwt.credential.jwt.payload.iss,
		type: [ '', decodedSdJwt.credential.jwt.payload.type ],
		claims: d
	}
}

function handleLdpVC(card: LdpVc) {
	return {
		issuer: card.issuer,
		type: card.type,
		claims: card.credentialSubject
	}
}

export const load = async () => {
	const { vps, post_url } = get(verificationStore);
	const credentials = [];
	console.log(vps)
	for (const set of vps) {
        const s: ClaimSet = {
            required: set.required,
            claims: []
        };
        for (const cred of set.matching_credential_sets) {
            const cred_set_array: ClaimSet["claims"][number] = []
            for (const [key, value] of Object.entries(cred)) {
                if (typeof value[0].card === 'string') {
                    const claim_array = value.map(e => handleSdJwt(e.card as string));
					const signed_array = value.map(e => e.signed);
                    const resolved = await Promise.all(claim_array);
                    cred_set_array.push([key, resolved, signed_array]);
                } else {
                    const claim_array = value.map(e => handleLdpVC(e.card as LdpVc));
					const signed_array = value.map(e => e.signed)
                    cred_set_array.push([key, claim_array, signed_array]);
                }
            }
            s.claims.push(cred_set_array)
        }
        credentials.push(s)
    }
	return { credentials, verifier: post_url };
};
