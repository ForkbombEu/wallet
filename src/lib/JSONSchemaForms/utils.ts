import Ajv, { type Options, type ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';
import type { JSONSchema, ObjectSchema } from './types';
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

//

type AjvErrors = NonNullable<ValidateFunction['errors']>;
type AjvError = AjvErrors[number];

export interface SuperformErrors {
	[x: string]: string[] | SuperformErrors;
}

export function ajvErrorsToSuperformsErrors(errors: AjvError[]): SuperformErrors {
	let errorsObject: SuperformErrors = {};
	console.log('');
	console.log('-'.repeat(20));

	errors.forEach((error) => {
		console.log(error);
		const errorPathArray = error.instancePath.split('/').filter((p) => p);

		if (error.keyword === 'required') {
			errorPathArray.push(error.params.missingProperty);
		}

		// Build nested structure based on path
		let current: SuperformErrors = errorsObject;
		for (let i = 0; i < errorPathArray.length; i++) {
			if (i === errorPathArray.length - 1) {
				current[errorPathArray[i]] = { _errors: [error.message] }; // Set the error message at the leaf
			} else {
				current[errorPathArray[i]] = current[errorPathArray[i]] || {}; // Create nested object if necessary
				current = current[errorPathArray[i]];
			}
		}
	});

	// console.log(errorsObject);

	return errorsObject;
}

export function getTaintedFieldsAjvErrors(ajvErrors: AjvError[], taintedFieldsPaths: string[]): AjvError[] {
	return ajvErrors.filter((error) => taintedFieldsPaths.some((path) => error.instancePath.includes(path)));
}
