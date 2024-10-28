import { expect, type Locator, type Page } from '@playwright/test';

export class ScanQrButton {
	private readonly page: Page;
	private readonly button: Locator;
	private readonly submit: Locator;
	private readonly textbox: Locator;

	constructor(page: Page) {
		this.page = page;
		this.button = this.page.getByRole('link', { name: 'SCAN QR' });
		this.submit = this.page.getByRole('button', { name: 'SUBMIT' });
		this.textbox = this.page.getByRole('textbox');
	}

	async isVisible(): Promise<void> {
		await expect(this.button).toBeVisible();
	}

	async isNotVisible(): Promise<void> {
		await expect(this.button).not.toBeVisible();
	}

	async scanQr(Qr: string): Promise<void> {
		// await tabBarClick('Home', this.page);
		await this.button.click();
		await expect(this.page).toHaveURL('/en/scan');
		await this.textbox.fill(Qr);
		await this.submit.click();
	}

	async click() {
		await this.button.click();
	}
}
