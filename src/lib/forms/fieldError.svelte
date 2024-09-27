<script context="module" lang="ts">
	/**
	 * Superforms validation errors come in different shapes:
	 * • string[] (the most common)
	 * • {"1": string[], "2": string[], ...} (when using arrays)
	 * • {"key": string[], ...} (when using nested fields)
	 *
	 * Here we try to detect the shape of the error data.
	 */

	export function isNonNullable(value: unknown): value is NonNullable<unknown> {
		return value !== undefined && value !== null;
	}

	export function isBaseError(errorData: unknown): errorData is string[] {
		return Array.isArray(errorData) && errorData.length > 0;
	}

	export function isNestedError(errorData: unknown): errorData is Record<string, string[]> {
		return (
			isNonNullable(errorData) &&
			!isBaseError(errorData) &&
			typeof errorData === 'object' &&
			Object.values(errorData).some((value) => isBaseError(value))
		);
	}

	export function fieldHasErrors(errorData: unknown): boolean {
		return isBaseError(errorData) || isNestedError(errorData);
	}
</script>

<script lang="ts">
	import { type FormPath, type ZodValidation } from 'sveltekit-superforms';
	import { z } from 'zod';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';

	type T = $$Generic<AnyZodObject>;

	export let field: FormPath<z.infer<T>>;
	export let form: SuperForm<ZodValidation<T>, any>;
	const { errors } = formFieldProxy(form, field);
</script>

{#if isBaseError($errors)}
	<div class="space-y-1">
		{#each $errors as error}
			<d-text size="xs" class="text-error">{error}</d-text><br />
		{/each}
	</div>
{/if}

{#if isNestedError($errors)}
	<div class="space-y-2">
		{#each Object.entries($errors) as [key, errors]}
			{#if isBaseError(errors)}
				<div class="space-y-1">
					{#if key !== '_errors'}
						<d-text size="xs" class="text-error"><span class="font-bold">{key}</span></d-text>
					{/if}
					{#each errors as error}
						<d-text size="xs" class="text-error">{error}</d-text><br />
					{/each}
				</div>
			{/if}
		{/each}
	</div>
{/if}
