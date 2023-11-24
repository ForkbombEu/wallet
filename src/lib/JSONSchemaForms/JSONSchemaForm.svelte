<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import JSONSchemaFormField from './JSONSchemaFormField.svelte';
	import type { JSONSchema } from './types';
	import { JSONSchemaToSuperformsValidators, genericSuperValidated } from './utils';
	import Superform from '$lib/forms/superform.svelte';

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

	const { validate, form } = superform;

	async function v() {
		const res = await validate();
	}
</script>

<Superform {superform}>
	<div class="space-y-4">
		{#each Object.entries(schema.properties) as [fieldName, field]}
			<JSONSchemaFormField {superform} {schema} fieldPath={fieldName} {field} />
		{/each}
	</div>
	<ion-item>
		<ion-button on:click={v}> validate </ion-button>
		<ion-button
			on:click={() => {
				console.log($form);
			}}
		>
			miao
		</ion-button>
	</ion-item>
</Superform>
