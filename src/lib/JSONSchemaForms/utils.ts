import Ajv from 'ajv';
import type { JSONSchema } from './types';

export function parseJSON(value: string) {
	return JSON.parse(value) as JSON;
}

export function createSchema(schema: JSON) {
	const ajv = new Ajv();
	return ajv.compile(schema);
}

export function validateJSONSchema(JSON: JSON) {
	createSchema(JSON);
	return JSON as unknown as JSONSchema;
}
