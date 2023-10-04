<script lang="ts">
	import { camera } from 'ionicons/icons';

	import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
	import { Filesystem, Directory } from '@capacitor/filesystem';
	import { Preferences } from '@capacitor/preferences';
	import { Capacitor } from '@capacitor/core';

	const takePhoto = async () => {
		const take = await Camera.getPhoto({
			resultType: CameraResultType.Uri,
			source: CameraSource.Camera,
			quality: 100
		});
	};
</script>

<ion-tab tab="scanner">
	<ion-header translucent={true}>
		<ion-toolbar>
			<ion-buttons slot="start">
				<ion-menu-button />
			</ion-buttons>
			<ion-title>Camera</ion-title>
		</ion-toolbar>
	</ion-header>

	<ion-content fullscreen class="ion-padding">
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
