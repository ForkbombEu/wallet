<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import JSONSchemaFormField from './JSONSchemaFormField.svelte';
	import type { JSONSchema } from './types';
	import { JSONSchemaToSuperformsValidator, genericSuperValidated } from './utils';

	export let schema: JSONSchema;
	export let onSubmit: (data: Record<string, unknown>) => Promise<void> | void = () => {};

	const superform = superForm(genericSuperValidated(), {
		validators: JSONSchemaToSuperformsValidator(schema),
		dataType: 'json',
		onUpdate: async ({ form }) => {
			await onSubmit(form.data);
		}
	});
</script>

<ion-list>
	{#each Object.entries(schema.properties) as [fieldName, field]}
		<JSONSchemaFormField {schema} {fieldName} {field} />
	{/each}
</ion-list>
