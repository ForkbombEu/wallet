import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from '../BasePage';

export class SettingsPage extends BasePage {
	path = '/en/settings';
	pageTitle = 'SETTINGS';

	private readonly profileTabButton: Locator;
	private readonly settingsButton: Locator;
	private readonly menu: Locator;
	private readonly languagesButton: Locator;
	private readonly logoutButton: Locator;
	private readonly notificationsButton: Locator;
	private readonly supportButton: Locator;
	private readonly privacyPolicyButton: Locator;
	private readonly accountSettingsButton: Locator;
	private readonly appDetailsText: Locator;

	constructor(page: Page) {
		super(page);
		this.profileTabButton = page.locator('ion-tab-bar d-tab-button:has-text("Profile")');
		this.settingsButton = page.getByRole('banner').locator('ion-button');
		this.menu = page.locator('ion-menu');
		this.languagesButton = page.locator('d-button:has-text("Languages")');
		this.logoutButton = page.locator('d-button:has-text("Log Out")');
		this.supportButton = page.locator('d-button:has-text("Support")');
		this.privacyPolicyButton = page.locator('d-button:has-text("Privacy policy")');
		this.accountSettingsButton = page.locator('d-button:has-text("Account settings")');
		this.notificationsButton = page.locator('d-button:has-text("Notifications settings")');
		this.appDetailsText = page.getByText('Developed by Forkbomb BV');
	}

	async navigate() {
		await this.profileTabButton.click();
		await this.settingsButton.click();
		await expect(this.menu).toBeVisible();
	}

	async openLanguageSettings() {
		await this.languagesButton.click();
		await expect(this.page).toHaveURL('/en/languages');
	}

	async openUserSettings() {
		await this.accountSettingsButton.click();
		await expect(this.page).toHaveURL('/en/user-settings');
	}

	async openNotificationSettings() {
		await this.notificationsButton.click();
		await expect(this.page.locator('ion-modal')).not.toBeVisible();
	}

	async goToSupportPage() {
		await this.supportButton.click();
		await expect(this.page).toHaveURL('https://didroom.com/guides/support.html');
	}

	async goToPrivacyPolicy() {
		await this.privacyPolicyButton.click();
		await expect(this.page).toHaveURL(
			'https://didroom.com/guides/Terms-and-conditions/privacy-policy.html'
		);
	}

	async logout() {
		await this.logoutButton.click();
		await expect(this.page).toHaveURL('/en/register-login');
	}

	async verifyAppDetailsVisible() {
		await expect(this.appDetailsText).toBeVisible();
	}
}
