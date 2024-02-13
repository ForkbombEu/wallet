<script>
	import { r } from '$lib/i18n';
	import BackButton from '$lib/ionic/backButton.svelte';
	// @ts-ignore
	import IonPage from 'ionic-svelte/components/IonPage.svelte';
</script>

<IonPage>
	<ion-header>
		<ion-toolbar>
			<ion-buttons slot="start">
				<BackButton href={r('/login')} />
			</ion-buttons>
		</ion-toolbar>
	</ion-header>

	<ion-content fullscreen class="ion-padding">
		<slot />
	</ion-content>
</IonPage>
