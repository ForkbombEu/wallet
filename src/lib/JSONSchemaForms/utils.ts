import Ajv from 'ajv';
import type { JSONSchema } from './types';
import z from 'zod';
import type { SuperValidated, Validator, ZodValidation } from 'sveltekit-superforms';

//

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

type SuperformsValidator = Validator<unknown>;
type SuperformsValidators = Record<string, Validator<unknown>>;

export function JSONSchemaToSuperformsValidator(schema: JSONSchema): SuperformsValidators {
	let validationObject: Record<string, SuperformsValidator> = {};

	for (const [propertyName, property] of Object.entries(schema.properties)) {
		// let schema: z.ZodType
		// if (property.type == 'string') schema = z.string();
		// else if (property.type == 'integer') schema = z.number().int()
		// else if (property.type == 'number') schema = z.number()
		// else schema = z.any()
		validationObject[propertyName] = () => null;
	}

	return validationObject;
}
