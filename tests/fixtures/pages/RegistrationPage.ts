import { expect, type Page } from '@playwright/test';
import { BasePage } from '../BasePage';
import { FormComponent } from '../components/FormComponent';
import { randomEmail } from '../../utils';

export class RegistrationFormComponent extends FormComponent {
	async fillAndSubmit(
		data: Partial<{
			email: string;
			conditionsAccepted: boolean;
			password: string;
			confirmPassword: string;
		}>
	): Promise<void> {
		if (data.email) {
			await this.fillInputByName('email', data.email as string);
		}

		if (data.conditionsAccepted) {
			await this.clickCheckbox('#conditions');
		}

		await this.submitForm('Next');

		if (data.password) {
			await this.fillInputByName('password', data.password as string);
		}

		if (data.confirmPassword) {
			await this.fillInputByName('confirmPassword', data.confirmPassword as string);
		}

		await this.submitForm('Next');
	}
}

export class RegistrationPage extends BasePage {
	path = '/login?registration=true';
	pageTitle = 'Enter your email';

	private readonly form: RegistrationFormComponent;

	constructor(page: Page) {
		super(page);
		this.form = new RegistrationFormComponent(page);
	}

	async registerUser(
		data: {
			email?: string;
			password?: string;
			confirmPassword?: string;
			conditionsAccepted: boolean;
		} = {
			email: randomEmail(),
			password: 'password123',
			confirmPassword: 'password123',
			conditionsAccepted: true
		}
	) {
		await this.form.fillAndSubmit(data);
	}

	async checkPasswordMismatchError() {
		const errorMessage = await this.page.locator('text="Error: The passwords do not match"');
		await expect(errorMessage).toBeVisible();
	}

	async expectToBeOnPasswordPage() {
		await expect(this.page).toHaveURL('/en/login/insert-password');
	}

	async expectToBeOnQuestionsPage() {
		await this.waitForUrlContains('/en/login/questions');
	}
}
