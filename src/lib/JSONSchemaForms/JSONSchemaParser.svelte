<script lang="ts">
	import { onMount } from 'svelte';
	import { createAjv } from './utils';
	import type { JSONSchema, ObjectSchema } from './types';
	import ErrorDisplay from '$lib/components/error.svelte';

	export let schema: string | Object | JSON | ObjectSchema | JSONSchema;

	let objectSchema: ObjectSchema;
	let schemaError: Error;

	onMount(() => {
		try {
			objectSchema = objectSchemaOrThrow(validateJSONSchema(getObjectFromProp(schema)));
		} catch (e) {
			if (e instanceof Error) schemaError = e;
		}
	});

	function getObjectFromProp(s: typeof schema): Object {
		if (typeof s === 'string') {
			const parsedProp = JSON.parse(s);
			if (typeof parsedProp === 'object') return parsedProp as Object;
			throw new Error('Passed `schema` prop is not a valid object');
		} else {
			return s;
		}
	}

	function validateJSONSchema(schema: Object): JSONSchema {
		createAjv().validateSchema(schema);
		return schema as unknown as JSONSchema;
	}

	function objectSchemaOrThrow(schema: JSONSchema): ObjectSchema {
		if (schema.type !== 'object') throw new Error('Passed `schema` prop is not an Object Schema');
		return schema;
	}
</script>

{#if schemaError}
	<ErrorDisplay name={schemaError.name} message={schemaError.message} />
{:else if objectSchema}
	<slot schema={objectSchema} />
{/if}
