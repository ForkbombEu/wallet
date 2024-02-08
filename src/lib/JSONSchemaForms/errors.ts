import type { Validators, Validator } from 'sveltekit-superforms';
import type { ObjectSchema } from './types';
import type { AnyZodObject } from 'zod';
import { createAjv } from './utils';
import type { ValidateFunction } from 'ajv';

//

type AjvErrors = NonNullable<ValidateFunction['errors']>;
type AjvError = AjvErrors[number];

//

export function objectSchemaToSuperformsValidators(schema: ObjectSchema): Validators<AnyZodObject> {
	const validators: Validators<AnyZodObject> = {};
	for (const propertyName of Object.keys(schema.properties)) {
		validators[propertyName] = objectSchemaToSuperformValidator(schema, propertyName);
	}
	return validators;
}

function objectSchemaToSuperformValidator(schema: ObjectSchema, propertyName: string): Validator<unknown> {
	const ajv = createAjv({ allErrors: true });
	const validate = ajv.compile(schema);

	return (value: unknown) => {
		if (!isPropertyRequired(schema, propertyName)) return null;
		validate({ [propertyName]: value });
		if (!validate.errors) return null;
		const propertyErrors = validate.errors.filter((e) => isAjvErrorAboutProperty(e, propertyName));
		if (propertyErrors.length === 0) return null;
		else return propertyErrors.map((e) => e.message ?? e.keyword).join(`\n`);
	};
}

function isPropertyRequired(schema: ObjectSchema, propertyName: string): boolean {
	return Boolean(schema.required?.includes(propertyName));
}

function isAjvErrorAboutProperty(error: AjvError, propertyName: string): boolean {
	const { keyword, params, instancePath } = error;
	return (keyword === 'required' && params['missingProperty'] === propertyName) || instancePath.includes(propertyName);
}
