<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import JSONSchemaFormField from './JSONSchemaFormField.svelte';
	import type { JSONSchema } from './types';
	import { JSONSchemaToSuperformsValidator, genericSuperValidated } from './utils';
	import Superform from '$lib/forms/superform.svelte';

	export let schema: JSONSchema;
	export let onSubmit: (data: Record<string, unknown>) => Promise<void> | void = () => {};

	const superform = superForm(genericSuperValidated(), {
		validators: JSONSchemaToSuperformsValidator(schema),
		dataType: 'json',
		onUpdate: async ({ form }) => {
			await onSubmit(form.data);
		},
		taintedMessage: null
	});
</script>

<Superform {superform}>
	<ion-list>
		{#each Object.entries(schema.properties) as [fieldName, field]}
			<JSONSchemaFormField {superform} {schema} {fieldName} {field} />
		{/each}
	</ion-list>
</Superform>
