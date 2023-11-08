import { showProfile } from './endpoints';
//@ts-ignore
import { Slangroom } from '@slangroom/core';
//@ts-ignore
import { http } from '@slangroom/http';
import { apiByIdContract, authWithPasswordContract, updateProfileContract } from './contracts';
import { organizationAuthorizations, servicesByOrganization, webauthnCredentials, webauthnSessions } from './endpoints';

export type BaseSystemFields<T = never> = {
	id: string;
	created: string;
	updated: string;
	collectionId: string;
	collectionName: string;
	expand?: T;
};
export type PBRecord = Record<string, unknown>;
export type PBExpand<T extends PBRecord = PBRecord> = Record<string, T | T[]>;

export type PBResponse<R extends PBRecord = PBRecord, E extends PBExpand = PBExpand> = R & BaseSystemFields<E>;

const PB = 'http://localhost:8090/';

const slangroom = new Slangroom(http);

export type SlangroomResponse<T extends Record<string, unknown>> = Promise<{
	status: number;
	result: T;
}>;

export interface SlangroomRequest<T = undefined> {
	token: string;
	id: string;
	data?: T;
}

export const authWithPassword = async (username: string, password: string):Promise<any> => {
	console.log({ identity: username, password })
	const res = await slangroom.execute(authWithPasswordContract, {
		data: {
			pb: PB,
			auth: { identity: username, password }
		}
	});
	return res.result.auth_token;
};

// WARNING: not safe against injection
const apiById = async (
	before: string,
	after: string,
	token: string,
	rest?: FormData | Record<string, string>
): SlangroomResponse<PBResponse> => {
	try {
		const res = await slangroom.execute(apiByIdContract(before, after), {
			data: {
				pb: PB,
				headers: {
					authorization: 'Bearer ' + token
				},
				...rest
			}
		});
		// TODO: check errors
		console.log(res)

		return res.result.http_result.result;
	} catch (e: any) {
		console.log(e);
		throw new Error(e);
	}
};

// List of services of my org
// TODO: manage pagination
export const organizationServices = async (req: SlangroomRequest): Slangroom<PBResponse> => {
	const { id, token } = req;
	return apiById(
		servicesByOrganization[0], 
		servicesByOrganization[1], 
		token, 
		{id: id});
};

// List of the orgs I'm part of
// TODO: manage pagination
export const orgAuthorizations = async (req: SlangroomRequest): Slangroom<PBResponse> => {
	const { id, token } = req;
	return apiById(
		organizationAuthorizations[0], 
		organizationAuthorizations[1],
		token,
		{ id: id }
	);
};

// List of WebAuthn sessions/devices
// TODO: manage pagination
export const webauthnCreds = async (req: SlangroomRequest): Slangroom<PBResponse> => {
	const { id, token } = req;
	return apiById(webauthnCredentials[0], webauthnCredentials[1], token, {
		id: id
	});
};
export const webauthnSess = async (req: SlangroomRequest): Slangroom<PBResponse> => {
	const { id, token } = req;
	return apiById(webauthnSessions[0], webauthnSessions[1], token, {
		id: id
	});
};

// My profile info
export const myProfile = async (req: SlangroomRequest): Slangroom<PBResponse> => {
	const { id, token } = req;
	return apiById(showProfile[0], showProfile[1], token, { id: id });
};
export const updateProfile = async (req: SlangroomRequest<FormData | Record<string, string>>) => {
	const { id, token, data } = req;
	const res = await slangroom.execute(updateProfileContract, {
		data: {
			pb: PB,
			headers: {
				authorization: 'Bearer ' + token
			},
			id: id,
			user_data: data
		}
	});
	// TODO: check errors
	return res.result;
};
