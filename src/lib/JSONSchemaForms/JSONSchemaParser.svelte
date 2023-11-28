<script lang="ts">
	import { onMount } from 'svelte';
	import { parseJSON, validateJSONSchema } from './utils';
	import type { ObjectSchema } from './types';
	import Error from '$lib/components/error.svelte';

	export let schemaString: string;

	let schema: ObjectSchema;
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
