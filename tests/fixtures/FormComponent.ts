import { expect, type Page } from '@playwright/test';

export class FormComponent {
	protected readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async fillInputByName(fieldName: string, value: string): Promise<void> {
		await this.page.fill(`input[name="${fieldName}"]`, value);
	}

	async getInputValue(fieldName: string): Promise<string> {
		return await this.page.inputValue(`input[name="${fieldName}"]`);
	}

	async checkErrorMessage(errorText: string): Promise<void> {
		const errorMessage = await this.page.locator(`text="${errorText}"`);
		await expect(errorMessage).toBeVisible();
	}

	async clickCheckbox(selector: string): Promise<void> {
		await this.page.locator(selector).click({ position: { x: 0, y: 10 } });
	}

	async submitForm(buttonText: string): Promise<void> {
		await this.page.locator('d-button').getByRole('button', { name: buttonText }).click();
	}

	async expectRedirect(expectedUrl: string): Promise<void> {
		await expect(this.page).toHaveURL(expectedUrl);
	}

	// abstract fillAndSubmit<T extends Record<string, string | boolean>>(
	// 	data: Partial<T>
	// ): Promise<void>

	async fillAndSubmit<T extends string | boolean>(data: Partial<Record<string, T>>): Promise<void> {
		const dataArray = Object.keys(data);
		
		for (const key of dataArray) {
			if (typeof data[key] === 'string') {
				await this.fillInputByName(key, data[key] as string);
			} else if (data[key]) {
				await this.clickCheckbox(key);
			}
		}
		await this.submitForm('Next');
	}
}
