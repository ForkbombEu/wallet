<script lang="ts">
	import { superForm, setError } from 'sveltekit-superforms/client';
	import JSONSchemaFormField from './JSONSchemaFormField.svelte';
	import type { ObjectSchema } from './types';
	import { genericSuperValidated } from './utils';
	import { Form, FormError } from '$lib/forms';
	import ErrorDisplay from '$lib/components/errorDisplay.svelte';
	import { objectSchemaToSuperformsValidators } from './errors';
	import { m } from '$lib/i18n';

	//

	export let schema: ObjectSchema;
	export let onSubmit: (data: Record<string, unknown>) => Promise<void> | void = () => {};

	//

	const form = superForm(
		genericSuperValidated(), // reference: https://superforms.rocks/concepts/spa#trimming-down-the-bundle-size
		{
			dataType: 'json', // To allow nested fields
			SPA: true,
			// validators: false, // Bypassing superforms validation because we're using ajv externally
			validators: objectSchemaToSuperformsValidators(schema),
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
</script>

<Form {form}>
	<div class="space-y-4">
		{#each Object.entries(schema.properties) as [fieldName, field]}
			{@const required = schema.required?.includes(fieldName)}
			<JSONSchemaFormField {form} fieldPath={fieldName} schema={field} {required} />
		{/each}

		<FormError {form} let:errorMessage>
			<ErrorDisplay name="Form Error" message={errorMessage} />
		</FormError>

		<div class="flex justify-end">
			<d-button type="submit">{m.Submit()}</d-button>
		</div>
	</div>
</Form>
