import { getPublicKeysFromKeypair } from '$lib/keypairoom';
import { setDIDPreference } from '$lib/preferences/did';
import { getKeypairPreference } from '$lib/preferences/keypair';
import { Slangroom } from '@slangroom/core';
import { pocketbase } from '@slangroom/pocketbase';
import { writable } from 'svelte/store';
import { backendUri } from '$lib/backendUri';
import { getUser } from '$lib/preferences/user';

//Slangroom scripts
import loginScript from '$lib/slangroom/login.slang?raw';
import createUserScript from '$lib/slangroom/createUser.slang?raw';
import savePublicKeysScript from '$lib/slangroom/savePublicKeys.slang?raw';
import scriptGenerateDid from '$lib/slangroom/scriptGenerateDid.slang?raw';

//

const slangroom = new Slangroom(pocketbase);

export const userEmailStore = writable<{
	email: string | undefined;
	registration: boolean;
}>();

export const createUser = async (email: string, password: string, passwordConfirmation: string) => {
	const data = {
		pb_address: backendUri,
		new_user: {
			collection: 'users',
			record: {
				email,
				password,
				passwordConfirm: passwordConfirmation,
				name: email,
				acceptTerms: true
			}
		},
		record_parameters: {
			expand: null,
			requestKey: 'generateUser',
			fields: null
		}
	};
	const res = await slangroom.execute(createUserScript, {
		data
	});

	return res.result.output;
};

export const login = async (email: string, password: string) => {
	const data = {
		pb_address: backendUri,
		my_credentials: {
			email,
			password
		}
	};
	const res = await slangroom.execute(loginScript, { data });
	if (!res) throw new Error('Failed to login');
};


export const saveUserPublicKeys = async () => {
	const keypair = await getKeypairPreference();
	const user = await getUser();
	const public_keys = getPublicKeysFromKeypair(keypair!);
	const data = {
		pb_address: backendUri,
		public_keys: {
			collection: 'users_public_keys',
			record: {
				...public_keys,
				owner: user!.id
			}
		},
		record_parameters: {
			expand: null,
			requestKey: null,
			fields: null
		}
	};
	const res = await slangroom.execute(savePublicKeysScript, {
		data
	});

	return res.result.output;
};

export const generateDid = async () => {
	const data = {
		pb_address: backendUri,
		url: '/api/did',
		send_parameters: {}
	};

	type DIDResponse = {
		result: {
			output: {
				created: boolean;
				did: object;
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
	if (
		//@ts-expect-error maybe hardcode keys to iterate for
		Object.keys(keys).some((k) => user[k] != keys[k])
	)
		throw new Error('WRONG_KEYRING');
};
