import { Slangroom } from '@slangroom/core';
import { http } from '@slangroom/http';

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

export type PBResponse<R extends PBRecord = PBRecord, E extends PBExpand = PBExpand> = R &
	BaseSystemFields<E>;


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

