<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import JSONSchemaFormField from './JSONSchemaFormField.svelte';
	import type { JSONSchema } from './types';
	import { JSONSchemaToSuperformsValidators, genericSuperValidated } from './utils';
	import Superform from '$lib/forms/superform.svelte';
	import Ajv from 'ajv';

	export let schema: JSONSchema;
	export let onSubmit: (data: Record<string, unknown>) => Promise<void> | void = () => {};

	const superform = superForm(genericSuperValidated(), {
		validators: JSONSchemaToSuperformsValidators(schema),
		dataType: 'json',
		onUpdate: async ({ form }) => {
			await onSubmit(form.data);
		},
		taintedMessage: null
	});

	const { validate } = superform;

	async function v() {
		const res = await validate();
	}
</script>

<Superform {superform}>
	<ion-list>
		{#each Object.entries(schema.properties) as [fieldName, field]}
			<JSONSchemaFormField {superform} {schema} {fieldName} {field} />
		{/each}
	</ion-list>
	<ion-item>
		<ion-button on:click={v}> validate </ion-button>
	</ion-item>
</Superform>
