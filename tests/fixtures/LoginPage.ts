import { expect, type Locator, type Page } from '@playwright/test';
import { userEmail, userPassword } from '../utils';

export class LoginPage {
	private readonly page: Page;
	private readonly emailInput: Locator;
	private readonly passwordInput: Locator;
	private readonly nextButton: Locator;
	private readonly errorMessage: Locator;

	constructor(page: Page) {
		this.page = page;
		this.emailInput = page.locator('input[name="email"]');
		this.passwordInput = page.locator('input[name="password"]');
		this.nextButton = page.getByRole('button', { name: 'Next' });
		this.errorMessage = page.locator('text="wrong email or password"');
	}

    async navigate() {
        await this.page.goto('/en/login');
    }

    async loginWithInvalidCredentials() {
        await this.emailInput.fill('wrong@example.com')
        await this.passwordInput.fill('wrongPassword')
        await this.clickNext();
    }

    async verifyErrorMessages() {
        await this.checkLoginError();
    }


	async fillEmail() {
		await this.emailInput.fill(userEmail);
	}

	async fillPassword() {
		await this.passwordInput.fill(userPassword);
	}

    async loginWithCredentials() {
        await this.fillEmail();
        await this.fillPassword();
        await this.clickNext();
    }

	async clickNext() {
		await this.nextButton.click();
	}

	async checkLoginError() {
		await expect(this.errorMessage).toBeVisible();
	}

	async verifyNavigationToPassphrasePage() {
		await this.page.waitForURL('/en/login/passphrase');
	}
}
