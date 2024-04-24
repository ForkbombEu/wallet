import { backendUri } from '$lib/backendUri';
import { log } from '$lib/log';
import { Slangroom } from '@slangroom/core';
import getPbList from '$lib/slangroom/getPbList.zen?raw';
import { pocketbase } from '@slangroom/pocketbase';


export type PaginatedResult<T> = {
	page: number;
	perPage: number;
	totalItems: number;
	totalPages: number;
	items: T[];
};

export type Response<T> = {
	result: T;
	status: number;
};

export type Service = {
	api_available: boolean;
    authorization_server: string;
    authorization_template: string;
    collectionId: string;
    collectionName: string;
    created: string;
    credential_issuer: string;
    credential_template: string;
    cryptography: string;
    description: string;
    display_name: string;
    expand: {
        credential_issuer: {
            collectionId: string;
            collectionName: string;
            created: string;
            endpoint: string;
            id: string;
            name: string;
            organization: string;
            updated: string;
        };
    };
    id: string;
    logo: string;
    organization: string;
    public: boolean;
    type_name: string;
    updated: string;
}

const slangroom = new Slangroom(pocketbase);

export const getServices = async (): Promise<Service[]> => {
	try {
		const data = {
			pb_address: backendUri,
			list_parameters: {
				collection: 'services',
				expand: 'credential_issuer',
				sort: '-updated',
				filter: 'public = true',
				type: 'all'
			}
		};
		const res = await slangroom.execute(getPbList, { data });
		//@ts-expect-error output needs to be typed
		return res.result?.output?.records;
	} catch (e: unknown) {
		log(String(e));
		throw new Error(JSON.stringify(e));
	}
};
