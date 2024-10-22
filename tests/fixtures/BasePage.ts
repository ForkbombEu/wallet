import { expect, type Locator, type Page } from '@playwright/test';

export abstract class BasePage {
	protected readonly page: Page;

	abstract path: string;
	abstract pageTitle: string;

	constructor(page: Page) {
		this.page = page;
	}

	async navigate(): Promise<void> {
		await this.page.goto(this.path);
	}

	async isPageVisible(): Promise<void> {
		await expect(this.page.getByText(this.pageTitle)).toBeVisible();
	}

	async expectVisible(locator: Locator): Promise<void> {
		await expect(locator).toBeVisible();
	}

	async clickButtonByName(name: string): Promise<void> {
		await this.page.getByRole('button', { name }).click();
	}

	async waitForUrlContains(partialUrl: string | RegExp): Promise<void> {
		await this.page.waitForURL(partialUrl);
	}
}
