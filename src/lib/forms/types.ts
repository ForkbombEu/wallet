import type { ZodValidation } from 'sveltekit-superforms';
import type { SuperForm } from 'sveltekit-superforms/client';
import type { AnyZodObject } from 'zod';

export type SuperformGeneric<T extends AnyZodObject = AnyZodObject, M = unknown> = SuperForm<
	ZodValidation<T>,
	M
>;

export type ZodFileOptions = {
	types?: string[];
	size?: number;
};
