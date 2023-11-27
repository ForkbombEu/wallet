<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import JSONSchemaFormField from './JSONSchemaFormField.svelte';
	import type { ObjectSchema } from './types';
	import { createAjv, genericSuperValidated, transformAjvErrors } from './utils';
	import Superform from '$lib/forms/superform.svelte';

	export let schema: ObjectSchema;
	export let onSubmit: (data: Record<string, unknown>) => Promise<void> | void = () => {};

	const superform = superForm(genericSuperValidated(), {
		dataType: 'json',
		onUpdate: async ({ form }) => {
			await onSubmit(form.data);
		},
		taintedMessage: null
	});

	const { form, errors } = superform;

	// Writing errors when form changes
	const ajv = createAjv({ allErrors: true, allowDate: true });
	const validate = ajv.compile(schema);

	$: if ($form) {
		validate($form);
		if (validate.errors) $errors = transformAjvErrors(validate.errors);
	}
</script>

<Superform {superform}>
	<div class="space-y-4">
		{#each Object.entries(schema.properties) as [fieldName, field]}
			<JSONSchemaFormField {superform} {schema} fieldPath={fieldName} {field} />
		{/each}
	</div>
	<ion-item>
		<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
		<ion-button
			on:click={() => {
				console.log($form);
			}}
		>
			miao
		</ion-button>
	</ion-item>
</Superform>
