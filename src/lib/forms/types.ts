import type { SuperForm } from 'sveltekit-superforms/client';
import type { AnyZodObject, z } from 'zod';

export type SuperformGeneric<T extends AnyZodObject = AnyZodObject, M = unknown> = SuperForm<
	z.infer<T>,
	M
>;

export type ZodFileOptions = {
	types?: string[];
	size?: number;
};
