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
import holder_request_authorizationCode from '$lib/mobile_zencode/wallet/holder_request_authorizationCode.zen?raw';
import holder_request_authorizationCode_keys from '$lib/mobile_zencode/wallet/holder_request_authorizationCode.keys.json?raw';
import utils_print_decoded_sdjwt from '$lib/mobile_zencode/wallet/utils_print_decoded_sdjwt.zen?raw';
import { log } from '$lib/log';

const slangroom = new Slangroom([http, helpers, zencode]);

export const getKeys = async () => {
	//@ts-expect-error we shall have a type for the Did object or save just the id
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
	holderIdentity: Keys,
	qrToWellKnown: QrToWellKnown,
	holder_claims: { [key: string]: string | number }
): Promise<CredentialResult> => {
	const data = {
		...qrToWellKnown,
		holder_claims
	};
	const keys = { ...JSON.parse(holder_request_authorizationCode_keys), ...holderIdentity };
	await log(`ask credential: (start chain)', 'data:', data, 'keys: ${keys}`);
	const request = await slangroom.execute(holder_request_authorizationCode, {
		data,
		keys
	});
	return request.result.result as CredentialResult;
};

export const holderQrToWellKnown = async (qr: Service) => {
	await log(`start holderQrToWellKnown, qr content:, ${JSON.stringify(qr, null, 2)}`);
	const r = (
		await slangroom.execute(holder_qr_to_well_known, {
			data: { '!external-qr-code-content': qr },
			keys: JSON.parse(holder_qr_to_well_known_keys)
		}).catch(err => log(`Slangroom exec holder_qr_to_well_known: ${err}`))
	)
	await log(`end holderQrToWellKnown: ${JSON.stringify(r, null, 2)}`);
	await log(`after holderQrToWellKnown, result: ${JSON.stringify(r!.result, null, 2)}`);
	return r!.result;
};

export const decodeSdJwt = async (sdJwt: string) => {
	const decoded = await slangroom.execute(utils_print_decoded_sdjwt, {
		data: {
			credential: sdJwt
		}
	});
	return decoded.result;
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
		logo: { alt_text: string; url: string };
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

export type CredentialResult = {
	c_nonce: string;
	c_nonce_expires_in: number;
	credential: string;
};
