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
		// await this.page.locator(`text="${text}"`).textContent();
		await expect(this.page.locator(`text="${text}"`)).toBeVisible();
	}
	async hasNoAccessibilityIssues(): Promise<void> {
		//@ts-ignore
		const results = await new AxeBuilder({ page: this.page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
			.disableRules(['meta-viewport'])
			.analyze();

		const resultsFormatted = results.violations.map((violation) => ({
			rule: violation.id,
			targets: violation.nodes.map((node) => node.target),
			message: violation.description,
			impact: violation.impact
		}));
		// expect(resultsFormatted).toEqual([]);

		if (resultsFormatted.length > 0) {
			console.log('====================================');
			console.warn(`Page: ${this.page.url()}`);
			console.warn(`Accessibility issues found: ${resultsFormatted.length}`);
			resultsFormatted.forEach((result, index) => {
				console.log(`Issue ${index + 1}:`);
				console.warn(`    Rule: ${result.rule}`);
				console.warn(`    Message: ${result.message}`);
				console.warn(`    Impact: ${result.impact}`);
				console.warn(`    Targets: ${result.targets.join(', ')}`);
				console.log('------------------------------------');
			});
			console.log('====================================');
		}
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
