import { getPublicKeysFromKeypair } from '$lib/keypairoom';
import { setDIDPreference } from '$lib/preferences/did';
import { getKeypairPreference } from '$lib/preferences/keypair';
import { Slangroom } from '@slangroom/core';
import { pocketbase } from '@slangroom/pocketbase';
import { writable } from 'svelte/store';
import scriptGenerateUser from './scriptGenerateUser.zen?raw';
import scriptGenerateDid from './scriptGenerateDid.zen?raw';
import { setUser } from '$lib/preferences/user';

//

const slangroom = new Slangroom(pocketbase);

const pb_address: string = 'https://admin.signroom.io';

export const userEmailStore = writable<{email:string | undefined, registration:boolean}>();

export const generateSignroomUser = async (email: string) => {
	const keypair = await getKeypairPreference();
	const password = keypair!.seed;
	const public_keys = getPublicKeysFromKeypair(keypair!);
	const data = {
		pb_address,
		create_parameters: {
			collection: 'users',
			record: {
				email,
				name: email,
				password,
				passwordConfirm: password,
				acceptTerms:true,
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

export const generateDid = async (email:string) => {
	const keypair = await getKeypairPreference();
	const password = keypair!.seed;

	const data = {
		pb_address,
		my_credentials: {
			email,
			password
		},
		url: '/api/did',
	};

	type User = {
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
			}
		};
	};

	const res = (await slangroom.execute(scriptGenerateDid, {
		data
	})) as unknown as DIDResponse;
	
	await setUser(res.result.login_output.record.id, email);
	await setDIDPreference(res.result.output.did);

	return res.result.output;
};
