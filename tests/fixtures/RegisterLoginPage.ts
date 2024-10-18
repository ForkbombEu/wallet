import type { Page } from '@playwright/test';

export class RegisterLoginPage {
	constructor(private page: Page) {}

	async navigate() {
		await this.page.goto('/register-login');
	}

	async clickCreateAccount() {
		await this.page.getByRole('link', { name: 'Create an account' }).click();
	}

	async clickLogin() {
		await this.page.getByRole('link', { name: 'Login' }).click();
	}
}
