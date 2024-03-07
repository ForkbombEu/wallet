import {
	PushNotifications,
	type ActionPerformed,
	type PushNotificationSchema,
    type Token,
    type RegistrationError
} from '@capacitor/push-notifications';

export const listenPushNotificationReceived = async (
	onPushNotificationReceived: (notificaton: PushNotificationSchema) => void
) => {
	await PushNotifications.addListener('pushNotificationReceived', (notification) => {
		onPushNotificationReceived(notification);
	});
};

export const listenPushNotificationActionPerformed = async (
	onPushNotificationActionPerformed: (notification: ActionPerformed) => void
) => {
	await PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
		onPushNotificationActionPerformed(notification); //
	});
};

export const listenRegistration = async (onRegistration: (token: Token) => void) => {
    await PushNotifications.addListener('registration', (token) => {
        onRegistration(token);
    });
}

export const listenRegistrationError = async (onRegistrationError: (error: RegistrationError) => void) => {
    await PushNotifications.addListener('registrationError', (error) => {
        onRegistrationError(error);
    });
}

export const stopListen = () => PushNotifications.removeAllListeners();

export const registerNotifications = async () => {
	let permStatus = await PushNotifications.checkPermissions();

	if (permStatus.receive === 'prompt') {
		permStatus = await PushNotifications.requestPermissions();
	}

	if (permStatus.receive !== 'granted') {
		throw new Error('User denied permissions!');
	}

	await PushNotifications.register();
};

export const fetchDeliveredNotifications = async () => {
	return await PushNotifications.getDeliveredNotifications();
};