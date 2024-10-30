import { expect, type Locator, type Page } from '@playwright/test';
import { BaseComponent } from '../BaseComponent';

export class ScanQrButton extends BaseComponent {
	static componentLocator = 'role=link[name="SCAN QR"]';

	private readonly submit: Locator;
	private readonly textbox: Locator;

	constructor(page: Page) {
		super(page, ScanQrButton.componentLocator);
		this.submit = this.page.getByRole('button', { name: 'SUBMIT' });
		this.textbox = this.page.getByRole('textbox');
	}

	async scanQr(Qr: string): Promise<void> {
		await this.component.click();
		await expect(this.page).toHaveURL('/en/scan');
		await this.textbox.fill(Qr);
		await this.submit.click();
	}

	async click(): Promise<void> {
		await this.component.click();
	}
}
