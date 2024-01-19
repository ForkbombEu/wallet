<script>
	import BackButton from '$lib/ionic/backButton.svelte';
	import { IonPage } from 'ionic-svelte';
</script>

<IonPage>
	<ion-header>
		<ion-toolbar>
			<ion-buttons slot="start">
				<BackButton href="/login" />
			</ion-buttons>
		</ion-toolbar>
	</ion-header>

	<ion-content fullscreen class="ion-padding">
		<slot />
	</ion-content>
</IonPage>
