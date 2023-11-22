<script lang="ts">
	import type { JSONSchema, JSONSchemaField } from './types';
	import { addOutline } from 'ionicons/icons';

	export let schema: JSONSchema;
	export let fieldName: string;
	export let field: JSONSchemaField;

	const { type, description } = field;

	const required = schema.required?.includes(fieldName);
	const label = description ?? fieldName;
</script>

{#if type == 'string'}
	<ion-item>
		<ion-input
			type="text"
			name={fieldName}
			{label}
			aria-label={label}
			{required}
			label-placement="floating"
			clear-input
		/>
	</ion-item>
{:else if type == 'number'}
	<ion-item>
		<ion-input
			type="number"
			name={fieldName}
			{label}
			aria-label={label}
			{required}
			label-placement="floating"
			clear-input
		/>
	</ion-item>
{:else if type == 'integer'}
	<ion-item>
		<ion-input
			type="number"
			name={fieldName}
			{label}
			aria-label={label}
			{required}
			label-placement="floating"
			clear-input
			step="1"
			pattern="^\d+$"
		/>
	</ion-item>
{:else if type == 'boolean'}
	<ion-item>
		<ion-checkbox label-placement="start" name={fieldName} aria-label={label}>{label}</ion-checkbox>
	</ion-item>
{:else if type == 'object'}
	<ion-item>
		<ion-text color="medium">{label}</ion-text>
	</ion-item>
	<ion-list class="pl-4">
		{#each Object.entries(field.properties) as [fieldName, f]}
			<svelte:self {schema} {fieldName} field={f} />
		{/each}
	</ion-list>
{:else if type == 'array'}
	<ion-item>
		<ion-text color="medium">{label}</ion-text>
	</ion-item>
	<ion-list>
		<ion-item>
			<svelte:self {schema} {fieldName} field={field.items} />
			<ion-button slot="end" shape="round" color="tertiary">
				<ion-icon slot="icon-only" icon={addOutline} />
			</ion-button>
		</ion-item>
	</ion-list>
{/if}
