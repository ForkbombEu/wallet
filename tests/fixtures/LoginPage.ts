import { type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { userEmail, userPassword } from '../utils';
import { FormComponent } from './FormComponent';

export class LoginFormComponent extends FormComponent {
	async fillAndSubmit(data: { email?: string; password?: string }): Promise<void> {
		if (data.email) {
			await this.fillInputByName('email', data.email);
		}

		if (data.password) {
			await this.fillInputByName('password', data.password);
		}

		await this.submitForm('Next');
	}
}

export class LoginPage extends BasePage {
	path = '/en/login';
	pageTitle = 'LOGIN';

	private readonly errorMessage: string;
	private readonly form: LoginFormComponent;

	constructor(page: Page) {
		super(page);
		this.errorMessage = 'wrong email or password';
		this.form = new LoginFormComponent(page);
	}

	async loginWithInvalidCredentials() {
		await this.form.fillAndSubmit({ email: 'wrong@example.com', password: 'wrongPassword' });
	}

	async verifyErrorMessages() {
		await this.form.checkErrorMessage(this.errorMessage);
	}

	async loginWithCredentials() {
		await this.form.fillAndSubmit({ email: userEmail, password: userPassword });
	}

	async verifyNavigationToPassphrasePage() {
		await this.page.waitForURL('/en/login/passphrase');
	}
}
