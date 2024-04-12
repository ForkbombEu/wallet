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

export const password = 'CiccioLiam12345!';

export const userEmailStore = writable<{ email: string | undefined; registration: boolean }>();

export const generateSignroomUser = async (email: string) => {
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
				passwordConfirm: password,
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

export const generateDid = async (email: string) => {
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
		Object.keys(keys).some((k) => {
			console.log(k, user[k], keys[k]);
			//@ts-expect-error maybe hardcode keys to iterate for
			return user[k] != keys[k];
		})
	)
		throw new Error('WRONG_KEYPAIR');
};
