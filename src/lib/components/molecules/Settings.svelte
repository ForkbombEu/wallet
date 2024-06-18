<script lang="ts">
	import { goto, m } from '$lib/i18n';
	import { AndroidSettings, IOSSettings, NativeSettings } from 'capacitor-native-settings';
	import {
		globeOutline,
		helpCircleOutline,
		lockClosedOutline,
		logOutOutline,
		notificationsOutline,
		personOutline,
		shieldOutline
	} from 'ionicons/icons';

	const logout = async () => {
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

<div class="flex flex-col gap-4">
	<d-buttons-group>
		<d-button aria-hidden size="large" disabled>
			{m.Account_Settings()}
			<ion-icon icon={personOutline} slot="start" />
		</d-button>
		<d-button href="/" size="large" disabled>
			{m.Security_and_authentication()}
			<ion-icon icon={lockClosedOutline} slot="start" />
		</d-button>
		<d-button on:click={openAppSettings} on:keydown={openAppSettings} aria-hidden size="large">
			{m.Notifications_settings()}
			<ion-icon icon={notificationsOutline} slot="start" />
		</d-button>
		<d-button
			on:click={gotoLanguageSettings}
			on:keydown={gotoLanguageSettings}
			aria-hidden
			size="large"
		>
			{m.Languages()}
			<ion-icon icon={globeOutline} slot="start" />
		</d-button>
	</d-buttons-group>
	<d-buttons-group>
		<d-button href="https://didroom.com/guides/1_orgadmin/support.html" size="large">
			{m.Support()}
			<ion-icon icon={helpCircleOutline} slot="start" />
		</d-button>
		<d-button href="https://didroom.com/guides/2_wallet/5_privacy-policy.html" size="large">
			{m.Privacy_policy()}
			<ion-icon icon={shieldOutline} slot="start" />
		</d-button>
	</d-buttons-group>
	<d-buttons-group>
		<d-button on:click={logout} on:keydown={logout} aria-hidden size="large">
			{m.Log_Out()}
			<ion-icon icon={logOutOutline} slot="start" />
		</d-button>
	</d-buttons-group>
</div>
