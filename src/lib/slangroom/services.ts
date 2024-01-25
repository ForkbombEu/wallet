import { PB, slangroom } from '.';

export interface Response {
	page: number;
	perPage: number;
	totalItems: number;
	totalPages: number;
	items: Service[];
}

export interface Service {
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
}

export const servicesContract = `
Rule unknown ignore

Given I have a 'string' named 'pb'
When I write string 'api/collections/services/records?expand=issuer' in 'path'
When I append 'path' to 'pb'
Then print data
Then I connect to 'pb' and do get and output into 'http_result'
`;

export const getServices = async (): Promise<Response> => {
	try {
		const res = await slangroom.execute(servicesContract, {
			data: { pb: PB }
		});
		return res.result.http_result.result;
	} catch (e: any) {
		console.log(e);
		throw new Error(e);
	}
};

export const serviceContract =(id:string)=> `
Rule unknown ignore

Given I have a 'string' named 'pb'
When I write string 'api/collections/services/records/${id}?expand=templates' in 'path'
When I append 'path' to 'pb'
Then print data
Then I connect to 'pb' and do get and output into 'http_result'
`;

export const getService = async (id:string): Promise<Response> => {
	try {
		const res = await slangroom.execute(serviceContract(id), {
			data: { pb: PB }
		});
		return res.result.http_result.result;
	} catch (e: any) {
		console.log(e);
		throw new Error(e);
	}
};


