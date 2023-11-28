<script lang="ts">
	import FieldController from '$lib/forms/fieldController.svelte';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import type { JSONSchema, ObjectSchema } from './types';
	import { removeOutline } from 'ionicons/icons';
	import type { ZodValidation } from 'sveltekit-superforms';
	import type { AnyZodObject } from 'zod';
	import ArrayFieldsController from '$lib/forms/arrayFieldsController.svelte';

	export let superform: SuperForm<ZodValidation<AnyZodObject>>;
	export let schema: ObjectSchema;
	export let fieldPath: string;
	export let field: JSONSchema;

	const { type, description } = field;

	const required = false;
	// const required = schema.required?.includes(fieldPath);
	const label = description ?? getLabelFromFieldName(fieldPath);

	const nested = field.type == 'array' || field.type == 'object' ? field.type : undefined;

	function getLabelFromFieldName(fieldName: string) {
		return (
			fieldName
				// Object field handling
				.split('.')
				.at(-1)
				// Array field handling
				?.split('[')
				.at(0)
		);
	}
</script>

<FieldController {superform} {fieldPath} {nested} let:value let:updateValue let:errors>
	{#if type == 'string'}
		{@const e = JSON.stringify(errors?.['_errors']?.join(' | '))}
		<ion-item>
			<ion-input
				type="text"
				name={fieldPath}
				{label}
				aria-label={label}
				{required}
				label-placement="floating"
				clear-input
				{value}
				on:ionInput={(e) => updateValue(e.target.value)}
				class:ion-invalid={errors}
				class:ion-touched={errors}
				error-text={e}
			/>
		</ion-item>
	{:else if type == 'number'}
		<ion-item>
			<ion-input
				type="number"
				name={fieldPath}
				{label}
				aria-label={label}
				{required}
				label-placement="floating"
				clear-input
				{value}
				on:ionInput={(e) => updateValue(Number(e.target.value))}
				class:ion-invalid={errors}
				class:ion-touched={errors}
			/>
		</ion-item>
	{:else if type == 'integer'}
		<ion-item>
			<ion-input
				type="number"
				name={fieldPath}
				{label}
				aria-label={label}
				{required}
				label-placement="floating"
				clear-input
				step="1"
				pattern="^\d+$"
				{value}
				on:ionInput={(e) => updateValue(Number(e.target.value))}
				class:ion-invalid={errors}
				class:ion-touched={errors}
			/>
		</ion-item>
	{:else if type == 'boolean'}
		<ion-item>
			<ion-checkbox
				label-placement="start"
				name={fieldPath}
				aria-label={label}
				checked={value}
				on:ionChange={(e) => {
					updateValue(e.target.checked);
				}}
				class:ion-invalid={errors}
				class:ion-touched={errors}
			>
				{label}
			</ion-checkbox>
		</ion-item>
	{:else if type == 'object'}
		<div>
			<ion-item>
				<ion-label>{label}</ion-label>
			</ion-item>
			<ion-list class="pl-4">
				{#each Object.entries(field.properties) as [nestedFieldName, f]}
					{@const path = `${fieldPath}.${nestedFieldName}`}
					<svelte:self {superform} {schema} fieldPath={path} field={f} />
				{/each}
			</ion-list>
		</div>
	{:else if type == 'array'}
		<div>
			<ion-item>
				<ion-label>{label}</ion-label>
			</ion-item>
			<ion-list>
				<ArrayFieldsController {fieldPath} {value} {updateValue} let:removeItem let:itemFieldPath let:last>
					<ion-item>
						<svelte:self {superform} {schema} fieldPath={itemFieldPath} field={field.items} />
						{#if !last}
							<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
							<ion-button slot="end" shape="round" color="medium" on:click={removeItem}>
								<ion-icon slot="icon-only" icon={removeOutline} />
							</ion-button>
						{/if}
					</ion-item>
				</ArrayFieldsController>
			</ion-list>
		</div>
	{/if}
</FieldController>
