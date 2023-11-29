<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import JSONSchemaFormField from './JSONSchemaFormField.svelte';
	import type { ObjectSchema } from './types';
	import { ajvErrorsToSuperformsErrors } from './errors';
	import { createAjv, genericSuperValidated } from './utils';
	import Superform from '$lib/forms/superform.svelte';

	//

	export let schema: ObjectSchema;
	export let onSubmit: (data: Record<string, unknown>) => Promise<void> | void = () => {};

	//

	const superform = superForm(
		genericSuperValidated(), // reference: https://superforms.rocks/concepts/spa#trimming-down-the-bundle-size
		{
			dataType: 'json', // To allow nested fields
			SPA: true,
			validators: false, // Bypassing superforms validation because we're using ajv externally
			onUpdate: async ({ form, cancel }) => {
				try {
					await validateForm(form.data);
					await onSubmit(form.data);
				} catch (e) {
					cancel();
				}
			},
			taintedMessage: null
		}
	);

	const { form, errors, tainted } = superform;

	const ajv = createAjv({ allErrors: true });
	const validate = ajv.compile(schema);

	//

	$: validateTaintedFields($form, $tainted);

	function validateTaintedFields(form: typeof $form, taintedFields: typeof $tainted) {
		if (!tainted) return;

		validate(form);
		if (!validate.errors) return;

		const ajvErrors = validate.errors;

		console.log(ajvErrors);
		console.log(taintedFields);

		// This filtering works only for the first level keys
		// const taintedFieldsPaths = Object.keys(taintedFields ?? []);
		// const taintedFieldsAjvErrors = ajvErrors.filter((error) =>
		// 	taintedFieldsPaths.some((path) => error.instancePath.includes(path))
		// );

		// const superformErrors = ajvErrorsToSuperformsErrors(taintedFieldsAjvErrors);
		// errors.set(superformErrors);
	}

	async function validateForm(form: typeof $form) {
		validate(form);
		const ajvErrors = validate.errors ?? [];
		const superformErrors = ajvErrorsToSuperformsErrors(ajvErrors);
		errors.set(superformErrors);
		if (ajvErrors.length > 0) throw new Error();
	}
</script>

<Superform {superform}>
	<div class="space-y-4">
		{#each Object.entries(schema.properties) as [fieldName, field]}
			{@const required = schema.required?.includes(fieldName)}
			<JSONSchemaFormField {superform} fieldPath={fieldName} schema={field} {required} />
		{/each}
		<ion-item>
			<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
			<ion-button type="submit"> miao </ion-button>
		</ion-item>
	</div>

	<div class="flex">
		<pre>{JSON.stringify($form, null, 2)}</pre>
		<pre>{JSON.stringify($errors, null, 2)}</pre>
	</div>
</Superform>
