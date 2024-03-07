import { Slangroom } from '@slangroom/core';
import { http } from '@slangroom/http';
import { plainText as holder_to_authorize_on_authz_server } from './zencode/holder_to_par_on_authz_server.zen';
import { getKeypairPreference } from '$lib/preferences/keypair';
import { getDIDPreference } from '$lib/preferences/did';
import type { Keyring } from '$lib/keypairoom';

const slangroom = new Slangroom(http);

export const getKeys = async () => {
	//@ts-expect-error we shall have a type for the Did object or save just the id
	const client_id = (await getDIDPreference())?.result?.didDocument.id;
	const p = await getKeypairPreference();
	const keyring = p!.keyring;
	return {
		keyring,
		client_id
	};
};

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
	qr: ExternalQrCodeContent = {
		scope: 'Auth1',
		relying_party: 'https://relying-party1.zenswarm.forkbomb.eu:3100',
		resource: 'https://issuer1.zenswarm.forkbomb.eu:3100/',
		authorization_server: 'https://authz-server1.zenswarm.forkbomb.eu'
	},
	keys: Keys
) => {
	const request = await slangroom.execute(holder_to_authorize_on_authz_server, {
		data: {
			'!external-qr-code-content': qr,
			credential_request_specific_data: {
				'jwt-body-params': {
					response_type: 'code',
					code_challenge_method: 'S256',
					state: 'xyz',
					redirectUris: ['https://didroom.com/']
				}
			}
		},
		keys
	});
	const res = await fetch(qr.authorization_server + 'par', {
		method: 'POST',
		body: JSON.stringify(request.result)
	});

	const data = await res.json();
	return { response: data, slangroomExecution: request.result };
};
