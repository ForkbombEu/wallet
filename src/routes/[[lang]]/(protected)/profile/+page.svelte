<script lang="ts">
	import { m, goto } from '$lib/i18n';
	import { authFilesUri, filesUri } from '$lib/backendUri.js';
	import { scanButton } from '$lib/tabs';
	import { AndroidSettings, IOSSettings, NativeSettings } from 'capacitor-native-settings';
	import { version } from '$app/environment';
	import { getDebugMode, setDebugModeFalse, setDebugModeTrue } from '$lib/preferences/debug.js';
	import { Share } from '@capacitor/share';
	import { share as shareIcon } from 'ionicons/icons';
	import type { ToggleChangeEventDetail } from '@ionic/core';

	export let data;
	const { orgs, user, did } = data;

	let debugMode: boolean;
	const loadDebugMode = async () => {
		debugMode = await getDebugMode();
	};
	$: loadDebugMode();
	const setDebugMode = async (e: CustomEvent<ToggleChangeEventDetail<any>>) => {
		if (e.detail.checked) return await goto('/debug-activation');
		await setDebugModeFalse();
		await loadDebugMode();
	};

	const logoutCB = async () => {
		await goto('/logout');
	};

	const share = async () =>
		await Share.share({
			title: 'DIDroom wallet',
			text: m.This_is_a_really_cool_wallet_for_your_credentials(),
			url: 'https://didroom.com/apps',
			dialogTitle: m.Share_with_buddies()
		});

	const openAppSettings = async () => {
		await NativeSettings.open({
			optionAndroid: AndroidSettings.ApplicationDetails,
			optionIOS: IOSSettings.App
		});
	};

	const gotoLanguageSettings = () => goto('/languages');
	const gotoAccountSettings = () => goto('/user-settings');
</script>

<d-tab-page tab="profile" title={m.Profile()} {...scanButton} settings>
	<div class="flex h-full flex-col justify-between gap-24">
		<div class="flex flex-col items-center gap-2 pt-8 text-center">
			<d-avatar src={authFilesUri(user?.avatar, user?.id)} size="2xl"></d-avatar>
			<d-heading size="xs" class="w-full">{user?.name || user?.email}</d-heading>
			<d-did-box did={did?.result?.didDocument.id || did?.didDocument.id}></d-did-box>
		</div>
		<d-organizations heading={m.Badges()} empty={orgs.length == 0}>
			{#each orgs as org}
				<d-avatar
					src={filesUri(org.avatar, org.collectionId, org.id)}
					alt={org.name}
					size="xl"
					shape="square"
				/>
			{/each}
		</d-organizations>
	</div>
	<div slot="settings">
		<div class="flex flex-col justify-between">
			<div class="flex flex-col gap-4">
				<d-buttons-group>
					<d-button aria-hidden size="large" on:click={gotoAccountSettings}>
						{m.Account_Settings()}
						<d-icon icon="profile" slot="start" outline />
					</d-button>
					<d-button onClick={openAppSettings} aria-hidden size="large">
						{m.Notifications_settings()}
						<d-icon icon="notification" slot="start" outline />
					</d-button>
					<d-button onClick={gotoLanguageSettings} aria-hidden size="large">
						{m.Languages()}
						<d-icon icon="language" slot="start" outline />
					</d-button>
				</d-buttons-group>
				<d-buttons-group>
					<d-button on:click={share} aria-hidden size="large">
						{m.share_this_app()}
						<ion-icon icon={shareIcon} slot="start" />
					</d-button>
					<d-button href="https://didroom.com/guides/Orgadmin/support.html" size="large">
						{m.Support()}
						<d-icon icon="help" slot="start" outline />
					</d-button>
					<d-button
						href="https://didroom.com/guides/Terms-and-conditions/privacy-policy.html"
						size="large"
					>
						{m.Privacy_policy()}
						<d-icon icon="shield" slot="start" outline />
					</d-button>
					<d-button size="large">
						<ion-toggle checked={debugMode} label-placement="end" on:ionChange={setDebugMode}
							>{m.Debug_mode()}</ion-toggle
						>
					</d-button>
				</d-buttons-group>
				<d-buttons-group>
					<d-button onClick={logoutCB} aria-hidden size="large">
						{m.Log_Out()}
						<d-icon icon="logout" outline slot="start" />
					</d-button>
				</d-buttons-group>
			</div>
			<d-app-details developedBy={m.Developed_by_Forkbomb_BV()} {version} />
		</div>
	</div>
	<div class="pb-24" />
</d-tab-page>
