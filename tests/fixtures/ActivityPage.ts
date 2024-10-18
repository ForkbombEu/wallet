import { type Page, type Locator, expect } from '@playwright/test';

export class ActivityPage {
	private readonly page: Page;
	private readonly activityTab: Locator;
	private readonly activityHeading: Locator;
	private readonly noActivityHeading: Locator;
	private readonly noActivityMessage: Locator;
	private readonly activityCard: Locator;
	private readonly clearAllButton: Locator;
	private readonly removeButton: Locator;
	private readonly showMeButton: Locator;

	constructor(page: Page) {
		this.page = page;
		this.activityTab = page.locator('text=Activity');
		this.activityHeading = page.getByText('ACTIVITY').first();
		this.noActivityHeading = page.locator('d-heading:has-text("No activity yet")');
		this.noActivityMessage = page.locator(
			'd-text:has-text("Get alerts on new activities and keep your account up-to-date.")'
		);
		this.activityCard = page.locator('d-activity-card');
		this.clearAllButton = page.locator('d-button:has-text("clear all")');
		this.removeButton = page.locator('d-button:has-text("remove")').first();
		this.showMeButton = page.locator('d-button:has-text("show me!")').first();
	}

	async navigateToActivityTab() {
		await this.activityTab.click();
	}

	async verifyActivityPageLoaded() {
		await expect(this.page).toHaveURL('/en/activity');
		await expect(this.activityHeading).toBeVisible();
	}

	async verifyNoActivitiesMessage() {
		await expect(this.noActivityHeading).toBeVisible();
	}

	async verifyActivitiesPresent() {
		await expect(this.activityCard.first()).toBeVisible();
	}

	async verifyClearAllButtonVisible() {
		await expect(this.clearAllButton).toBeVisible();
	}
	async verifyHowManyActivitiesPresent(howMany: number) {
		await expect(this.activityCard).toHaveCount(howMany);
	}

	async removeFirstActivity() {
		await this.removeButton.click();
	}

	async clearAllActivities() {
		await this.clearAllButton.click();
		await expect(this.page.locator('.itens-start')).not.toBeVisible();
	}

	async clickShowMeButton() {
		await this.showMeButton.click();
		await expect(this.page).toHaveURL(/\/credential-detail$/);
	}
}
