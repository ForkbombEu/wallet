import { expect, type Locator, type Page } from '@playwright/test';
import { tabBarClick } from '../utils';

export class ScanQrButton {
	private readonly page: Page;
	private readonly button: Locator;
	private readonly submit: Locator;
	private readonly textbox: Locator;

	constructor(page: Page) {
		this.page = page;
		this.button = this.page.getByRole('link', { name: 'SCAN QR' });
		// this.button = this.page.locator('d-button:has-text("Scan QR")');
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
		await expect(this.page).toHaveURL('/en/credential-offer');
	}

	async click() {
		await this.button.click();
	}
}
