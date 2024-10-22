// WalletPage.ts
import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class WalletPage extends BasePage {
	path = '/en/wallet';
	pageTitle = 'WALLET';

	private readonly credentialsHeading: Locator;
	private readonly credentialsDescription: Locator;
	private readonly emptyStateHeading: Locator;
	private readonly emptyStateDescription: Locator;
	private readonly getCredentialsButton: Locator;
	private readonly credentialCard: Locator;
	private readonly credentialLink: Locator;

	constructor(page: Page) {
		super(page);
		this.credentialsHeading = page.getByText('My credentials').first();
		this.credentialsDescription = page.locator('d-text p');
		this.emptyStateHeading = page.locator(
			'd-heading:has-text("There is no Credential in your wallet")'
		);
		this.emptyStateDescription = page.locator('d-text:has-text("Get your first credential")');
		this.getCredentialsButton = page.locator('d-button:has-text("GET CREDENTIALS")');
		this.credentialCard = page.locator('d-credential-card');
		this.credentialLink = page.locator('button[class*="relative"]').first();
	}

	async isPageVisible(): Promise<void> {
		await this.expectVisible((this.page.getByText(this.pageTitle).first()));
	}

	async verifyCredentialsHeadingAndDescription() {
		await this.expectVisible(this.credentialsHeading);
		await expect(this.credentialsDescription).toContainText('Explore and manage your credentials');
	}

	async verifyEmptyState() {
		await this.expectVisible(this.emptyStateHeading);
		await this.expectVisible(this.emptyStateDescription);
		await this.expectVisible(this.getCredentialsButton);
	}

	async verifyCredentialsVisible() {
		await this.expectVisible(this.credentialCard.first());
	}

	async clickFirstCredential() {
		await this.credentialLink.click();
		await this.waitForUrlContains(/\/credential-detail$/);
	}
}
