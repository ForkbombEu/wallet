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

const slangroom = new Slangroom([http, helpers, zencode]);

export const getKeys = async () => {
	//@ts-expect-error we shall have a type for the Did object or save just the id
	const client_id = (await getDIDPreference())?.result?.didDocument.id as string;
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
):Promise<CredentialResult> => {
	const data = {
		...qrToWellKnown,
		holder_claims
	};
	const keys = { ...JSON.parse(holder_request_authorizationCode_keys), ...holderIdentity };
	console.log('ask credential: (start chain)', 'data:', data, 'keys:', keys);
	const request = await slangroom.execute(holder_request_authorizationCode, {
		data,
		keys
	});

	return request.result.result as CredentialResult;
};

export const holderQrToWellKnown = async (qr: Service) => {
	console.log('start holderQrToWellKnown, qr content:', qr);
	const result = (
		await slangroom.execute(holder_qr_to_well_known, {
			data: { '!external-qr-code-content': qr },
			keys: JSON.parse(holder_qr_to_well_known_keys)
		})
	).result as QrToWellKnown;
	console.log('after holderQrToWellKnown, result:', result);
	return result;
};

export const decodeSdJwt = async (sdJwt: string) => {
	const decoded = await slangroom.execute(utils_print_decoded_sdjwt, {
		data: {
			credential: sdJwt
		}
	});
	return decoded.result;
}

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

export type CredentialConfiguration = {
	credential_definition: CredentialDefinition;
	credential_signing_alg_values_supported: string[];
	cryptographic_binding_methods_supported: string[];
	display: {
		background_color: string;
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

export type AuthorizationServer = {
	authorization_details_types_supported: string[];
	authorization_endpoint: string;
	client_registration_types_supported: string[];
	code_challenge_methods_supported: string[];
	dpop_signing_alg_values_supported: string[];
	grant_types_supported: string[];
	issuer: string;
	jwks: { keys: JWKSKey[] };
	pushed_authorization_request_endpoint: string;
	request_object_signing_alg_values_supported: string[];
	request_parameter_supported: boolean;
	request_uri_parameter_supported: boolean;
	response_types_supported: string[];
	scopes_supported: string[];
	subject_types_supported: string[];
	token_endpoint: string;
	token_endpoint_auth_methods_supported: string[];
	token_endpoint_auth_signing_alg_values_supported: string[];
};

export type CredentialRequested = {
	credential_definition: CredentialDefinition;
	credential_signing_alg_values_supported: string[];
	cryptographic_binding_methods_supported: string[];
	display: {
		background_color: string;
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

export type ExternalQRCodeContent = {
	credential_configuration_ids: string[];
	credential_issuer: string;
};

export type OpenIDCredentialIssuer = {
	authorization_servers: string[];
	credential_configurations_supported: CredentialConfiguration[];
	credential_endpoint: string;
	credential_issuer: string;
	display: { locale: string; name: string }[];
	jwks: { keys: JWKSKey[] };
};

export type QrToWellKnown = {
	credential_parameters: {
		'oauth-authorization-server': AuthorizationServer;
		'openid-credential-issuer': OpenIDCredentialIssuer;
	};
	credential_requested: CredentialRequested;
};

export type CredentialResult = {
	c_nonce: string;
	c_nonce_expires_in: number;
	credential: string;
};
