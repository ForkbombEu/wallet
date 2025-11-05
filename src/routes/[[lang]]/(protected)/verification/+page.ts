import { decodeSdJwt } from '$lib/openId4vci';
import { verificationStore } from '$lib/verificationStore';
import { get } from 'svelte/store';
import type { LdpVc } from '$lib/preferences/credentials';

type SdJwtClaim = [string, string];
type GenericClaim = [string, unknown];
interface ClaimSet {
  required: boolean;
  claims: Array<
    Array<
      [string, Array<Array<SdJwtClaim>> | Array<Array<GenericClaim>>]
    >
  >;
}

async function handleSdJwt(card: string): Promise<Array<SdJwtClaim>> {
    const decodedSdJwt = await decodeSdJwt(card);
    const disclosures = decodedSdJwt.credential.disclosures;
    return disclosures.map(([_, s, t]) => [s, t]);
}

export async function load() {
    const { vps, post_url } = get(verificationStore);
    const propertiesArray: ClaimSet[] = [];
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
                    const resolved = await Promise.all(claim_array);
                    cred_set_array.push([key, resolved]);
                } else {
                    const claim_array = value.map(e => Object.entries((e.card as LdpVc).credentialSubject));
                    cred_set_array.push([key, claim_array]);
                }
            }
            s.claims.push(cred_set_array)
        }
        propertiesArray.push(s)
    }
    return { propertiesArray, post_url };
}
