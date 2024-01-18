<script lang="ts">
	import { camera, key } from 'ionicons/icons';

	import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
	import { getStructuredPreferences } from '$lib/preferences/prefereces';
	import type { Keypair } from '$lib/keypairoom';

	const getKeypair = getStructuredPreferences<Keypair>('keyring', true);
</script>

<ion-tab tab="profile">
	<ion-header translucent={true}>
		<ion-toolbar>
			<ion-buttons slot="start">
				<ion-menu-button />
			</ion-buttons>
			<ion-title>Camera</ion-title>
		</ion-toolbar>
	</ion-header>
	<!-- <div slot="title">Profile</div> -->
	<!-- <ion-content fullscreen class="ion-padding space-y-10"> -->

	<ion-content fullscreen class="ion-padding">
		{#await getKeypair}
			Loading profile..
		{:then keypair}
			<pre>{JSON.stringify(keypair, null, 2)}</pre>
		{:catch someError}
			System error: {someError.message}.
		{/await}
	</ion-content>

	<ion-button href="/r/logout">Logout</ion-button>
</ion-tab>
