<script>
	import Header from '$lib/components/molecules/Header.svelte';
import { m } from '$lib/i18n';
	import BackButton from '$lib/ionic/backButton.svelte';
	// @ts-ignore
	import IonPage from 'ionic-svelte/components/IonPage.svelte';
</script>

<IonPage>
	<Header>{m.Login()}</Header>

	<ion-content fullscreen class="ion-padding">
		<slot />
	</ion-content>
</IonPage>
