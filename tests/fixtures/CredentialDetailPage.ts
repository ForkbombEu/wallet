import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { addCredentialsToLocalStorage, tabBarClick, userEmail } from '../utils';

export class CredentialDetailPage extends BasePage {
	path = '/en/1/credential-detail';
	pageTitle = 'Credential Detail';

	private readonly credentialName: string;
	private readonly credentialDescription: string =
		'Get a credential containing a Proof of Possession of your email. In order to get the credential, insert the user and password you use to login into your wallet or into https://dashboard.didroom.com. If you are not sure, write us at info@forkbomb.eu';

	private readonly credentialIssuer: string = '';
	private readonly credentialIssuerUrl: string =
		'@https://issuer1.zenswarm.forkbomb.eu/credential_issuer';
	private readonly claims: { key: string; value: string }[] = [{ key: 'email', value: userEmail }];
	private readonly closeButton: Locator;
	private readonly deleteButton: Locator;

	constructor(page: Page) {
		super(page);
		this.closeButton = this.page.locator('d-button:has-text("Close")');
		this.deleteButton = this.page.locator('d-button:has-text("Delete")');
        this.credentialName = 'Proof of humanity';
	}

	async verifyCredentialName() {
		await this.expectText(this.credentialName);
	}

	async verifyCredentialDescription() {
		await this.expectText(this.credentialDescription);
	}

	async verifyCredentialIssuer() {
		await this.expectText(this.credentialIssuer);
	}

	async verifyCredentialIssuerUrl() {
		await this.expectText(this.credentialIssuerUrl);
	}

	async verifyClaims() {
		for (const claim of this.claims) {
			await this.expectText(claim.key);
			await this.expectText(claim.value);
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
}
