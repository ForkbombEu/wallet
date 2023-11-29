import type { ValidateFunction } from 'ajv';
import { set } from 'lodash';

//

type AjvErrors = NonNullable<ValidateFunction['errors']>;
type AjvError = AjvErrors[number];

type SuperformError = string[];
type SuperformErrors = {
	[x: string]: SuperformError | SuperformErrors;
};

//

export function ajvErrorsToSuperformsErrors(ajvErrors: AjvError[]): SuperformErrors {
	let errorsObject: SuperformErrors = {};
	ajvErrors.forEach((error) => {
		const errorPathArray = error.instancePath.split('/').filter((p) => p);
		set(errorsObject, errorPathArray, [error.message ?? error.keyword]);
	});
	return errorsObject;
}

// function getAjvErrorPathArray(error: AjvError): string[] {
// 	const errorPathArray = error.instancePath.split('/').filter((p) => p);
// 	if (error.keyword === 'required') {
// 		errorPathArray.push(error.params.missingProperty);
// 	}
// 	return errorPathArray;
// }

// export function ajvErrorsToSuperformsErrors(ajvErrors: AjvError[]): SuperformErrors {
// 	let errorsObject: SuperformErrors = {};
// 	ajvErrors.forEach((error) => {
// 		const errorPathArray = getAjvErrorPathArray(error);
// 		set(errorsObject, errorPathArray, [error.message ?? error.keyword]);
// 	});
// 	return errorsObject;
// }

// function getAjvErrorPathArray(error: AjvError): string[] {
// 	const errorPathArray = error.instancePath.split('/').filter((p) => p);
// 	if (error.keyword === 'required') {
// 		errorPathArray.push(error.params.missingProperty);
// 	}
// 	return errorPathArray;
// }
