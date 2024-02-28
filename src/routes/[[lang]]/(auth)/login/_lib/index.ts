import { getUser, setUser } from '$lib/preferences/signroomUser';
import { Slangroom } from '@slangroom/core';
import { pocketbase } from '@slangroom/pocketbase';
import { writable } from 'svelte/store';
export const userEmailStore = writable<string | undefined>();

const scriptGenerateUser = `
    Rule unknown ignore
    Given I send pb_address 'pb_address' and create pb_client
    Given I send create_parameters 'create_parameters' and send record_parameters 'record_parameters' and create record and output into 'output'
    Given I have a 'string dictionary' named 'output'
    Then print data
    `;

const scriptGenerateDid = `
    Rule unknown ignore
	Given I send pb_address 'pb_address' and create pb_client
	Given I send my_credentials 'my_credentials' and login
	Given I send url 'url' and send send_parameters 'send_parameters' and send request and output into 'output'
	Given I have a 'string dictionary' named 'output'
	Then print data
`;

//@ts-ignore
const slangroom = new Slangroom(pocketbase);

const pb_address: string = 'https://admin.signroom.io';

export const generateSignroomUser = async (email: string) => {
	const password = 'pppppppp';
	const data = {
		pb_address,
		create_parameters: {
			collection: 'users',
			record: {
				email,
				password,
				passwordConfirm: password
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

	//@ts-ignore
	setUser(res.result.output?.id, password, email);

	return res.result.output;
};

export const generateDid = async () => {
	//@ts-ignore
	const { id, email, password } = await getUser();
	const data = {
		pb_address,
		my_credentials: {
			email,
			password
		},
		url: '/api/did',
		send_parameters: {}
	};
	const res = await slangroom.execute(scriptGenerateDid, {
		data
	});
	console.log(res);
	return res.result.output;
};
