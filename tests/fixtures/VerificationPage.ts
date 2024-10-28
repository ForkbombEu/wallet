import { FeedbackComponent } from './components/FeedbackComponent';
import type { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { ScanQrButton } from './components/ScanQrButton';

export class VerificationPage extends BasePage {
	path = '/en/verification';
	pageTitle = 'Verification';
	scanQrButton: ScanQrButton;
	feedbackComponent: FeedbackComponent;

	constructor(page: Page) {
		super(page);
		this.scanQrButton = new ScanQrButton(page);
		this.feedbackComponent = new FeedbackComponent(page);
	}

	async verify(): Promise<void> {
		await this.clickButtonByName('Choose credentials');
	}

	async decline(): Promise<void> {
		await this.clickButtonByName('Decline');
	}

	async scanQr(Qr: string) {
		await this.scanQrButton.scanQr(Qr);
	}

	async expectVerificationDetailsVisible(details: string[] = []): Promise<void> {
		await this.expectText('About this verifications:');
		await this.expectText('Confirm data to be presented:');
		for (let i = 0; i < details.length; i++) {
			await this.expectText(details[i]);
		}
	}

	async expectErrorForNoCredentials(): Promise<void> {
		await this.feedbackComponent.verifyFeedback({
			feedback: 'Verification failed',
			message: 'No credentials'
		});
	}

	async expectVerificationError(): Promise<void> {
		await this.feedbackComponent.verifyFeedback({
			feedback: 'Verification failed',
			message: 'The QR code is expired'
		});
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
