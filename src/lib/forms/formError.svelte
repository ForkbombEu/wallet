<script lang="ts">
	import type { ValidationErrors } from 'sveltekit-superforms';
	import type { SuperformGeneric } from './types';
	import type { AnyZodObject } from 'zod';

	type SchemaGeneric = $$Generic<AnyZodObject>;
	export let form: SuperformGeneric<SchemaGeneric>;

	const { errors } = form;

	$: errorMessage = getFormErrorMessage($errors);

	function getFormErrorMessage(e: ValidationErrors<SchemaGeneric>): string | undefined {
		if (e._errors) return e._errors[0];
		else return undefined;
	}
</script>

{#if errorMessage}
	<slot {errorMessage} />
{/if}
