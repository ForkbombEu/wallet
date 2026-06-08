<script lang="ts" context="module">
	import { log } from '$lib/log';

	import { type FormOptions, type SuperForm, superForm } from 'sveltekit-superforms/client';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { z, type AnyZodObject, type ZodTypeAny } from 'zod';

	type FormSchema<T extends AnyZodObject> = z.infer<T>;

	export type SubmitFunction<T extends AnyZodObject> = NonNullable<
		FormOptions<FormSchema<T>, unknown>['onUpdate']
	>;

	interface CreateFormParameters<T extends AnyZodObject> {
		schema: ZodTypeAny;
		onSubmit: SubmitFunction<T>;
		initialData: Partial<z.infer<T>> | undefined;
		options: FormOptions<FormSchema<T>, unknown>;
	}

	export function createForm<T extends AnyZodObject>(parameters: Partial<CreateFormParameters<T>>) {
		const {
			schema = z.object({}),
			initialData = {},
			options = {},
			onSubmit = () => {}
		} = parameters;

		return superForm<FormSchema<T>>(initialData as FormSchema<T>, {
			SPA: true,
			applyAction: false,
			scrollToError: 'smooth',
			validators: zodClient(schema),
			onUpdate: async (input) => {
				try {
					if (input.form.valid) await onSubmit(input);
					else throw new Error('INVALID_FORM');
				} catch (e: any) {
					await log(e);
				}
			},
			taintedMessage: null,
			...options
		});
	}
</script>

<script lang="ts">
	type SchemaGeneric = $$Generic<AnyZodObject>;
	export let form: SuperForm<z.infer<SchemaGeneric>>;
	export let formClass: string | undefined = undefined;

	export let id: string | undefined = undefined;

	const { enhance, delayed, tainted } = form;
	$: isTainted = $tainted ? Object.values($tainted).some(Boolean) : false;
</script>

<form {id} class={formClass} method="post" use:enhance>
	<slot delayed={$delayed} {isTainted} />
</form>

{#if $delayed}
	<slot name="loading" />
{/if}
