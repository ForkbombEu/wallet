import Ajv, { type Options } from 'ajv';
import addFormats from 'ajv-formats';
import type { SuperValidated, ZodValidation } from 'sveltekit-superforms';
import type z from 'zod';

//

export function createAjv(options: Options = {}): Ajv {
	const ajv = new Ajv(options);
	addFormats(ajv);
	return ajv;
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
