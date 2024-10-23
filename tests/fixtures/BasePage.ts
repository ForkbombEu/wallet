import { expect, type Locator, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

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
		await expect(this.page.getByText(this.pageTitle, { exact: true })).toBeVisible();
	}

	async expectVisible(locator: Locator): Promise<void> {
		await expect(locator).toBeVisible();
	}

	async expectText(text: string): Promise<void> {
		await this.page.locator(`text="${text}"`).textContent();
		await expect(this.page.locator(`text="${text}"`)).toBeVisible();
	}
	async hasNoAccessibilityIssues(): Promise<void> {
		const results = await new AxeBuilder({ page: this.page }).analyze();
		expect(results.violations).toEqual([]);
	}

	async clickButtonByName(name: string, first?: boolean): Promise<void> {
		if (first) {
			await this.page.locator(`d-button:has-text("${name}")`).first().click();
			return;
		}
		await this.page.locator(`d-button:has-text("${name}")`).click();
	}

	async waitForUrlContains(partialUrl: string | RegExp): Promise<void> {
		await this.page.waitForURL(partialUrl);
	}
}
