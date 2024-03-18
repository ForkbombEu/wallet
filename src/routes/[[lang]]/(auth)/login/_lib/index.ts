import { getPublicKeysFromKeypair } from '$lib/keypairoom';
import { setDIDPreference } from '$lib/preferences/did';
import { getKeypairPreference } from '$lib/preferences/keypair';
import { getUser, setUser } from '$lib/preferences/signroomUser';
import { Slangroom } from '@slangroom/core';
import { pocketbase } from '@slangroom/pocketbase';
import { writable } from 'svelte/store';
import scriptGenerateUser from './scriptGenerateUser.zen?raw';
import scriptGenerateDid from './scriptGenerateDid.zen?raw';

//

//@ts-expect-error - Slangroom has no types
const slangroom = new Slangroom(pocketbase);

const pb_address: string = 'https://admin.signroom.io';

export const userEmailStore = writable<string | undefined>();

export const generateSignroomUser = async (email: string) => {
	const password = 'pppppppp';
    const keypair = await getKeypairPreference();
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

	//@ts-expect-error - Slangroom has no types
	await setUser(res.result.output?.id, password, email);

	return res.result.output;
};

export const generateDid = async () => {
	//@ts-expect-error - Slangroom has no types
	const { email, password } = await getUser();

	const data = {
		pb_address,
		my_credentials: {
			email,
			password
		},
		url: '/api/did',
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
