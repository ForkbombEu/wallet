<script lang="ts">
	import TabPage from '$lib/tabs/TabPage.svelte';
	import { faker } from '@faker-js/faker';
	import {
		PushNotifications,
		type DeliveredNotifications,
		type PushNotificationSchema
	} from '@capacitor/push-notifications';

	let incomingNotification: PushNotificationSchema;
	let notificationsList: DeliveredNotifications;

	const addListeners = async () => {
		await PushNotifications.addListener('pushNotificationReceived', (notification) => {
			incomingNotification = notification;
			console.log('Push notification received: ', notification);
		});

		await PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
			console.log(
				'Push notification action performed',
				notification.actionId,
				notification.inputValue
			);
		});
	};

	const registerNotifications = async () => {
		let permStatus = await PushNotifications.checkPermissions();

		if (permStatus.receive === 'prompt') {
			permStatus = await PushNotifications.requestPermissions();
		}

		if (permStatus.receive !== 'granted') {
			throw new Error('User denied permissions!');
		}

		await PushNotifications.register();
	};

	const getDeliveredNotifications = async () => {
		const notificationList = await PushNotifications.getDeliveredNotifications();
		console.log('delivered notifications', notificationList);
	};

	registerNotifications();
	addListeners();
	$: getDeliveredNotifications();
</script>

<TabPage tab="notifications" title="NOTIFICATIONS">
	<ion-list>
		<ion-list-header>Recent Conversations</ion-list-header>
		{#each Array(10) as _}
			<ion-item>
				<ion-avatar slot="start">
					<img alt="avatar" src={`https://i.pravatar.cc/40?u=${faker.person.firstName()}`} />
				</ion-avatar>

				<ion-label>
					<h2>{faker.person.fullName()}</h2>

					<h3>{faker.lorem.sentence()}</h3>

					<p>{faker.lorem.paragraph()}</p>
				</ion-label>
			</ion-item>
		{/each}
	</ion-list>

	{#if incomingNotification}
		<pre>
				{JSON.stringify(incomingNotification, null, 2)}
			</pre>
	{/if}
	{#if notificationsList}
		<pre>
				{JSON.stringify(notificationsList, null, 2)}
			</pre>
	{/if}
</TabPage>
