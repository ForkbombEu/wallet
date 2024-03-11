<script lang="ts">
	import JSONSchemaForm from '$lib/components/organisms/JSONSchemaForms/JSONSchemaForm.svelte';
	import JSONSchemaParser from '$lib/components/organisms/JSONSchemaForms/JSONSchemaParser.svelte';
	import ErrorDisplay from '$lib/components/molecules/errorDisplay.svelte';
	import testSchema from './schema.json?raw';

	function handleSubmit(data: unknown) {
		console.log(data);
	}

	function handleSubmitError(data: unknown) {
		throw new Error('errore del form!');
	}
</script>

<ion-tab tab="json">
	<ion-header translucent={true}>
		<ion-toolbar>
			<ion-title>Ciao</ion-title>
		</ion-toolbar>
	</ion-header>
	<ion-content fullscreen class="ion-padding space-y-10">
		<JSONSchemaParser schema={testSchema} let:schema>
			<JSONSchemaForm {schema} onSubmit={handleSubmit} />
			<svelte:fragment slot="error" let:error>
				<ErrorDisplay name={error.name} message={error.message} />
			</svelte:fragment>
		</JSONSchemaParser>
	</ion-content>
</ion-tab>
