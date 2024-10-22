// SettingsPage.ts
import{ type Page, type Locator, expect } from '@playwright/test';

export class SettingsPage {
	private readonly page: Page;
	private readonly profileTabButton: Locator;
	private readonly settingsButton: Locator;
	private readonly menu: Locator;
	private readonly languagesButton: Locator;
	private readonly logoutButton: Locator;
	private readonly notificationsButton: Locator;
	private readonly appDetailsText: Locator;

	constructor(page: Page) {
		this.page = page;
		this.profileTabButton = page.locator('ion-tab-bar d-tab-button:has-text("Profile")');
		this.settingsButton = page.getByRole('banner').locator('ion-button');
		this.menu = page.locator('ion-menu');
		this.languagesButton = page.locator('d-button:has-text("Languages")');
		this.logoutButton = page.locator('d-button:has-text("Log Out")');
		this.notificationsButton = page.locator('d-button:has-text("Notifications settings")');
		this.appDetailsText = page.getByText('Developed by Forkbomb BV');
	}

	async openSettings() {
		await this.profileTabButton.click();
		await this.settingsButton.click();
		await expect(this.menu).toBeVisible();
	}

	async navigateToLanguageSettings() {
		await this.openSettings();
		await this.languagesButton.click();
		await expect(this.page).toHaveURL('/en/languages');
	}

	async logout() {
		await this.openSettings();
		await this.logoutButton.click();
		await expect(this.page).toHaveURL('/en/register-login');
	}

	async openNotificationSettings() {
		await this.openSettings();
		await this.notificationsButton.click();
		await expect(this.page.locator('ion-modal')).not.toBeVisible();
	}

	async verifyAppDetailsVisible() {
		await this.openSettings();
		await expect(this.appDetailsText).toBeVisible();
	}
}
