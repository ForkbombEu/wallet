import type { Service } from '$lib/components/organisms/scanner/tools';
import type { Keyring } from '$lib/keypairoom';
import { getDIDPreference } from '$lib/preferences/did';
import { getKeypairPreference } from '$lib/preferences/keypair';
import { Slangroom } from '@slangroom/core';
import { helpers } from '@slangroom/helpers';
import { http } from '@slangroom/http';
import { zencode } from '@slangroom/zencode';
import holder_qr_to_well_known from '$lib/mobile_zencode/wallet/holder_qr_to_well-known.zen?raw';
import holder_qr_to_well_known_keys from '$lib/mobile_zencode/wallet/holder_qr_to_well-known.keys.json?raw';
import call_par from '$lib/mobile_zencode/wallet/call_par.zen?raw';
import call_par_keys from '$lib/mobile_zencode/wallet/call_par.keys.json?raw';
import call_token_and_credential from '$lib/mobile_zencode/wallet/call_token_and_credential.zen?raw';
import call_token_and_credential_keys from '$lib/mobile_zencode/wallet/call_token_and_credential.keys.json?raw';
import utils_print_decoded_sdjwt from '$lib/mobile_zencode/wallet/utils_print_decoded_sdjwt.zen?raw';
import { log } from '$lib/log';
import type { Logo } from '$lib/utils/types';
import { debugDismiss } from '$lib/components/organisms/debug/debug';
import type { LdpVc } from '$lib/preferences/credentials';
import type { Credential } from '$lib/preferences/credentials';
import { isWeb } from '$lib/utils';

//@ts-ignore
const slangroom = new Slangroom([http, helpers, zencode]);

export const getKeys = async () => {
	const client_id = (await getDIDPreference())?.didDocument.id as string;
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
	code: string,
	credential_parameters: CredentialParameters,
	code_verifier: string
): Promise<CredentialResult> => {
	const redirect_uri = isWeb
		? window.location.protocol + '//' + window.location.host + '/finalize-authentication'
		: 'didroom-wallet://finalize-authentication';
	const data = {
		code,
		credential_parameters,
		code_verifier,
		redirect_uri: redirect_uri
	};
	const keys = JSON.parse(call_token_and_credential_keys);
	const userKeys = await getKeys();
	keys.keyring = userKeys.keyring;
	keys.client_id = userKeys.client_id;
	const request = await slangroom.execute(call_token_and_credential, {
		data,
		keys
	});
	await debugDismiss();
	let returns: CredentialResult;
	//@ts-ignore
	if (typeof request?.result.result.credentials[0].credential === 'string') {
		returns = {
			type: 'sdjwt',
			// @ts-ignore
			credentials: request?.result.result.credentials
		} as CredentialResult;
	} else {
		returns = {
			type: 'ldp_vc',
			// @ts-ignore
			credentials: request?.result.result.credentials || []
		} as CredentialResult;
	}
	return returns;
};

export const holderQrToWellKnown = async (qr: Service) => {
	await log(`start holderQrToWellKnown, qr content:, ${JSON.stringify(qr, null, 2)}`);
	await log(`start holderQrToWellKnown, keys:, ${holder_qr_to_well_known_keys}`);

	const r = await slangroom
		.execute(holder_qr_to_well_known, {
			data: { '!external-qr-code-content': qr },
			keys: JSON.parse(holder_qr_to_well_known_keys)
		})
	await log(`end holderQrToWellKnown: ${JSON.stringify(r, null, 2)}`);
	await log(`after holderQrToWellKnown, result: ${JSON.stringify(r?.result, null, 2)}`);
	return r?.result as QrToWellKnown;
};

export const callPar = async (data: { credential_parameters: CredentialParameters }) => {
	const redirect_uri = isWeb
		? window.location.protocol + '//' + window.location.host + '/finalize-authentication'
		: 'didroom-wallet://finalize-authentication';
	const keys = JSON.parse(call_par_keys);
	const userKeys = await getKeys();
	keys.keyring = userKeys.keyring;
	keys.client_id = userKeys.client_id;
	keys.redirect_uri = redirect_uri;
	const r = await slangroom.execute(call_par, { data, keys });
	const result = r.result as CallParResult;
	const authorizeUrl = `${result.authorization_endpoint}?client_id=${result.client_id}&request_uri=${result.request_uri}`;
	return { parResult: r.result as CallParResult, authorizeUrl };
};

export const decodeSdJwt = async (sdJwt: string) => {
	const decoded = await slangroom
		.execute(utils_print_decoded_sdjwt, {
			data: {
				credential: sdJwt
			}
		})
		.catch((err) => {
			log(`Slangroom exec utils_print_decoded_sdjwt: ${err}`);
			throw new Error(`Failed to decode SD-JWT: ${err}`);
		});
	return decoded.result as DecodedSDJWT;
};

export const decodeLdpVc = async (ldpVc: LdpVc) =>
	Array.from(Object.entries(ldpVc.credentialSubject));

export const decodeFormat = async (credential: Credential) => {
	if (credential.type === 'sdjwt') {
		return decodeSdJwt(credential.sdJwt);
	} else if (credential.type === 'ldp_vc') {
		return decodeLdpVc(credential.ldpVc);
	} else {
		throw new Error('Unsupported credential type');
	}
};

export type DecodedSDJWT = {
	credential: {
		disclosures: Array<Array<string>>;
		jwt: {
			header: {
				alg: string;
				typ: string;
			};
			payload: {
				_sd: Array<string>;
				_sd_alg: string;
				exp: number;
				iat: number;
				iss: string;
				nbf: number;
				sub: string;
				type: string;
			};
			signature: string;
		};
	};
};

export type JWKSKey = {
	alg: string;
	crv: string;
	kid: string;
	kty: string;
};

export type CredentialDefinition = {
	credentialSubject: {
		[key: string]: {
			display: { locale: string; name: string }[];
			mandatory: boolean;
			value_type: string;
		};
	};
	type: string[];
};

export type AuthorizationServerInfo = {
	authorization_servers: string[];
	credential_endpoint: string;
	credential_issuer: string;
	display: { locale: string; name: string }[];
	jwks: { keys: JWKSKey[] };
};

export type CredentialParameters = {
	authorization_endpoint: string;
	authorization_server_endpoint_par: string;
	code_challenge_method: string;
	credential_endpoint: string;
	credential_issuer: string;
	format: string;
	grant_type: string;
	response_type: string;
	token_endpoint: string;
	vct: string;
};

export type CredentialRequested = {
	credential_definition: CredentialDefinition;
	credential_signing_alg_values_supported: string[];
	cryptographic_binding_methods_supported: string[];
	display: {
		background_color: string;
		description: string;
		locale: string;
		logo: Logo;
		name: string;
		text_color: string;
	}[];
	format: string;
	proof_types_supported: {
		jwt: { proof_signing_alg_values_supported: string[] };
	};
};

export type QrToWellKnown = {
	credential_issuer_information: AuthorizationServerInfo;
	credential_parameters: CredentialParameters;
	credential_requested: CredentialRequested;
};

export type CredentialResult =
	| {
			type: 'sdjwt';
			credentials: { credential: string }[];
	  }
	| {
			type: 'ldp_vc';
			credentials: { credential: LdpVc }[];
	  };

export type CallParResult = {
	authorization_endpoint: string;
	client_id: string;
	code_verifier: string;
	request_uri: string;
	expires_in: number;
};
