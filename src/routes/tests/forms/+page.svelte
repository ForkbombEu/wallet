<script lang="ts">
	import JSONSchemaForm from '$lib/JSONSchemaForms/JSONSchemaForm.svelte';
	import JSONSchemaParser from '$lib/JSONSchemaForms/JSONSchemaParser.svelte';
	import ErrorDisplay from '$lib/components/errorDisplay.svelte';
	import testSchema from './schema.json?raw';
</script>

<ion-header translucent={true}>
	<ion-toolbar>
		<ion-title>Ciao</ion-title>
	</ion-toolbar>
</ion-header>

<ion-content fullscreen class="ion-padding space-y-10">
	<JSONSchemaParser schema={testSchema} let:schema>
		<JSONSchemaForm {schema} />
		<svelte:fragment slot="error" let:error>
			<ErrorDisplay name={error.name} message={error.message} />
		</svelte:fragment>
	</JSONSchemaParser>
</ion-content>
