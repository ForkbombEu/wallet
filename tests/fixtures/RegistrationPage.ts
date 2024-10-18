import { expect, type Page } from '@playwright/test';

export class RegistrationPage {
	constructor(private page: Page) {
        this.page = page;
    }

	async navigateToRegistration() {
		await this.page.goto('/login?registration=true');
	}

	async enterEmail(email: string) {
		await this.page.fill('input[name="email"]', email);
	}

	async acceptConditions() {
		await this.page.locator('#conditions').click({ position: { x: 0, y: 10 } });
	}

	async clickNext() {
		await this.page.getByRole('button', { name: 'Next' }).click();
	}

	async enterPasswords(password: string, confirmPassword: string) {
		await this.page.fill('input[name="password"]', password);
		await this.page.fill('input[name="confirmPassword"]', confirmPassword);
	}

	async checkPasswordMismatchError() {
		const errorMessage = await this.page.locator('text="Error: The passwords do not match"');
		await expect(errorMessage).toBeVisible();
	}

	async expectToBeOnPasswordPage() {
		await expect(this.page).toHaveURL('/en/login/insert-password');
	}

	async expectToBeOnQuestionsPage() {
		await expect(this.page).toHaveURL('/en/login/questions');
	}
}
