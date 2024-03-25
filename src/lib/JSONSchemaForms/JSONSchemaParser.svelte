<script lang="ts">
	import { onMount } from 'svelte';
	import { createAjv } from './utils';
	import type { JSONSchema, ObjectSchema } from './types';
	import ErrorDisplay from '$lib/components/errorDisplay.svelte';

	export let schema: string | Object | JSON | ObjectSchema | JSONSchema;

	let objectSchema: ObjectSchema;
	let schemaError: Error;

	onMount(() => {
		try {
			objectSchema = objectSchemaOrThrow(
				validateJSONSchema(convertJsonToSchema(getObjectFromProp(schema)))
			);
		} catch (e) {
			if (e instanceof Error) schemaError = e;
		}
	});

	function convertJsonToSchema(json: Object): Object {
		const schema = {
			$schema: 'http://json-schema.org/draft-07/schema#',
			type: 'object',
			properties: {},
			required: []
		};

		for (const key in json) {
			//@ts-ignore
			const property = json[key];
			const valueType = property.value_type || 'string';

			//@ts-ignore
			schema.properties[key] = {
				type: valueType
			};

			if (property.mandatory) {
				//@ts-ignore
				schema.required.push(key);
			}

			if (property.display && property.display.length > 0) {
				//@ts-ignore
				schema.properties[key].title = property.display[0].name;
			}
		}

		return schema;
	}

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
	<slot name="error" error={schemaError} />
{:else if objectSchema}
	<slot schema={objectSchema} />
{/if}
