import { verificationStore } from '$lib/verificationStore';
import { get } from 'svelte/store';
import type { QrToInfoResults } from '$lib/components/organisms/scanner/tools';

interface CredentialSetGroup {
    required: boolean;
    options: {
        credentials: {
            id: string;
            claims: {
                path: string;
                value: string | undefined;
            }[][];
        }[];
    }[];
}

function claimsKeyValue(claim: QrToInfoResults["dcql_query"]["credentials"][number]["claims"][number]) {
    return {
        path: claim.path.join('.'),
        value: claim.values ? claim.values.join(', ') : undefined
    }
}
function getClaims(credential: QrToInfoResults["dcql_query"]["credentials"][number]) {
    if(credential.claim_sets) {
        return credential.claim_sets.map(set =>
            set.map( id => {
                const c = credential.claims.find(x => x.id === id);
                if (!c) throw new Error(`Missing claim ${id}`);
                return claimsKeyValue(c);
            })
        );
    }
    return [credential.claims.map((c) => claimsKeyValue(c))];
}


export async function load() {
    const { dcql_query, post_url } = get(verificationStore);
    const { credentials, credential_sets } = dcql_query;
    const propertiesArray: CredentialSetGroup[] = [];

    if (credential_sets && credential_sets.length > 0) {
        for (const set of credential_sets) {
            const required = set.required !== false;
            const setGroup: CredentialSetGroup = {
                required,
                options: [],
            };
            for (const combo of set.options) {
                const comboCredentials: CredentialSetGroup["options"][number]["credentials"] = [];
                for (const credId of combo) {
                    const credential = credentials.find(c => c.id === credId);
                    if (!credential) {
                        console.log(`Missing credential ${credId}`);
                        throw new Error(`Missing credential ${credId}`);
                    }
                    comboCredentials.push({
                        id: credId,
                        claims: getClaims(credential),
                    });
                }
                setGroup.options.push({ credentials: comboCredentials });
            }
            propertiesArray.push(setGroup);
        }
    } else {
        // Fallback: no credential_sets, so treat each credential as its own "set"
        for (const credential of credentials) {
            propertiesArray.push({
                required: true,
                options: [
                    {
                        credentials: [
                            { id: credential.id, claims: getClaims(credential) },
                        ],
                    },
                ],
            });
        }
    }
    return { propertiesArray, post_url };
}
