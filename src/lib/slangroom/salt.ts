import { backendUri } from '$lib/backendUri';
import { log } from '$lib/log';
import { Slangroom } from '@slangroom/core';
import getSalt from '$lib/slangroom/getSalt.slang?raw';
import { pocketbase } from '@slangroom/pocketbase';



const slangroom = new Slangroom(pocketbase);

export const getServerSalt = async (): Promise<string> => {
	try {
		const data = {
			pb_address: backendUri,
			salt: {
				collection: 'features',
				filter: 'name = "keypairoom"',
				type: 'first'
			}
		};
		const res = await slangroom.execute(getSalt, { data });
		//@ts-expect-error output needs to be typed
		return res.result?.server_salt?.records.envVariables["SALT"];
	} catch (e: unknown) {
		log(String(e));
		throw new Error(JSON.stringify(e));
	}
};
