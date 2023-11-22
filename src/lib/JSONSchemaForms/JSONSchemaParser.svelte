<script lang="ts">
	import { onMount } from 'svelte';
	import { parseJSON, type JSONSchema, validateJSONSchema } from './utils';
	import Error from '$lib/components/error.svelte';

	export let schemaString: string;

	let schema: JSONSchema;
	let schemaError: Error;

	onMount(() => {
		try {
			schema = validateJSONSchema(parseJSON(schemaString));
		} catch (e) {
			if (e instanceof Error) schemaError = e;
		}
	});
</script>

{#if schemaError}
	<Error name={schemaError.name} message={schemaError.message} />
{:else if schema}
	<slot {schema} />
{/if}
