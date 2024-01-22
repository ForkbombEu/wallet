<script lang="ts">
	import { goto } from '$app/navigation';
	import { setLockedPreference, unlockApp } from '$lib/preferences/locked.js';
	import { BiometricAuth, AndroidBiometryStrength } from '@aparajita/capacitor-biometric-auth';
	// @ts-ignore
	import IonPage from 'ionic-svelte/components/IonPage.svelte';

	export let data;

	let error: string | undefined = undefined;

	async function unlock() {
		try {
			await authenticate();
			await unlockApp();
			await goto('/wallet');
		} catch (e) {
			error = 'BIOMETRY_ERROR';
		}
	}

	async function authenticate() {
		try {
			await BiometricAuth.authenticate({
				reason: 'Please authenticate',
				cancelTitle: 'Cancel',
				allowDeviceCredential: true,
				iosFallbackTitle: 'Use passcode',
				androidTitle: 'Biometric login',
				androidSubtitle: 'Log in using biometric authentication',
				androidConfirmationRequired: false,
				androidBiometryStrength: AndroidBiometryStrength.weak
			});
		} catch (e) {
			throw e;
		}
	}
</script>

<IonPage>
	<ion-content>
		<div class="flex h-full w-full flex-col items-center justify-center">
			{#if data.biometryCheckResult.isAvailable}
				<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
				<ion-button on:click={unlock} expand="full">Unlock!</ion-button>
				{#if error}
					<div>
						<ion-text>{error}</ion-text>
					</div>
				{/if}
			{:else}
				<ion-text>Biometry not available!</ion-text>
			{/if}
		</div>
	</ion-content>
</IonPage>
