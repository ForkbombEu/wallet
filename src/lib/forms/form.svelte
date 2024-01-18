<script lang="ts" context="module">
	import { superValidateSync, type FormOptions, type SuperForm, superForm } from 'sveltekit-superforms/client';
	import { z, type AnyZodObject, type ZodEffects } from 'zod';
	import type { ZodValidation } from 'sveltekit-superforms';

	export type SubmitFunction<T extends AnyZodObject> = NonNullable<FormOptions<ZodValidation<T>, unknown>['onUpdate']>;

	interface CreateFormParameters<T extends AnyZodObject> {
		schema: T | ZodEffects<T>;
		onSubmit: SubmitFunction<T>;
		initialData: Partial<z.infer<T>> | undefined;
		options: FormOptions<ZodValidation<T>, unknown>;
	}

	export function createForm<T extends AnyZodObject>(parameters: Partial<CreateFormParameters<T>>) {
		const { schema = z.object({}), initialData = {}, options = {}, onSubmit = () => {} } = parameters;

		const form = superValidateSync(initialData, schema, { errors: false });

		return superForm<ZodValidation<T>>(form, {
			SPA: true,
			applyAction: false,
			scrollToError: 'smooth',
			// @ts-ignore
			validators: schema,
			onUpdate: async (input) => {
				try {
					await onSubmit(input);
				} catch (e) {
					console.log(e);
				}
			},
			taintedMessage: null,
			...options
		});
	}
</script>

<script lang="ts">
	type SchemaGeneric = $$Generic<AnyZodObject>;
	export let form: SuperForm<SchemaGeneric>;

	const { enhance, delayed } = form;
</script>

<form method="post" use:enhance>
	<slot delayed={$delayed} />
</form>

{#if $delayed}
	<slot name="loading" />
{/if}
