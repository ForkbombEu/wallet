<script lang="ts">
	import { zencode_exec } from 'zenroom';
	export let keyring = {};
	zencode_exec(`Scenario 'ecdh': Create the key
Scenario 'ethereum': Create key
Scenario 'reflow': Create the key
Scenario 'schnorr': Create the key
Scenario 'eddsa': Create the key
Scenario 'bbs': implementation of https://identity.foundation/bbs-signature/draft-irtf-cfrg-bbs-signatures.html
Scenario 'pvss': Create the key

Given nothing

# Here we are creating the keys
When I create the ecdh key
When I create the ethereum key
When I create the reflow key
When I create the schnorr key
When I create the bitcoin key
When I create the eddsa key
When I create the bbs key
When I create the pvss key

Then print the 'keyring'
`).then((r) => {
		keyring = JSON.stringify(JSON.parse(r.result), null, 2);
	});
</script>

<ion-card>
	<ion-card-header>
		<ion-card-subtitle>Great success!!! 🎉</ion-card-subtitle>
		<ion-card-title>Welcome to Walletamous 🪪</ion-card-title>
	</ion-card-header>

	<ion-item>
		<ion-card-content>
			<pre>{keyring}</pre>
		</ion-card-content>
	</ion-item>

	<ion-item>
		<ion-label>Visit Ionic component docs</ion-label>
		<ion-button href="https://ionicframework.com/docs/components" target="_new" fill="outline" slot="end"
			>View</ion-button
		>
	</ion-item>
	<ion-item>
		<ion-label>Visit Svelte Kit docs</ion-label>
		<ion-button href="https://kit.svelte.dev/docs/introduction" target="_new" fill="outline" slot="end">View</ion-button
		>
	</ion-item>
	<ion-item>
		<ion-label>Visit Svelte docs</ion-label>
		<ion-button href="https://svelte.dev/docs" target="_new" fill="outline" slot="end">View</ion-button>
	</ion-item>
</ion-card>
