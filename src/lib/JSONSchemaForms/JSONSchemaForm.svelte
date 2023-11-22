<script lang="ts">
	import JSONSchemaFormField from './JSONSchemaFormField.svelte';
	import type { JSONSchema } from './types';

	export let schema: JSONSchema;
</script>

<ion-list>
	{#each Object.entries(schema.properties) as [fieldName, field]}
		<JSONSchemaFormField {schema} {fieldName} {field} />
	{/each}
</ion-list>
