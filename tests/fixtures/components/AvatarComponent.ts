import { expect, type Locator, type Page } from '@playwright/test';
import { BaseComponent } from '../BaseComponent';

export class AvatarComponent extends BaseComponent {
	static componentLocator = 'd-avatar';

	private readonly avatar: Locator;
	private readonly name: Locator;

	constructor(page: Page) {
		super(page, AvatarComponent.componentLocator);
		this.avatar = this.locate('img');
		this.name = this.locate('d-heading');
	}

	async hasAvatar(): Promise<void> {
		await expect(this.avatar).toBeVisible();
	}

	async hasName(name: string | RegExp): Promise<void> {
		await expect(this.name).toHaveText(name);
	}
}
