import Ajv, { type Options } from 'ajv';
import addFormats from 'ajv-formats';
import type { ObjectSchema } from './types';
import type { SuperValidated, ZodValidation } from 'sveltekit-superforms';
import type z from 'zod';

//

export function createAjv(options: Options = {}) {
	const ajv = new Ajv(options);
	addFormats(ajv);
	return ajv;
}

export function parseJSON(value: string) {
	return JSON.parse(value) as JSON;
}

export function createSchema(schema: JSON) {
	return createAjv().compile(schema);
}

export function validateJSONSchema(JSON: JSON) {
	createAjv().validateSchema(JSON);
	return JSON as unknown as ObjectSchema;
}

//

// reference: https://superforms.rocks/concepts/spa#trimming-down-the-bundle-size
export function genericSuperValidated(): SuperValidated<ZodValidation<z.AnyZodObject>> {
	return {
		valid: false, // Or true, depending on validation
		posted: false,
		data: {},
		errors: {},
		constraints: {}
	};
}
