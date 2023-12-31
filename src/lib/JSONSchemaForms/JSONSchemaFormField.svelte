<script lang="ts">
	import FieldController from '$lib/forms/fieldController.svelte';
	import type { JSONSchema } from './types';
	import { removeOutline, addOutline } from 'ionicons/icons';
	import ArrayFieldController from '$lib/forms/arrayFieldController.svelte';
	import type { SuperformGeneric } from '$lib/forms/types';
	import IonItemWrapper from './fieldWrappers/ionItemWrapper.svelte';
	import SlotWrapper from './fieldWrappers/slotWrapper.svelte';

	export let superform: SuperformGeneric;
	export let fieldPath: string;
	export let schema: JSONSchema;
	export let required = false;
	export let hideLabel = false;

	export let inputAttributes: svelteHTML.IonInput = {};
	export let fieldWrapper: typeof IonItemWrapper = IonItemWrapper;

	let fieldLabel: string | undefined = undefined;
	export { fieldLabel as label };

	//

	const { type } = schema;

	const label = getLabel();

	function getLabel() {
		if (hideLabel) return undefined;
		let baseLabel = fieldLabel ?? schema.description ?? getLabelFromFieldName(fieldPath);
		if (required) baseLabel += ' *';
		return baseLabel;
	}

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
	{#if schema.enum}
		<svelte:component this={fieldWrapper}>
			<ion-select
				{label}
				placeholder="Select an item"
				label-placement="stacked"
				{value}
				on:ionChange={(e) => updateValue(e.target.value)}
			>
				{#each schema.enum as value}
					<ion-select-option {value}>{value}</ion-select-option>
				{/each}
			</ion-select>
		</svelte:component>
	{:else if type == 'string'}
		{#if schema.format == 'date'}
			<svelte:component this={fieldWrapper}>
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
			</svelte:component>
		{:else}
			<svelte:component this={fieldWrapper}>
				<ion-input
					type="text"
					name={fieldPath}
					{label}
					placeholder={inputAttributes.placeholder}
					aria-label={label}
					aria-required={required}
					clear-input
					label-placement={inputAttributes['label-placement'] ?? 'floating'}
					{value}
					on:ionInput={(e) => updateValue(e.target.value)}
					class:ion-invalid={errors}
					class:ion-touched={errors}
					error-text={errorText}
				/>
			</svelte:component>
		{/if}
	{:else if type == 'number'}
		<svelte:component this={fieldWrapper}>
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
				error-text={errorText}
			/>
		</svelte:component>
	{:else if type == 'integer'}
		<svelte:component this={fieldWrapper}>
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
		</svelte:component>
	{:else if type == 'boolean'}
		<svelte:component this={fieldWrapper}>
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
				{#if errorText}
					<span class="ion-text-danger ml-2 text-xs">{errorText}</span>
				{/if}
			</ion-checkbox>
		</svelte:component>
	{:else if type == 'object'}
		<ion-list class="grow pl-4" class:mt-0={!hideLabel}>
			{#if !hideLabel}
				<ion-item class="-ml-4">
					<ion-label>{label}</ion-label>
				</ion-item>
			{/if}
			{#each Object.entries(schema.properties) as [nestedFieldName, f]}
				{@const path = `${fieldPath}.${nestedFieldName}`}
				{@const required = schema.required?.includes(nestedFieldName)}
				<svelte:self {superform} fieldPath={path} schema={f} {required} />
			{/each}
		</ion-list>
	{:else if type == 'array'}
		<ion-list class="grow">
			<ArrayFieldController {fieldPath} {value} {updateValue}>
				<svelte:fragment slot="before-items" let:addItem let:canAdd>
					<ion-item>
						<ion-label>{label}</ion-label>
					</ion-item>
				</svelte:fragment>
				<svelte:fragment slot="item" let:itemFieldPath let:removeItem>
					<ion-item>
						<svelte:self
							{superform}
							fieldPath={itemFieldPath}
							schema={schema.items}
							hideLabel
							{required}
							inputAttributes={{ placeholder: 'Add an item', ['label-placement']: 'stacked', class: 'grow' }}
							fieldWrapper={SlotWrapper}
						/>
						<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
						<ion-button slot="end" shape="round" color="medium" on:click={removeItem}>
							<ion-icon slot="icon-only" icon={removeOutline} />
						</ion-button>
					</ion-item>
				</svelte:fragment>
				<svelte:fragment slot="after-items" let:addItem let:canAdd>
					{#if canAdd}
						<ion-item>
							<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
							<ion-button class="grow" expand="full" shape="round" color="light" disabled={!canAdd} on:click={addItem}>
								<ion-icon slot="start" icon={addOutline} />
								Add an item
							</ion-button>
						</ion-item>
					{/if}
				</svelte:fragment>
			</ArrayFieldController>
		</ion-list>
	{/if}
</FieldController>

<style>
	.ion-text-danger {
		color: var(--ion-color-danger);
	}
</style>
