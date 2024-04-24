import { PUBLIC_BACKEND_URL } from '$env/static/public';
import { log } from '$lib/log';
import { Slangroom } from '@slangroom/core';
import { http } from '@slangroom/http';

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

const slangroom = new Slangroom(http);

export const getServices = async (): Promise<Response<PaginatedResult<Service>>> => {
	try {
		const res = await slangroom.execute(
			`Rule unknown ignore

Given I connect to 'path' and do get and output into 'http_result'
Given I have a 'string dictionary' named 'http_result'
Then print data
`,
			{
				data: {
					path: `${PUBLIC_BACKEND_URL}/api/collections/services/records?expand=credential_issuer&sort=-updated&filter=(public=true)`
				}
			}
		);
		return res.result.http_result;
	} catch (e: any) {
		log(e);
		throw new Error(JSON.stringify(e));
	}
};

export const getService = async (id: string): Promise<Response<Service>> => {
	try {
		const res = await slangroom.execute(
			`Rule unknown ignore

Given I connect to 'path' and do get and output into 'http_result'
Given I have a 'string dictionary' named 'http_result'
Then print data`,
			{
				data: {
					path: `${PUBLIC_BACKEND_URL}/api/collections/services/records/${id}?expand=templates`
				}
			}
		);
		return res.result.http_result.result;
	} catch (e: any) {
		log(e);
		throw new Error(e);
	}
};
