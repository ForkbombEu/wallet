import { expect, type Locator, type Page } from '@playwright/test';

export abstract class BaseComponent {
	protected readonly page: Page;
	component: Locator;
	protected static componentLocator: string;

	constructor(page: Page, componentLocator: string) {
		this.page = page;
		this.component = this.page.locator(componentLocator);
	}

	protected locate(selector: string): Locator {
		return this.component.locator(selector);
	}

	async isVisible(): Promise<void> {
		await expect(this.component).toBeVisible();
	}

	async isNotVisible(): Promise<void> {
		await expect(this.component).not.toBeVisible();
	}

	async clickByText(text: string): Promise<void> {
		await this.component.locator(`text=${text}`).click();
	}
}

export function pickOneComponent<T extends BaseComponent>(
	ComponentClass: new (page: Page) => T,
	page: Page,
	options?: { nth?: number }
): T {
	const instance = new ComponentClass(page);
	if (options?.nth !== undefined) {
		instance.component = instance.component.nth(options.nth);
	} else {
		instance.component = instance.component.first();
	}
	return instance;
}
