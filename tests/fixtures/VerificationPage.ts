import type { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class VerificationPage extends BasePage {
	path = '/en/verification';
	pageTitle = 'Verification';

	constructor(page: Page) {
		super(page);
	}
	async scanQR(verificationQR: string): Promise<void> {
		await this.page.getByRole('link', { name: 'SCAN QR' }).click();
		await this.waitForUrlContains('/en/scan');
		await this.page.getByRole('textbox').fill(verificationQR);
		await this.page.getByRole('button', { name: 'SUBMIT' }).click();
	}

	async verify(): Promise<void> {
		await this.clickButtonByName('VERIFY');
	}

	async decline(): Promise<void> {
		await this.clickButtonByName('DECLINE');
	}

	async expectVerificationDetailsVisible(details: string[] = []): Promise<void> {
		await this.expectText('Is asking for verification');
		await this.expectText('Confirm data to be disclosed');
		await this.expectText('Current given name');
		for (let i = 0; i < details.length; i++) {
			await this.expectText(details[i]);
		}
	}

	async expectErrorForNoCredentials(): Promise<void> {
		await this.expectText('no credentials');
	}

	async expectSessionCardVisible(): Promise<void> {
		await this.expectVisible(this.page.locator('d-session-card'));
	}

	async expectActivityVisible(): Promise<void> {
		await this.expectVisible(this.page.locator('.itens-start'));
	}

	async expectExpiredQRModalVisible(): Promise<void> {
		await this.expectVisible(this.page.locator('ion-modal'));
	}
}
