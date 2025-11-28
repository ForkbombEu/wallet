<script lang="ts">
	import { goto, m, r } from '$lib/i18n';
	import { AndroidBiometryStrength, BiometricAuth } from '@aparajita/capacitor-biometric-auth';
	// @ts-ignore
	import IonPage from 'ionic-svelte/components/IonPage.svelte';
	import { refreshAuth } from '../login/_lib/index.js';
	import { pendingDeepLink } from '$lib/pendingDeepLinkStore.js';
	import { gotoQrResult } from '$lib/components/organisms/scanner/tools';

	export let data;

	let error: string | undefined = undefined;

	async function unlock() {
		try {
			await authenticate();
			await refreshAuth();

			// manage deeplinks from qrcodes
			let urlValue: string | null = null;
			pendingDeepLink.subscribe((value) => {
				urlValue = value;
			})();
			pendingDeepLink.set(null); // clear
			if (urlValue) {
				return await gotoQrResult(urlValue);
			}

			if (!(r('/verification') === window.location.pathname)) {
				return await goto('/wallet');
			}
			return await goto('/verification');
		} catch (e) {
			error = 'BIOMETRY_ERROR';
		}
	}

	async function authenticate() {
		try {
			await BiometricAuth.authenticate({
				reason: m.Please_authenticate(),
				cancelTitle: m.Cancel(),
				allowDeviceCredential: true,
				iosFallbackTitle: m.Use_passcode(),
				androidTitle: m.Biometric_login(),
				androidSubtitle: m.Log_in_using_biometric_authentication(),
				androidConfirmationRequired: false,
				androidBiometryStrength: AndroidBiometryStrength.weak
			});
		} catch (e) {
			throw e;
		}
	}

	//

	async function unlockWithoutBiometry() {
		await refreshAuth();
		await goto('/home');
	}
</script>

<IonPage>
	<ion-content fullscreen>
		<div class="flex h-full w-full flex-col items-center justify-center gap-2 p-6">
			<d-logo />

			{#if data.biometryCheckResult.isAvailable}
				<div class="fixed bottom-4 w-full px-4">
					<d-button color="accent" on:click={unlock} on:keydown={unlock} aria-hidden expand="full"
						>{m.Open_Wallet()}</d-button
					>
				</div>
				{#if error}
					<div>
						<ion-text>{error}</ion-text>
					</div>
				{/if}
			{:else}
				<ion-text>{m.Biometry_not_available()}</ion-text>
				<div class="fixed bottom-4 w-full px-4 pb-24">
					<d-button
						color="accent"
						on:click={unlockWithoutBiometry}
						on:keydown={unlockWithoutBiometry}
						aria-hidden
						expand="full">{m.Open_Wallet()}</d-button
					>
				</div>
			{/if}
		</div>
	</ion-content>
</IonPage>
