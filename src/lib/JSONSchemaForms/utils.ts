import Ajv, { type ValidateFunction } from 'ajv';
import type { JSONSchema } from './types';
import type z from 'zod';
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

export function JSONSchemaToSuperformsValidators(schema: JSONSchema): SuperformsValidators {
	const ajv = new Ajv({ allErrors: true });
	const validate = ajv.compile(schema);

	let validationObject: Record<string, SuperformsValidator> = {};

	for (const [propertyName, property] of Object.entries(schema.properties)) {
		// Validate globally, then extract the keys
		validationObject[propertyName] = (v) => {
			if (validate({ [propertyName]: v })) return null;
			else {
				// console.log(v);
				// return null;
				// console.log(propertyName, v, validate.errors);
				return 'error';
			}
		};
	}

	return validationObject;
}

type AjvErrors = ValidateFunction['errors'];

export function extractFieldErrorsFromAjv(errors: AjvErrors, field: string) {
	if (!errors) return;

	// Finding required
	errors.find((e) => e.schemaPath === '#/required' && e.params.missingProperty === field)?.message;

	// Finding path-specific
}
