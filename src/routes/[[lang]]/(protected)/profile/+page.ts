import { getUser } from '$lib/preferences/user';
import { getKeypairPreference } from '$lib/preferences/keypair';
import { getDIDPreference } from '$lib/preferences/did';
import { getPublicKeysFromKeypair } from '$lib/keypairoom';
import { authWithPassword, orgAuthorizations } from '$lib/slangroom';
import { password } from '../../(auth)/login/_lib';

const getKeys = async () => {
	const keypair = await getKeypairPreference();
	return getPublicKeysFromKeypair(keypair!);
};

const organizations = async (email: string, id: string) => {
	const token = await authWithPassword(email, password);
	const o = await orgAuthorizations({ token, id });
	//@ts-expect-error wrong typing in $lib/slangroom
	return o?.items.map((a) => a.expand.organization);
};
export const load = async () => {
	const user = await getUser();
	const orgs = await organizations(user!.email, user!.id);
	const keys = await getKeys();
	const did = await getDIDPreference();
	return { orgs, user, keys, did, logged: Boolean(user && keys && did) };
};
