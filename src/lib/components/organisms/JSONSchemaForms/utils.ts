import { type Options } from 'ajv';
import addFormats from 'ajv-formats';
import type { SuperValidated, ZodValidation } from 'sveltekit-superforms';
import type z from 'zod';
import Ajv2020 from 'ajv/dist/2020';


//

export function createAjv(options: Options = {}): Ajv2020 {
	const ajv = new Ajv2020(options);
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
