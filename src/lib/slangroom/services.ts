import { slangroom } from '.';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

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
	add_ons: boolean;
	collectionId: string;
	collectionName: string;
	created: string;
	id: string;
	issuer: string;
	name: string;
	organization: string;
	published: boolean;
	templates: string[];
	updated: string;
};

export const getServices = async (): Promise<Response<PaginatedResult<Service>>> => {
	try {
		const res = await slangroom.execute(
			`Rule unknown ignore

Given I connect to 'path' and do get and output into 'http_result'
Given I have a 'string dictionary' named 'http_result'
Then print data
`,
			{
				data: { path: `${PUBLIC_BACKEND_URL}/api/collections/services/records?expand=issuer` }
			}
		);
		return res.result.http_result;
	} catch (e: any) {
		console.log(e);
		throw new Error(JSON.stringify(e));
	}
};

export const getService = async (id: string): Promise<Response> => {
	try {
		const res = await slangroom.execute(
			`Rule unknown ignore

Given I connect to 'path' and do get and output into 'http_result'
Given I have a 'string dictionary' named 'http_result'
Then print data`,
			{
				data: { path: `${PUBLIC_BACKEND_URL}/api/collections/services/records/${id}?expand=templates` }
			}
		);
		return res.result.http_result.result;
	} catch (e: any) {
		console.log(e);
		throw new Error(e);
	}
};
