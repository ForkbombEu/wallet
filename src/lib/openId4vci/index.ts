import { Slangroom } from '@slangroom/core';
import { http } from '@slangroom/http';
import { helpers } from '@slangroom/helpers';
import { zencode } from '@slangroom/zencode';
import { getKeypairPreference } from '$lib/preferences/keypair';
import { getDIDPreference } from '$lib/preferences/did';
import type { Keyring } from '$lib/keypairoom';
import holder_request_authorizationCode from '../../../mobile_zencode/wallet/holder_request_authorizationCode.zen?raw';
import holder_to_par_on_authz_server from '../../../mobile_zencode/wallet/1_holder_to_par_on_authz_server.zen?raw';
import holder_fetch_request_uri from '../../../mobile_zencode/wallet/3_holder_fetch_request_uri.zen?raw';
import holder_sends_authorizationCode_and_more_to_api_token from '../../../mobile_zencode/wallet/5_holder_sends_authorizationCode_and_more_to_api_token.zen?raw';
import type { Service } from '$lib/components/organisms/scanner/tools';

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
export const askCredential = async (qr: Service, keys: Keys) => {
	const request = await slangroom.execute(holder_request_authorizationCode, {
		data: {
			'!external-qr-code-content': qr,
			oauth_flow_parameters: {
				authorize_endpoint: '/authorize',
				par_endpoint: '/par',
				token_endpoint: '/token',
				grant_type: 'authorization_code',
				'jwt-body-params': {
					response_type: 'code',
					code_challenge_method: 'S256',
					state: 'xyz',
					redirectUris: ['https://didroom.com/']
				}
			}
		},
		keys: {
			zen_1: holder_to_par_on_authz_server,
			zen_2: holder_fetch_request_uri,
			zen_3: holder_sends_authorizationCode_and_more_to_api_token,
			keys_1: {},
			data_1: {},
			oauth_flow_parameters_path: 'oauth_flow_parameters',
			'!external-qr-code-content_path': '!external-qr-code-content',
			request_uri_path: 'request_uri',
			expires_in_path: 'expires_in',
			code_path: 'code',
			data_path: 'data',
			code_verifier_path: 'code_verifier',
			authorization_server_endpoint_par_path: 'authorization_server_endpoint_par',
			authorization_server_authorize_endpoint_path: 'authorization_server_authorize_endpoint',
			'!authorization_server_token_endpoint_path': '!authorization_server_token_endpoint',
			'r.code_path': 'result.code',
			'r.request_uri_path': 'result.request_uri',
			'r.expires_in_path': 'result.expires_in',
			keyring_path: 'keyring',
			client_id_path: 'client_id',
			...keys
		}
	});
	return request.result;
};
