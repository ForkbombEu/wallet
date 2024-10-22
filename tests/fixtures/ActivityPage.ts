import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { tabBarClick } from '../utils';

export class ActivityPage extends BasePage {
	path = '/en/activity';
	pageTitle = 'Activity';

	private readonly noActivityHeading: Locator;
	private readonly noActivityMessage: Locator;
	private readonly activityCard: Locator;
	private readonly clearAllButton: string;
	private readonly removeButton: string;
	private readonly showMeButton: string;

	constructor(page: Page) {
		super(page);
		this.noActivityHeading = page.locator('d-heading:has-text("No activity yet")');
		this.noActivityMessage = page.locator(
			'd-text:has-text("Get alerts on new activities and keep your account up-to-date.")'
		);
		this.activityCard = page.locator('d-activity-card');
		this.clearAllButton = 'clear all';
		this.removeButton = 'remove';
		this.showMeButton = 'show me!';
	}

	async navigate(): Promise<void> {
		await tabBarClick('Activity', this.page);
	}

	async verifyNoActivitieHeading() {
		await this.expectVisible(this.noActivityHeading);
	}

	async verifyNoActivityMessage() {
		await this.expectVisible(this.noActivityMessage);
	}

	async verifyActivitiesPresent() {
		await this.expectVisible(this.activityCard.first());
	}

	async verifyClearAllButtonVisible() {
		await this.page.getByRole('button', { name: this.clearAllButton }).isVisible();
	}

	async verifyHowManyActivitiesPresent(howMany: number) {
		await expect(this.activityCard).toHaveCount(howMany);
	}

	async verifyHasInfoLedOnTab() {
		const activityTabButton = this.page.locator('#activity-tab-button');
		await activityTabButton
			.locator(
				'.h-[-5px].w-[5px].shrink-0.rounded-full.border.border-solid.bg-warning.border-warning'
			)
			.isVisible();
	}

	async verifyInfoLedNotPresent() {
		const activityTabButton = this.page.locator('#activity-tab-button');
		await expect(
			activityTabButton.locator(
				'.h-[-5px].w-[5px].shrink-0.rounded-full.border.border-solid.bg-warning.border-warning'
			)
		).not.toBeVisible();
	}

	async removeFirstActivity() {
		await this.clickButtonByName(this.removeButton, true);
	}

	async clearAllActivities() {
		await this.clickButtonByName(this.clearAllButton);
		await expect(this.page.locator('.itens-start')).not.toBeVisible();
	}

	async clickShowMeButton() {
		await this.clickButtonByName(this.showMeButton, true);
		await this.waitForUrlContains(/\/credential-detail$/);
	}
}
