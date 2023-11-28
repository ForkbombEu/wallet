<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import JSONSchemaFormField from './JSONSchemaFormField.svelte';
	import type { ObjectSchema } from './types';
	import {
		createAjv,
		genericSuperValidated,
		getTaintedFieldsAjvErrors,
		ajvErrorsToSuperformsErrors,
		type SuperformErrors
	} from './utils';
	import Superform from '$lib/forms/superform.svelte';

	//

	export let schema: ObjectSchema;
	export let onSubmit: (data: Record<string, unknown>) => Promise<void> | void = () => {};

	//

	const superform = superForm(genericSuperValidated(), {
		dataType: 'json',
		SPA: true,
		validators: false,
		onUpdate: async ({ form, cancel }) => {
			await validateForm(form.data);
			await onSubmit(form.data);
		},
		taintedMessage: null
	});

	const { form, errors, tainted } = superform;

	const ajv = createAjv({ allErrors: true });
	const validate = ajv.compile(schema);

	//

	$: $errors = validateTaintedFields($form, $tainted);

	function validateTaintedFields(form: typeof $form, taintedFields: typeof $tainted): SuperformErrors {
		validate(form);
		const ajvErrors = validate.errors ?? [];
		const taintedFieldsPaths = Object.keys(taintedFields ?? []);
		const taintedFieldsAjvErrors = getTaintedFieldsAjvErrors(ajvErrors, taintedFieldsPaths);
		return ajvErrorsToSuperformsErrors(taintedFieldsAjvErrors);
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
			<JSONSchemaFormField {superform} {schema} fieldPath={fieldName} {field} />
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
