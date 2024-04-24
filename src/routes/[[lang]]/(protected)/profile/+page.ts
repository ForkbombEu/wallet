import { getUser } from '$lib/preferences/user';
import { getKeypairPreference } from '$lib/preferences/keypair';
import { getDIDPreference } from '$lib/preferences/did';
import { getPublicKeysFromKeypair } from '$lib/keypairoom';
import { backendUri } from '$lib/backendUri';
import { Slangroom } from '@slangroom/core';
import { pocketbase } from '@slangroom/pocketbase';

const getKeys = async () => {
	const keypair = await getKeypairPreference();
	return getPublicKeysFromKeypair(keypair!);
};
const orgContract = `Rule unknown ignore
Given I connect to 'pb_address' and start capacitor pb client
Given I send list_parameters 'list_parameters' and get some records and output into 'output'
Given I have a 'string dictionary' named 'output'
Then print data
`;

// const organizations = async (email: string, id: string) => {
// 	const token = await authWithPassword(email, password);
// 	const o = await orgAuthorizations({ token, id });
// 	//@ts-expect-error wrong typing in $lib/slangroom
// 	return o?.items.map((a) => a.expand.organization);
// };
const organizations = async (user:string)=> {
	const slangroom = new Slangroom(pocketbase);
	const data = {
		pb_address: backendUri,
		list_parameters: {
			collection: 'orgAuthorizations',
			expand: 'organization',
			filter: `user.id = '${user}'`,
			type: 'all'
		}
	};
	const orgs = await slangroom.execute(orgContract, {data});
	//@ts-expect-error output needs to be typed	
	return orgs.result?.output?.records.map((a) => a.expand.organization)
}
export const load = async () => {
	const user = await getUser();
	const orgs = await organizations(user!.id);
	const keys = await getKeys();
	const did = await getDIDPreference();
	return { orgs, user, keys, did, logged: Boolean(user && keys && did) };
};
