// import { PUBLIC_BACKEND_URL } from '$env/static/public';

import { fetchTemplates, showProfile } from './endpoints';
//@ts-ignore
import { Slangroom } from '@slangroom/core';
//@ts-ignore
import { http } from '@slangroom/http';
import { apiByIdContract, apiContract, authWithPasswordContract, updateProfileContract } from './contracts';
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

//const PB = PUBLIC_BACKEND_URL;
export const PB = "https://admin.signroom.io/"

export const slangroom = new Slangroom(http);

export type SlangroomResponse<T extends Record<string, unknown>> = Promise<{
	status: number;
	result: T;
}>;

export interface SlangroomRequest<T = undefined> {
	token: string;
	id: string;
	data?: T;
}

export interface SlangroomApiData {
	pb: string;
	headers?: { authorization: `Bearer ${string}` };
}

export const authWithPassword = async (username: string, password: string): Promise<any> => {
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
		return res.result.http_result.result;
	} catch (e: any) {
		console.log(e);
		throw new Error(e);
	}
};

// WARNING: not safe against injection
const api = async (
	url: string,
	token?: string,
	rest?: FormData | Record<string, string>
): Promise<PBResponse> => {
	const data: SlangroomApiData = {
		pb: PB,
		...rest
	};
	if (token) data.headers = { authorization: `Bearer ${token}` };
	try {
		const res = await slangroom.execute(apiContract(url), {
			data: {
				pb: PB,
				headers: {
					authorization: 'Bearer ' + token
				},
				...rest
			}
		});
		// TODO: check errors
		return res.result.http_result.result;
	} catch (e: any) {
		console.log(e);
		throw new Error(e);
	}
};

// List of services of my org
// TODO: manage pagination
export const organizationServices = async (req: SlangroomRequest): SlangroomResponse<PBResponse> => {
	const { id, token } = req;
	return apiById(servicesByOrganization[0], servicesByOrganization[1], token, { id: id });
};

// List of the orgs I'm part of
// TODO: manage pagination
export const orgAuthorizations = async (req: SlangroomRequest): SlangroomResponse<PBResponse> => {
	const { id, token } = req;
	return apiById(organizationAuthorizations[0], organizationAuthorizations[1], token, { id: id });
};

// List of WebAuthn sessions/devices
// TODO: manage pagination
export const webauthnCreds = async (req: SlangroomRequest): SlangroomResponse<PBResponse> => {
	const { id, token } = req;
	return apiById(webauthnCredentials[0], webauthnCredentials[1], token, {
		id: id
	});
};
export const webauthnSess = async (req: SlangroomRequest): SlangroomResponse<PBResponse> => {
	const { id, token } = req;
	return apiById(webauthnSessions[0], webauthnSessions[1], token, {
		id: id
	});
};

// My profile info
export const myProfile = async (req: SlangroomRequest): SlangroomResponse<PBResponse> => {
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

export const getTemplates = (req?: Partial<SlangroomRequest>): SlangroomResponse<PBResponse> => {
	return api(fetchTemplates, req?.token);
};
