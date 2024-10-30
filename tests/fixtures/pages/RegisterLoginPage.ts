import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class RegisterLoginPage extends BasePage {
	path = '/register-login';
	pageTitle = 'REGISTER OR LOGIN';

	constructor(page: Page) {
		super(page);
	}

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
