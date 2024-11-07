import { backendUri } from '$lib/backendUri';
import { Slangroom } from '@slangroom/core';
import { pocketbase } from '@slangroom/pocketbase';

const slangroom = new Slangroom(pocketbase);

export async function getHMAC(email: string): Promise<string> {
	const script = `
	Rule unknown ignore
	Given I connect to 'pb_address' and start capacitor pb client
	Given I send url 'url' and send send_parameters 'send_parameters' and send request and output into 'output'
	Given I have a 'string dictionary' named 'output'
	Then print data
	`;
	const data = {
		pb_address: backendUri,
		url: '/api/keypairoom-server',
		send_parameters: {
			body: JSON.stringify({ userData: { email } }),
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		}
	};
	const res = await slangroom.execute(script, { data });
	//@ts-expect-error output needs to be typed
	return res.result?.output?.hmac;
}
