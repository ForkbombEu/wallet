import type { Service } from '$lib/components/organisms/scanner/tools';
import type { Keyring } from '$lib/keypairoom';
import { getDIDPreference } from '$lib/preferences/did';
import { getKeypairPreference } from '$lib/preferences/keypair';
import { Slangroom } from '@slangroom/core';
import { helpers } from '@slangroom/helpers';
import { http } from '@slangroom/http';
import { zencode } from '@slangroom/zencode';
import holder_request_keys from '../../../mobile_zencode/wallet/holder_request_authorizationCode.keys.json?raw';
import holder_qr_to_well_known_test from '../../../mobile_zencode/wallet/holder_qr_to_well-known-test.zen?raw';
import holder_qr_to_well_known_test_keys from '../../../mobile_zencode/wallet/holder_qr_to_well-known-test.keys.json?raw';
import holder_request_authorizationCode from '../../../mobile_zencode/wallet/holder_request_authorizationCode.zen?raw';

const slangroom = new Slangroom([http, helpers, zencode]);

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
	qr: Service,
	keys: Keys,
	wellKnown:any,
	holder_claims: any = {
		given_name: 'Pippo',
		family_name: 'Peppe',
		is_human: true
	}
) => {
	const request = await slangroom.execute(holder_request_authorizationCode, {
		data: {
			'!external-qr-code-content': qr,
			oauth_flow_parameters: {
				// ...wellKnown,
				authorize_endpoint: '/authorize',
				par_endpoint: '/par',
				token_endpoint: '/token',
				grant_type: 'authorization_code',
				credential_endpoint: '/credential',
				'jwt-body-params': {
					response_type: 'code',
					code_challenge_method: 'S256',
					state: 'xyz',
					redirectUris: ['https://didroom.com/']
				},
				format: 'vc+sd-jwt',
				vct: 'Auth1',
				Authorization: 'BEARER '
			},
			holder_claims:{
				...holder_claims,
				is_human: true
			}
		},
		keys: { ...JSON.parse(holder_request_keys), ...keys }
	});

	return request.result;
};

export const fromQrToWellKnown = async (qr: Service) => {
	console.log(qr, JSON.parse(holder_qr_to_well_known_test_keys));
	return await slangroom.execute(holder_qr_to_well_known_test, {
		data: qr,
		keys: JSON.parse(holder_qr_to_well_known_test_keys)
	});
};
