// tests/settings.spec.ts
import { test } from '@playwright/test';
import { login } from './utils';
import { SettingsPage } from './fixtures/SettingsPage';

test.describe('Settings', () => {
	let settingsPage: SettingsPage;
	test.beforeEach(async ({ page }) => {
		settingsPage = new SettingsPage(page);
		await login(page);
		settingsPage.openSettings();
	});

	// test('should open settings drawer', async ({ page }) => {
	// 	await settingsPage.openSettings();
	// });

	test('should navigate to language settings', async ({ page }) => {
		await settingsPage.navigateToLanguageSettings();
	});

	test('should logout from the app', async ({ page }) => {
		await settingsPage.logout();
	});

	test('should open app settings', async ({ page }) => {
		await settingsPage.openNotificationSettings();
	});

	test('should display app details component', async ({ page }) => {
		await settingsPage.verifyAppDetailsVisible();
	});
});
