<script lang="ts">
	import JSONSchemaForm from '$lib/JSONSchemaForms/JSONSchemaForm.svelte';
	import JSONSchemaParser from '$lib/JSONSchemaForms/JSONSchemaParser.svelte';

	export let data;

	const templates = data.templates.items;
</script>

<ion-header translucent={true}>
	<ion-toolbar>
		<ion-title>Ciao</ion-title>
	</ion-toolbar>
</ion-header>

<ion-content fullscreen class="ion-padding space-y-10">
	{#each templates as template}
		{@const schemaString = template.schema}
		<JSONSchemaParser {schemaString} let:schema>
			<JSONSchemaForm {schema} />
		</JSONSchemaParser>
	{/each}
</ion-content>
