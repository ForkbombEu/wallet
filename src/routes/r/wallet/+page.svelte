<script lang="ts">
	import { generateKeyring } from '$lib/zencodes';
</script>

<ion-tab tab="wallet">
	<ion-header translucent={true}>
		<ion-toolbar>
			<ion-buttons slot="start">
				<ion-menu-button />
				<ion-back-button default-href="/services" />
			</ion-buttons>
			<ion-title>Wallet</ion-title>
		</ion-toolbar>
	</ion-header>

	<ion-content fullscreen class="ion-padding">
		{#await generateKeyring()}
			<p>...waiting</p>
		{:then keyring}
			<pre>{keyring}</pre>
		{:catch error}
			<p style="color: red">{error.message}</p>
		{/await}
	</ion-content>
</ion-tab>
