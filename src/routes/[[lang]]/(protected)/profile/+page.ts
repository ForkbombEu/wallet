import { getUser } from '$lib/preferences/user';
import { getKeypairPreference } from '$lib/preferences/keypair';
import { getDIDPreference } from '$lib/preferences/did';
import { getPublicKeysFromKeypair } from '$lib/keypairoom';
import { backendUri } from '$lib/backendUri';
import { Slangroom } from '@slangroom/core';
import { pocketbase } from '@slangroom/pocketbase';
import getPbList from '$lib/slangroom/getPbList.zen?raw';

const getKeys = async () => {
	const keypair = await getKeypairPreference();
	return getPublicKeysFromKeypair(keypair!);
};

const organizations = async (userId:string)=> {
	const slangroom = new Slangroom(pocketbase);
	const data = {
		pb_address: backendUri,
		list_parameters: {
			collection: 'orgAuthorizations',
			expand: 'organization',
			filter: `user.id = '${userId}'`,
			type: 'all',
		}
	};
	const orgs = await slangroom.execute(getPbList, {data});
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
