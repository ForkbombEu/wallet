import { getPublicKeysFromKeypair } from '$lib/keypairoom';
import { setDIDPreference } from '$lib/preferences/did';
import { getKeypairPreference } from '$lib/preferences/keypair';
import { Slangroom } from '@slangroom/core';
import { pocketbase } from '@slangroom/pocketbase';
import { writable } from 'svelte/store';
import scriptGenerateUser from './scriptGenerateUser.zen?raw';
import scriptGenerateDid from './scriptGenerateDid.zen?raw';
import { backendUri } from '$lib/backendUri';
import { getUser } from '$lib/preferences/user';

//

const slangroom = new Slangroom(pocketbase);

export const userEmailStore = writable<{
	email: string | undefined;
	registration: boolean;
	password: string | undefined;
	passwordConfirm: string | undefined;
}>();

export const generateSignroomUser = async (
	email: string,
	password: string,
	passwordConfirm: string
) => {
	const keypair = await getKeypairPreference();
	const public_keys = getPublicKeysFromKeypair(keypair!);
	const data = {
		pb_address: backendUri,
		create_parameters: {
			collection: 'users',
			record: {
				email,
				name: email,
				password,
				passwordConfirm,
				acceptTerms: true,
				...public_keys
			}
		},
		record_parameters: {
			expand: null,
			requestKey: null,
			fields: null
		}
	};
	const res = await slangroom.execute(scriptGenerateUser, {
		data
	});

	return res.result.output;
};

export const saveUserPublicKeys = async () => {
	const keypair = await getKeypairPreference();
	const public_keys = getPublicKeysFromKeypair(keypair!);
	const data = {
		pb_address: backendUri,
		create_parameters: {
			collection: 'users_public_keys',
			record: {
				...public_keys,
				owner: 'user.id'
			}
		},
		record_parameters: {
			expand: null,
			requestKey: null,
			fields: null
		}
	};
	const res = await slangroom.execute(scriptGenerateUser, {
		data
	});

	return res.result.output;
};

export const generateDid = async (email: string, password: string) => {
	const data = {
		pb_address: backendUri,
		my_credentials: {
			email,
			password
		},
		url: '/api/did',
		send_parameters: {}
	};

	type User = {
		avatar: string;
		bitcoin_public_key: string;
		collectionId: string;
		collectionName: string;
		created: string;
		ecdh_public_key: string;
		eddsa_public_key: string;
		email: string;
		emailVisibility: boolean;
		es256_public_key: string;
		ethereum_address: string;
		id: string;
		name: string;
		reflow_public_key: string;
		updated: string;
		username: string;
		verified: boolean;
	};

	type DIDResponse = {
		result: {
			output: {
				created: boolean;
				did: object;
			};
			login_output: {
				record: User;
			};
		};
	};

	const res = (await slangroom.execute(scriptGenerateDid, {
		data
	})) as unknown as DIDResponse;

	await setDIDPreference(res.result.output.did);

	return res.result.output;
};

export const checkKeypairs = async () => {
	const user = await getUser();
	const keypairoom = await getKeypairPreference();
	if (!keypairoom) throw new Error('KEYPAIR_NOT_GENERATED');
	const keys = getPublicKeysFromKeypair(keypairoom);

	if (!user) throw new Error('MISSING_USER');
	if (
		//@ts-expect-error maybe hardcode keys to iterate for
		Object.keys(keys).some((k) => user[k] != keys[k])
	)
		throw new Error('WRONG_KEYRING');
};
