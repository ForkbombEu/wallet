import { expect, type Page } from '@playwright/test';
import { userSeed } from '../utils';

export class PassphrasePage {
	constructor(private page: Page) {}

	async enterPassphrase(seed: string = userSeed) {
		await this.page.fill('input[name="seed"]', seed);
		await this.page.getByRole('button', { name: 'Login' }).first().click();
	}

	async checkErrorMessage(errorText: string) {
		const errorMessage = await this.page.locator(`text="${errorText}"`);
		await expect(errorMessage).toBeVisible();
	}

	async verifyKeyringAndDID() {
		const keyring = await this.page.evaluate(() =>
			localStorage.getItem('CapacitorStorage.keyring')
		);
		const did = await this.page.evaluate(() => localStorage.getItem('CapacitorStorage.did'));
		expect(keyring).not.toBeNull();
		expect(did).not.toBeNull();
	}
}
