import { getCredentialsPreference, type LdpVc, type Credential } from '$lib/preferences/credentials';
import { decodeSdJwt } from '$lib/openId4vci';
import { verificationStore } from '$lib/verificationStore';
import { get } from 'svelte/store';

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
	claims: Record<string, unknown>;
	logo: string | undefined;
};;
interface ClaimSet {
  required: boolean;
  claims: Array<
    Array<
      [string, Array<Claim>, (string | signedLdpVc)[]]
    >
  >;
}

async function handleSdJwt(card: string, myCredentials: Credential[] | undefined): Promise<Claim> {
    const decodedSdJwt = await decodeSdJwt(card);
    const d = decodedSdJwt.credential.disclosures.reduce((acc, [_, s, t]) => {
		acc[s] = typeof(t) === 'object' ? JSON.stringify(t) : t;
		return acc;
	}, {} as Record<string, unknown>);
	const credLogo = myCredentials!.find(c => c.type === 'sdjwt' && c.sdJwt.split('~')[0] === card.split('~')[0])?.logo.uri;
	return {
		issuer: decodedSdJwt.credential.jwt.payload.iss,
		type: [ '', decodedSdJwt.credential.jwt.payload.type ],
		claims: d,
		logo: credLogo
	}
}

function handleLdpVC(card: LdpVc, myCredentials: Credential[] | undefined): Claim {
	for (const [key, value] of Object.entries(card.credentialSubject)) {
		if (typeof value === "object" && value !== null) {
			card.credentialSubject[key] = JSON.stringify(value);
		}
	}
	const credLogo = myCredentials!.find(c => c.type === 'ldp_vc' && JSON.stringify(c.ldpVc) === JSON.stringify(card))?.logo.uri;
	return {
		issuer: card.issuer,
		type: card.type,
		claims: card.credentialSubject,
		logo: credLogo
	}
}

export const load = async () => {
	const myCredentials = await getCredentialsPreference();
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
                    const claim_array = value.map(e => handleSdJwt(e.card as string, myCredentials));
					const signed_array = value.map(e => e.signed);
                    const resolved = await Promise.all(claim_array);
                    cred_set_array.push([key, resolved, signed_array]);
                } else {
                    const claim_array = value.map(e => handleLdpVC(e.card as LdpVc, myCredentials));
					const signed_array = value.map(e => e.signed);
                    cred_set_array.push([key, claim_array, signed_array]);
                }
            }
            s.claims.push(cred_set_array);
        }
        credentials.push(s);
    }
	return { credentials, verifier: post_url };
};
