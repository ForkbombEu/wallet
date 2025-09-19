import { decodeSdJwt } from '$lib/openId4vci';
import { verificationStore } from '$lib/verificationStore';
import { get } from 'svelte/store';

export async function load() {
    const { vps, post_url } = get(verificationStore);
    const { card } = vps[0];

    let propertiesArray;
    if (typeof card === 'string') {
        const decodedSdJwt = await decodeSdJwt(card);
        const disclosures = decodedSdJwt.credential.disclosures;
        propertiesArray = disclosures.map(([_, s, t]) => [s, t]);
    } else {
        propertiesArray = Object.entries(card.credentialSubject);
    }

    return { propertiesArray, post_url };
}
