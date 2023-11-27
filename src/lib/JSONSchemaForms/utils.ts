import Ajv, { type Options, type ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';
import type { JSONSchema } from './types';
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

//

type AjvErrors = NonNullable<ValidateFunction['errors']>;
interface SuperformsErrors {
	[x: string]: string[] | SuperformsErrors;
}

export function transformAjvErrors(errors: AjvErrors) {
	let errorsObject: SuperformsErrors = {};
	// console.log('-'.repeat(20));

	errors.forEach((error) => {
		// console.log(error);
		// Create a path array (e.g., 'address.city' becomes ['address', 'city'])
		const path = error.instancePath.split('/').filter((p) => p);

		if (error.keyword === 'required') {
			path.push(error.params.missingProperty);
		}

		// Build nested structure based on path
		let current: SuperformsErrors = errorsObject;
		for (let i = 0; i < path.length; i++) {
			if (i === path.length - 1) {
				current[path[i]] = { _errors: [error.message] }; // Set the error message at the leaf
			} else {
				current[path[i]] = current[path[i]] || {}; // Create nested object if necessary
				current = current[path[i]];
			}
		}
	});

	// console.log(errorsObject);

	return errorsObject;
}
