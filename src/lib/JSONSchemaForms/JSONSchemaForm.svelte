<script lang="ts">
	import { superForm, setError } from 'sveltekit-superforms/client';
	import JSONSchemaFormField from './JSONSchemaFormField.svelte';
	import type { ObjectSchema } from './types';
	import { genericSuperValidated } from './utils';
	import Superform from '$lib/forms/superform.svelte';
	import FormError from '$lib/forms/formError.svelte';
	import ErrorDisplay from '$lib/components/errorDisplay.svelte';

	//

	export let schema: ObjectSchema;
	export let onSubmit: (data: Record<string, unknown>) => Promise<void> | void = () => {
		throw new Error('ne');
	};

	//

	const superform = superForm(
		genericSuperValidated(), // reference: https://superforms.rocks/concepts/spa#trimming-down-the-bundle-size
		{
			dataType: 'json', // To allow nested fields
			SPA: true,
			validators: false, // Bypassing superforms validation because we're using ajv externally
			onUpdate: async ({ form }) => {
				try {
					await onSubmit(form.data);
				} catch (e) {
					setError(form, parseFormException(e));
				}
			},
			taintedMessage: null
		}
	);

	function parseFormException(e: unknown): string {
		if (typeof e === 'string') return e;
		else if (e instanceof Error) return e.message;
		else return 'FORM_SUBMIT_ERROR';
	}

	const { form, errors } = superform;
</script>

<Superform {superform}>
	<div class="space-y-4">
		{#each Object.entries(schema.properties) as [fieldName, field]}
			{@const required = schema.required?.includes(fieldName)}
			<JSONSchemaFormField {superform} fieldPath={fieldName} schema={field} {required} />
		{/each}

		<FormError {superform} let:errorMessage>
			<ErrorDisplay name="Form Error" message={errorMessage} />
		</FormError>

		<div class="flex justify-end">
			<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
			<ion-button type="submit"> Submit </ion-button>
		</div>
	</div>

	<div class="flex">
		<pre>{JSON.stringify($form, null, 2)}</pre>
		<pre>{JSON.stringify($errors, null, 2)}</pre>
	</div>
</Superform>
