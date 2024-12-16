import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from '../BasePage';
import { addCredentialsToLocalStorage, tabBarClick } from '../../utils';

export class CredentialDetailPage extends BasePage {
	path = '/en/1/credential-detail';
	pageTitle = 'Credential detail';

	private readonly credentialName: string;
	private readonly credentialDescription: string = '';
	private readonly credentialIssuer: string = 'test ci';
	private readonly credentialIssuerUrl: string = '@https://ci.test.didroom.com/credential_issuer';
	private readonly claims: { key: string; value: string }[] = [
		{ key: 'has_discount_from_voucher', value: '10' }
	];
	private readonly closeButton: Locator;
	private readonly deleteButton: Locator;

	constructor(page: Page) {
		super(page);
		this.closeButton = this.page.locator('ion-tabs d-button').filter({ hasText: 'Close' });
		this.deleteButton = this.page.locator('d-button:has-text("Delete")');
		this.credentialName = 'Voucher test';
	}

	async verifyCredentialName() {
		await expect(this.page.getByText(this.credentialName).first()).toBeVisible();
	}

	async verifyCredentialDescription() {
		await this.expectText(this.credentialDescription);
	}

	async verifyCredentialIssuer() {
		// await this.expectText(this.credentialIssuer);
		await expect(this.page.locator(`text=${this.credentialIssuer}`)).toBeTruthy();
	}

	async verifyCredentialIssuerUrl() {
		await this.expectText(this.credentialIssuerUrl);
	}

	async verifyClaims() {
		for (const claim of this.claims) {
			// await this.expectText(claim.key);
			// await this.expectText(claim.value);
			await expect(this.page.locator(`dt:has-text('${claim.key}')`)).toBeVisible();
			await expect(this.page.locator(`dd:has-text('${claim.value}')`)).toBeVisible();
		}
	}

	async addCredentials() {
		await addCredentialsToLocalStorage(this.page);
		await tabBarClick('Home', this.page);
		await tabBarClick('Wallet', this.page);
	}

	async closeCredentialDetail() {
		await this.closeButton.click();
	}

	async deleteCredential() {
		await this.deleteButton.click();
	}

	async verifyDeleteModal() {
		await expect(this.page.locator('ion-modal')).toBeVisible();
	}

	async cancelDelete() {
		await this.page.locator('d-button:has-text("Cancel")').click();
	}

	async verifyDeleteModalHidden() {
		await expect(this.page.locator('ion-modal')).toBeHidden();
	}

	async confirmDelete() {
		await this.page.locator('d-button:has-text("Continue")').click();
	}
}
