<script lang="ts">
	import { m, goto } from '$lib/i18n';
	import { authFilesUri, filesUri } from '$lib/backendUri.js';
	import { scanButton } from '$lib/tabs';
	export let data;
	const { orgs, user, did } = data;
	import { AndroidSettings, IOSSettings, NativeSettings } from 'capacitor-native-settings';
	import { version } from '$app/environment';

	const logoutCB = async () => {
		await goto('/logout');
	};

	const openAppSettings = async () => {
		await NativeSettings.open({
			optionAndroid: AndroidSettings.ApplicationDetails,
			optionIOS: IOSSettings.App
		});
	};

	const gotoLanguageSettings = () => goto('/languages');
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
		<d-settings-menu
			accountSettings={m.Account_Settings()}
			securityAndAuthentication={m.Security_and_authentication()}
			notificationsSettings={m.Notifications_settings()}
			languages={m.Languages()}
			support={m.Support()}
			privacyPolicy={m.Privacy_policy()}
			logOut={m.Log_Out()}
			{version}
			developedBy={m.Developed_by_Forkbomb_BV()}
			{logoutCB}
			{gotoLanguageSettings}
			{openAppSettings}
		/>
	</div>
	<div class="pb-24" />
</d-tab-page>
