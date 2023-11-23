<script lang="ts">
	import FieldController from '$lib/forms/fieldController.svelte';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import type { JSONSchema, JSONSchemaField } from './types';
	import { removeOutline } from 'ionicons/icons';
	import type { ZodValidation } from 'sveltekit-superforms';
	import type { AnyZodObject } from 'zod';

	export let superform: SuperForm<ZodValidation<AnyZodObject>>;
	export let schema: JSONSchema;
	export let fieldName: string;
	export let field: JSONSchemaField;

	const { type, description } = field;

	const required = schema.required?.includes(fieldName);
	const label = description ?? fieldName.split('.').at(-1);
</script>

{#if type == 'string'}
	<FieldController {superform} field={fieldName} let:value let:updateValue>
		<ion-item>
			<ion-input
				type="text"
				name={fieldName}
				{label}
				aria-label={label}
				{required}
				label-placement="floating"
				clear-input
				{value}
				on:ionInput={(e) => updateValue(e.target.value)}
			/>
		</ion-item>
	</FieldController>
{:else if type == 'number'}
	<FieldController {superform} field={fieldName} let:value let:updateValue>
		<ion-item>
			<ion-input
				type="number"
				name={fieldName}
				{label}
				aria-label={label}
				{required}
				label-placement="floating"
				clear-input
				{value}
				on:ionInput={(e) => updateValue(Number(e.target.value))}
			/>
		</ion-item>
	</FieldController>
{:else if type == 'integer'}
	<FieldController {superform} field={fieldName} let:value let:updateValue>
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
				{value}
				on:ionInput={(e) => updateValue(Number(e.target.value))}
			/>
		</ion-item>
	</FieldController>
{:else if type == 'boolean'}
	<FieldController {superform} field={fieldName} let:value let:updateValue>
		<ion-item>
			<ion-checkbox
				label-placement="start"
				name={fieldName}
				aria-label={label}
				checked={value}
				on:ionChange={(e) => {
					updateValue(e.target.checked);
				}}
			>
				{label}
			</ion-checkbox>
		</ion-item>
	</FieldController>
{:else if type == 'object'}
	<FieldController {superform} field={fieldName} nested="object">
		<ion-item>
			<ion-label>{label}</ion-label>
		</ion-item>
		<ion-list class="pl-4">
			{#each Object.entries(field.properties) as [nestedFieldName, f]}
				{@const path = `${fieldName}.${nestedFieldName}`}
				<svelte:self {superform} {schema} fieldName={path} field={f} />
			{/each}
		</ion-list>
	</FieldController>
{:else if type == 'array'}
	<FieldController {superform} field={fieldName} nested="array" let:value let:updateValue>
		{@const length = Number(value.length) + 1}
		<ion-item>
			<ion-label>{label}</ion-label>
		</ion-item>
		<ion-list>
			{#each { length } as _, i}
				{@const path = `${fieldName}[${i}]`}
				<ion-item>
					<svelte:self {superform} {schema} fieldName={path} field={field.items} />
					{#if i !== length - 1}
						<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
						<ion-button
							slot="end"
							shape="round"
							color="medium"
							on:click={() => {
								if (Array.isArray(value)) {
									const newArray = [...value];
									newArray.splice(i, 1);
									updateValue(newArray);
								}
							}}
						>
							<ion-icon slot="icon-only" icon={removeOutline} />
						</ion-button>
					{/if}
				</ion-item>
			{/each}
		</ion-list>
	</FieldController>
{/if}
