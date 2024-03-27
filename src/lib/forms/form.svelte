<script lang="ts" context="module">
	import { log } from '$lib/log';

	import {
		superValidateSync,
		type FormOptions,
		type SuperForm,
		superForm
	} from 'sveltekit-superforms/client';
	import { z, type AnyZodObject, type ZodEffects } from 'zod';
	import type { ZodValidation } from 'sveltekit-superforms';

	export type SubmitFunction<T extends AnyZodObject> = NonNullable<
		FormOptions<ZodValidation<T>, unknown>['onUpdate']
	>;

	interface CreateFormParameters<T extends AnyZodObject> {
		schema: T | ZodEffects<T>;
		onSubmit: SubmitFunction<T>;
		initialData: Partial<z.infer<T>> | undefined;
		options: FormOptions<ZodValidation<T>, unknown>;
	}

	export function createForm<T extends AnyZodObject>(parameters: Partial<CreateFormParameters<T>>) {
		const {
			schema = z.object({}),
			initialData = {},
			options = {},
			onSubmit = () => {}
		} = parameters;

		const form = superValidateSync(initialData, schema, { errors: false });

		return superForm<ZodValidation<T>>(form, {
			SPA: true,
			applyAction: false,
			scrollToError: 'smooth',
			// @ts-ignore
			validators: schema,
			onUpdate: async (input) => {
				try {
					if (input.form.valid) await onSubmit(input);
					else throw new Error('INVALID_FORM');
				} catch (e) {
					log(e);
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
	export let formClass: string | undefined = undefined

	export let id: string | undefined = undefined

	const { enhance, delayed } = form;
</script>

<form {id} class={formClass} method="post" use:enhance>
	<slot delayed={$delayed} />
</form>

{#if $delayed}
	<slot name="loading" />
{/if}
