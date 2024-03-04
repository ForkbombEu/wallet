import { Slangroom } from '@slangroom/core';
import { http } from '@slangroom/http';
import { holder_to_authorize_on_authz_server } from './contracts';
import { getKeypairPreference } from '$lib/preferences/keypair';
import { getDIDPreference } from '$lib/preferences/did';
import type { Keyring } from '$lib/keypairoom';

const slangroom = new Slangroom(http);

const p = await getKeypairPreference();
const keyring = p!.keyring;
//@ts-expect-error we shall have a type for the Did object or save just the id
const client_id = (await getDIDPreference())!.result.didDocument.id;

export type ExternalQrCodeContent = {
	scope: string;
	relying_party: string;
	resource: string;
	authorization_server: string;
};
export type Keys = {
	keyring: Keyring;
	client_id: string;
};
export const askCredential = async (
	qr: ExternalQrCodeContent,
	keys: Keys = {
		keyring,
		client_id
	}
) =>
	await slangroom.execute(holder_to_authorize_on_authz_server, {
		data: {
			'!external-qr-code-content': {
				scope: 'Auth1',
				relying_party: 'http://relying-party1.zenswarm.forkbomb.eu:3100',
				resource: 'http://issuer1.zenswarm.forkbomb.eu:3100/',
				authorization_server: 'http://authz-server1.zenswarm.forkbomb.eu:3100'
			},
			credential_request_specific_data: {
				'jwt-body-params': {
					response_type: 'code',
					code_challenge_method: 'S256',
					state: 'xyz',
					redirectUris: ['https://didroom.com/']
				},
				request: {
					headers: {
						Authorization: 'basic'
					}
				},
				client: {
					grants: ['authorization_code'],
					redirectUris: ['https://didroom.com/']
				}
			}
		},
		keys
	});
