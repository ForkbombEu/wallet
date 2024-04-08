import { Slangroom } from '@slangroom/core';
import { pocketbase } from '@slangroom/pocketbase';
import { getUser } from '$lib/preferences/user';
import { getKeypairPreference } from '$lib/preferences/keypair';
import { getDIDPreference } from '$lib/preferences/did';
import type { ListParameters, ServerUrl } from '@slangroom/pocketbase';
import { getPublicKeysFromKeypair } from '$lib/keypairoom';



const slangroom = new Slangroom(pocketbase);

const getKeys = async () => {
	const keypair = await getKeypairPreference();
	return getPublicKeysFromKeypair(keypair!);
};

const organizations = async (k = '1') => {
	const user = await getUser();
    if (!user) return;
	const data: { pb_address: ServerUrl; list_parameters: ListParameters } = {
		pb_address: 'https://admin.signroom.io/',
		list_parameters: {
			type: 'all',
			collection: 'orgJoinRequests',
			expand: 'organization',
			requestKey: k,
			fields: null,
			sort: null,
			filter: `user.id = "${user!.id}" && status != "pending"`
		}
	};

	const script = `
    Rule unknown ignore
    Given I send pb_address 'pb_address' and create pb_client
    Given I send list_parameters 'list_parameters' and ask records and output into 'output'
    Given I have a 'string dictionary' named 'output'
    Then print data
    `;

	return (await slangroom.execute(script, { data })).result.output?.records;
};
export const load = async () => {
    const authorizations = await organizations();
    const orgs = authorizations?.map(a => a.expand.organization)
    const user = await getUser();
    const keys = await getKeys();
    const did = await getDIDPreference();
    return { orgs, user, keys, did, logged: Boolean(user&&keys&&did) };
};
