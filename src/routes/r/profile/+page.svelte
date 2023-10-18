<script lang="ts">
	import { camera, key } from 'ionicons/icons';

	import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
	import { getStructuredPreferences } from '$lib/preferences/prefereces';
	import type { Keypair } from '$lib/keypairoom/keypair';

	const takePhoto = async () => {
		const take = await Camera.getPhoto({
			resultType: CameraResultType.Uri,
			source: CameraSource.Camera,
			quality: 100
		});
	};
	const getKeypair = getStructuredPreferences<Keypair>('keyring');
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

	<ion-content fullscreen class="ion-padding">
		{#await getKeypair}
			Loading profile..
		{:then keypair}
			<pre>{JSON.stringify(keypair, null, 2)}</pre>
		{:catch someError}
			System error: {someError.message}.
		{/await}
		<ion-fab vertical="bottom" horizontal="center" slot="fixed">
			<ion-fab-button
				role="button"
				tabindex="0"
				on:click={() => takePhoto()}
				on:keypress={(e) => {
					if (e.key === 'Enter') takePhoto();
				}}
			>
				<ion-icon icon={camera} />
			</ion-fab-button>
		</ion-fab>
	</ion-content>
</ion-tab>
