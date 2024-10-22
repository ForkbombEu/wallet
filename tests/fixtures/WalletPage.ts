// WalletPage.ts
import { type Page, type Locator, expect } from '@playwright/test';

export class WalletPage {
	private readonly page: Page;
	private readonly walletHeading: Locator;
	private readonly credentialsHeading: Locator;
	private readonly credentialsDescription: Locator;
	private readonly emptyStateHeading: Locator;
	private readonly emptyStateDescription: Locator;
	private readonly getCredentialsButton: Locator;
	private readonly credentialCard: Locator;
	private readonly credentialLink: Locator;

	constructor(page: Page) {
		this.page = page;
		this.walletHeading = page.getByText('WALLET').first();
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

	async navigate() {
		await this.page.goto('/en/wallet');
	}

	async verifyWalletPage() {
		await expect(this.page).toHaveURL('/en/wallet');
		await expect(this.walletHeading).toBeVisible();
	}

	async verifyCredentialsHeadingAndDescription() {
		await expect(this.credentialsHeading).toBeVisible();
		await expect(this.credentialsDescription).toContainText('Explore and manage your credentials');
	}

	async verifyEmptyState() {
		await expect(this.emptyStateHeading).toBeVisible();
		await expect(this.emptyStateDescription).toBeVisible();
		await expect(this.getCredentialsButton).toBeVisible();
	}

	async verifyCredentialsVisible() {
		await expect(this.credentialCard.first()).toBeVisible();
	}

	async clickFirstCredential() {
		await this.credentialLink.click();
		await expect(this.page).toHaveURL(/\/credential-detail$/);
	}
}
