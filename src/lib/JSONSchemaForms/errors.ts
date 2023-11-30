// import type { ValidateFunction } from 'ajv';
// import { set } from 'lodash';
// import type { ObjectSchema } from './types';
// import { createAjv } from './utils';

// //

export type SuperformError = string[];
export type SuperformErrors = {
	[x: string]: SuperformError | SuperformErrors;
};

// type SuperformsValidator = (value: unknown) => string[] | null | undefined
// type SuperformsValidators = Record<string, SuperformsValidator>

// export function objectSchemaToSuperformsValidators(schema: ObjectSchema): SuperformsValidators {
// 	const ajv = createAjv()
// 	return Object.entries(schema.properties).reduce((acc, curr)=>{
// 		acc[curr[0]] = () => null
// 	}, {} as SuperformsValidators)
// }

// type AjvErrors = NonNullable<ValidateFunction['errors']>;
// type AjvError = AjvErrors[number];

// //

// // function getErrorPathLeaf(error: AjvError): string {
// // 	return error.instancePath.split('/').at(-1) ?? '';
// // }

// // export function isAjvErrorAboutRequiredField(schema: ObjectSchema, error: AjvError): boolean {
// // 	if (error.keyword === 'required') return true;
// // 	else if (schema.required?.includes(getErrorPathLeaf(error))) return true;
// // 	else return false;
// // }

// // export function getAjvErrorsAboutRequiredFields(schema: ObjectSchema, errors: AjvError[]): AjvError[] {
// // 	return errors.filter((e) => isAjvErrorAboutRequiredField(schema, e));
// // }

// // export function ajvErrorsToSuperformsErrors(ajvErrors: AjvError[]): SuperformErrors {
// // 	let errorsObject: SuperformErrors = {};
// // 	ajvErrors.forEach((error) => {
// // 		const errorPathArray = getAjvErrorPathArray(error);
// // 		set(errorsObject, errorPathArray, [error.message ?? error.keyword]);
// // 	});
// // 	return errorsObject;
// // }

// // function getAjvErrorPathArray(error: AjvError): string[] {
// // 	const errorPathArray = error.instancePath.split('/').filter((p) => p);
// // 	if (error.keyword === 'required') {
// // 		errorPathArray.push(error.params.missingProperty);
// // 	}
// // 	return errorPathArray;
// // }

// // export function ajvErrorsToSuperformsErrors(ajvErrors: AjvError[]): SuperformErrors {
// // 	let errorsObject: SuperformErrors = {};
// // 	ajvErrors.forEach((error) => {
// // 		const errorPathArray = getAjvErrorPathArray(error);
// // 		set(errorsObject, errorPathArray, [error.message ?? error.keyword]);
// // 	});
// // 	return errorsObject;
// // }

// // function getAjvErrorPathArray(error: AjvError): string[] {
// // 	const errorPathArray = error.instancePath.split('/').filter((p) => p);
// // 	if (error.keyword === 'required') {
// // 		errorPathArray.push(error.params.missingProperty);
// // 	}
// // 	return errorPathArray;
// // }

// // //

// // $: validateTaintedFields($form, $tainted);

// // function validateTaintedFields(form: typeof $form, taintedFields: typeof $tainted) {
// // 	// if (!tainted) return;
// // 	// validate(form);
// // 	// if (!validate.errors) return;
// // 	// const ajvErrors = validate.errors;
// // 	// console.log(ajvErrors);
// // 	// console.log(taintedFields);
// // 	// This filtering works only for the first level keys
// // 	// const taintedFieldsPaths = Object.keys(taintedFields ?? []);
// // 	// const taintedFieldsAjvErrors = ajvErrors.filter((error) =>
// // 	// 	taintedFieldsPaths.some((path) => error.instancePath.includes(path))
// // 	// );
// // 	// const superformErrors = ajvErrorsToSuperformsErrors(taintedFieldsAjvErrors);
// // 	// errors.set(superformErrors);
// // }

// // async function validateForm(form: typeof $form) {
// // 	validate(form);
// // 	if (!validate.errors) return;
// // 	const ajvErrors = getAjvErrorsAboutRequiredFields(schema, validate.errors);
// // 	if (ajvErrors.length === 0) return;
// // 	const superformErrors = ajvErrorsToSuperformsErrors(ajvErrors);
// // 	errors.set(superformErrors);
// // 	throw new Error();
// // }
