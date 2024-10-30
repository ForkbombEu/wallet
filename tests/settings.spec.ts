import { test } from './fixtures/testWithFixtures';
import { login } from './utils';

test.describe('Settings', () => {
	test.beforeEach(async ({ page, settingsPage }) => {
		await login(page);
		settingsPage.navigate();
	});

	test('should navigate to language settings', async ({ settingsPage }) => {
		await settingsPage.openLanguageSettings();
	});

	test('should logout from the app', async ({ settingsPage }) => {
		await settingsPage.logout();
	});

	test('should open app settings', async ({ settingsPage }) => {
		await settingsPage.openNotificationSettings();
	});

	test('should display app details component', async ({ settingsPage }) => {
		await settingsPage.verifyAppDetailsVisible();
	});

	test('should navigate to support page', async ({ settingsPage }) => {
		await settingsPage.goToSupportPage();
	});

	test('should navigate to privacy policy page', async ({ settingsPage }) => {
		await settingsPage.goToPrivacyPolicy();
	});

	test('should navigate to user settings page', async ({ settingsPage }) => {
		await settingsPage.openUserSettings();
	});
});
