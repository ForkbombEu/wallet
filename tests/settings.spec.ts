// tests/settings.spec.ts
import { test } from '@playwright/test';
import { login } from './utils';
import { SettingsPage } from './fixtures/SettingsPage';

test.describe('Settings', () => {
	let settingsPage: SettingsPage;
	test.beforeEach(async ({ page }) => {
		settingsPage = new SettingsPage(page);
		await login(page);
		settingsPage.navigate();
	});

	test('should navigate to language settings', async () => {
		await settingsPage.openLanguageSettings();
	});

	test('should logout from the app', async () => {
		await settingsPage.logout();
	});

	test('should open app settings', async () => {
		await settingsPage.openNotificationSettings();
	});

	test('should display app details component', async () => {
		await settingsPage.verifyAppDetailsVisible();
	});

	test('should navigate to support page', async () => {
		await settingsPage.goToSupportPage();
	});

	test('should navigate to privacy policy page', async () => {
		await settingsPage.goToPrivacyPolicy();
	});

	test('should navigate to user settings page', async () => {
		await settingsPage.openUserSettings();
	});
});
