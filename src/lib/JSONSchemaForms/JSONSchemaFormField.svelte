<script lang="ts">
	import FieldController from '$lib/forms/fieldController.svelte';
	import type { JSONSchema } from './types';
	import { removeOutline } from 'ionicons/icons';
	import ArrayFieldsController from '$lib/forms/arrayFieldsController.svelte';
	import type { SuperformGeneric } from '$lib/forms/types';

	export let superform: SuperformGeneric;
	export let fieldPath: string;
	export let schema: JSONSchema;
	export let required = false;

	const { type, description } = schema;

	let label = description ?? getLabelFromFieldName(fieldPath);
	if (required) label += ' *';

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

<FieldController {superform} {fieldPath} let:value let:updateValue let:errors let:errorText>
	{#if type == 'string'}
		{#if schema.format == 'date'}
			<ion-item>
				<ion-label>{label}</ion-label>
				<ion-datetime-button slot="end" datetime={fieldPath} />
				<ion-modal>
					<ion-datetime
						id={fieldPath}
						presentation="date"
						{value}
						minute-values="0"
						hour-values="0"
						aria-required={required}
						on:ionChange={(e) => updateValue(e.target.value)}
						show-default-buttons={true}
					/>
				</ion-modal>
			</ion-item>
		{:else}
			<ion-item>
				<ion-input
					type="text"
					name={fieldPath}
					{label}
					aria-label={label}
					aria-required={required}
					clear-input
					label-placement="floating"
					{value}
					on:ionInput={(e) => updateValue(e.target.value)}
					class:ion-invalid={errors}
					class:ion-touched={errors}
					error-text={errorText}
				/>
			</ion-item>
		{/if}
	{:else if type == 'number'}
		<ion-item>
			<ion-input
				type="number"
				name={fieldPath}
				{label}
				aria-label={label}
				{required}
				clear-input
				{value}
				on:ionInput={(e) => updateValue(Number(e.target.value))}
				class:ion-invalid={errors}
				class:ion-touched={errors}
				error-text={errorText}
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
				error-text={errorText}
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
				<!-- TODO: Display error properly -->
			</ion-checkbox>
		</ion-item>
	{:else if type == 'object'}
		<div>
			<ion-item>
				<ion-label>{label}</ion-label>
			</ion-item>
			<ion-list class="pl-4">
				{#each Object.entries(schema.properties) as [nestedFieldName, f]}
					{@const path = `${fieldPath}.${nestedFieldName}`}
					{@const required = schema.required?.includes(nestedFieldName)}
					<svelte:self {superform} fieldPath={path} schema={f} {required} />
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
						<svelte:self {superform} fieldPath={itemFieldPath} schema={schema.items} />
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
