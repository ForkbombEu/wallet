import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { userEmail } from '../utils';

export class ProfilePage extends BasePage {
	path = '/en/profile';
	pageTitle = 'Profile';
    did: string

    private readonly avatar: Locator
    private readonly email: string
    private readonly badgesTitle: Locator



	constructor(page: Page) {
		super(page);
        this.avatar = page.locator('d-avatar');
        this.email = userEmail;
        this.did = 'did:dyne:sandbox.signroom:JAomV7KF3NjjagBEnTrRNG28DjepXM9XHEyGNYwJS7ke';
        this.badgesTitle = page.locator('d-heading:has-text("Badges")');
	}

	async navigate(): Promise<void> {
		await this.page.locator('ion-tab-bar d-tab-button:has-text("Profile")').click();
	}

    async hasAvatar(): Promise<void> {
        await expect(this.avatar).toBeVisible();
    }

    async hasEmail(): Promise<void> {
        await expect(this.page.getByText(this.email)).toBeVisible();
    }

    async hasDid(): Promise<void> {
        await expect(this.page.getByText(this.did)).toBeVisible();
    }

    async clickOnDid(): Promise<void> {
        await this.page.getByText(this.did).click();
    }

    async hasBadgesTitle(): Promise<void> {
        await expect(this.badgesTitle).toBeVisible();
    }
}
