import { backendUri } from '$lib/backendUri';
import { getUser } from '$lib/preferences/user';
import { Slangroom } from '@slangroom/core';
import { pocketbase } from '@slangroom/pocketbase';
import getPbList from '$lib/slangroom/getPbList.slang?raw';

// export const _userSettingsKey = 'load:user-settings';

const expandOrgJoinReq = 'orgJoinRequests_via_organization';
const expandOrgAuth = 'orgAuthorizations_via_organization';

const fetchRecords = async () => {
	const slangroom = new Slangroom(pocketbase);
	const data = {
		pb_address: backendUri,
		list_parameters: {
			type: 'all',
			collection: 'organizations',
			expand: [expandOrgAuth, expandOrgJoinReq].join(',')
			// filter: `(id != orgAuthorizations_via_organization.organization.id) && (orgAuthorizations_via_organization.user.id = "${user?.id}")`
		}
	};
	const records = await slangroom.execute(getPbList, { data });
	console.log(records);
	//@ts-ignore
	return records.result.output.records;
};

export const load = async () => {
	// depends(_userSettingsKey);
	const organizations = await fetchRecords();
	const user = await getUser();
	return { user, organizations };
};
