<script lang="ts">
	import JSONSchemaForm from '$lib/JSONSchemaForms/JSONSchemaForm.svelte';
	import JSONSchemaParser from '$lib/JSONSchemaForms/JSONSchemaParser.svelte';
	import schema from './schema.json?raw';
</script>

<ion-header translucent={true}>
	<ion-toolbar>
		<ion-title>Ciao</ion-title>
	</ion-toolbar>
</ion-header>

<ion-content fullscreen class="ion-padding space-y-10">
	<JSONSchemaParser schemaString={schema} let:schema>
		<JSONSchemaForm {schema} />
	</JSONSchemaParser>
</ion-content>
