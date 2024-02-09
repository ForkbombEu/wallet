<script lang="ts">
	import {
		fetchDeliveredNotifications,
		listenPushNotificationActionPerformed,
		registerNotifications,

		stopListen

	} from '$lib/notifications';
	import TabPage from '$lib/tabs/TabPage.svelte';
	import { type ActionPerformed, type PushNotificationSchema } from '@capacitor/push-notifications';
	import { onDestroy, onMount } from 'svelte';

	// let incomingNotification: PushNotificationSchema;
	let action: ActionPerformed;
	let notificationsListPromise = fetchDeliveredNotifications();

	onMount(async () => {
		await registerNotifications();
		listenPushNotificationActionPerformed((a) => {
			action = a;
			notificationsListPromise = fetchDeliveredNotifications();
		});
	});

	onDestroy(async () => {
		await stopListen()
	});

	
</script>

<TabPage tab="notifications" title="NOTIFICATIONS">
	<ion-list>
		<ion-list-header>Recent Conversations</ion-list-header>
		{#await notificationsListPromise}
			<ion-item>
				<ion-label>
					<h2>Loading...</h2>
				</ion-label>
			</ion-item>
		{:then notificationsList}
			{#each notificationsList.notifications as n}
			<ion-item>
				<!-- <ion-avatar slot="start">
					<img alt="avatar" src={n.data.img} />
				</ion-avatar> -->
				<d-avatar text={n.title} />

				<ion-label>
					<h2>{n.title}</h2>
					<h3>{n.body}</h3>
				</ion-label>
			</ion-item>
		{/each}
		{:catch error}
			<ion-item>
				<ion-label>
					<h2>Error: {error.message}</h2>
				</ion-label>
			</ion-item>
		{/await}
	</ion-list>
</TabPage>
