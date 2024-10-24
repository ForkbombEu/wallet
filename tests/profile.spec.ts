import { ProfilePage } from './fixtures/ProfilePage';
import { expect, test } from '@playwright/test';
import { login, userEmail } from './utils';

test.describe('Profile Page', () => {
	let profilePage: ProfilePage;

	test.beforeEach(async ({ page }) => {
		profilePage = new ProfilePage(page);
		await login(page);
		await profilePage.navigate();
	});

	test('should load profile page after login', async () => {
		await profilePage.isPageVisible();
	});

	test('should have not accessibility issues', async () => {
		await profilePage.hasNoAccessibilityIssues();
	});

	test('should display user email', async () => {
		await profilePage.hasEmail();
	});

	test('should display user did', async () => {
		await profilePage.hasDid();
	});

	test.skip('should display user avatar', async () => {
		await profilePage.hasAvatar();
	});

	test('should display badges title', async () => {
		await profilePage.hasBadgesTitle();
	});

	test('should navigate to user did explorer page', async () => {
		await profilePage.clickOnDid();
		await profilePage.waitForUrlContains(
			`https://explorer.did.dyne.org/details/${profilePage.did}`
		);
	});
});
