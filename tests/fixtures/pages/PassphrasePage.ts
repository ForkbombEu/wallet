import { expect, type Page } from '@playwright/test';
import { userSeed } from '../../utils';
import { BasePage } from '../BasePage';

export class PassphrasePage extends BasePage {
	path = '/en/login/passphrase';
	pageTitle = 'PASSPHRASE';

	constructor(page: Page) {
		super(page);
	}

	async enterPassphrase(seed: string = userSeed) {
		const seedInput = this.page.locator('input[name="seed"]');
		await seedInput.click({ clickCount: 3 });
		await seedInput.press('Backspace');
		await seedInput.fill(seed);
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
	async verifyPasswordSaved() {
		const password = await this.page.evaluate(() =>
			localStorage.getItem('CapacitorStorage.USER_PASSWORD')
		);
		expect(password).not.toBeNull();
	}
	async getAuthToken(): Promise<string | undefined> {
		const auth = await this.page.evaluate(() => localStorage.getItem('CapacitorStorage.pb_auth'));
		if (auth) {
			return JSON.parse(auth).token;
		}
		return undefined;
	}

	async setInvalidAuthToken() {
		const auth = await this.page.evaluate(() => localStorage.getItem('CapacitorStorage.pb_auth'));
		if (!auth) return;
		const authObj = JSON.parse(auth) as { token: string };
		const modifiedAuthObj = { ...authObj, token: 'invalid token' };

		await this.page.evaluate((obj) => {
			localStorage.setItem('CapacitorStorage.pb_auth', JSON.stringify(obj));
		}, modifiedAuthObj);
	}
}
