import { getPublicKeysFromKeypair } from '$lib/keypairoom';
import { setDIDPreference } from '$lib/preferences/did';
import { getKeypairPreference } from '$lib/preferences/keypair';
import { getUser, setUser } from '$lib/preferences/signroomUser';
import { Slangroom } from '@slangroom/core';
import { pocketbase } from '@slangroom/pocketbase';
import { writable } from 'svelte/store';

//

//@ts-expect-error - Slangroom has no types
const slangroom = new Slangroom(pocketbase);

const pb_address: string = 'https://admin.signroom.io';

export const userEmailStore = writable<string | undefined>();

//

const scriptGenerateUser = `
    Rule unknown ignore
    Given I send pb_address 'pb_address' and create pb_client
    Given I send create_parameters 'create_parameters' and send record_parameters 'record_parameters' and create record and output into 'output'
    Given I have a 'string dictionary' named 'output'
    Then print data
    `;

// const scriptUpdate = `
//     Rule unknown ignore
//     Given I send pb_address 'pb_address' and create pb_client
//     Given I send my_credentials 'my_credentials' and login
//     Given I send update_parameters 'update_parameters' and send record_parameters 'record_parameters' and update record and output into 'output'
//     Given I have a 'string dictionary' named 'output'
//     Then print data
//     `;

const scriptGenerateDid = `
    Rule unknown ignore
	Given I send pb_address 'pb_address' and create pb_client
	Given I send my_credentials 'my_credentials' and login and output into 'login_output'
    Given I have a 'string dictionary' named 'login_output'
    Given I have a 'string' named 'url'
    When I pickup from path 'login_output.token' 
    and I rename 'token' to 'Authorization'

    When I create the 'string dictionary' named 'headers' 
    and I move 'Authorization' in 'headers'

    When I create the 'string dictionary' named 'send_parameters' 
    and I move 'headers' in 'send_parameters'
    
    Then I print 'url'
    and I print 'send_parameters'
	Then I send url 'url' and send send_parameters 'send_parameters' and send request and output into 'output'
`;

//

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
				password,
				passwordConfirm: password,
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

//

// export const uploadPublicKeys = async () => {
// 	const { id, email, password } = (await getUser())!;
// 	const keypair = await getKeypairPreference();
// 	const public_keys = getPublicKeysFromKeypair(keypair!);

// 	const dataUpdate = {
// 		pb_address,
// 		update_parameters: {
// 			id,
// 			collection: 'users',
// 			record: public_keys
// 		},
// 		record_parameters: {
// 			expand: null,
// 			requestKey: null,
// 			fields: null
// 		},
// 		my_credentials: {
// 			email,
// 			password
// 		}
// 	};

// 	const res = await slangroom.execute(scriptUpdate, {
// 		data: dataUpdate
// 	});

// 	console.log(res);
// };

//

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
