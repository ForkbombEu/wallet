import { test } from './fixtures/testWithFixtures';
import { login } from './utils';

test.describe('Language settings page', () => {
	test.describe.configure({ retries: 2 });

	test.beforeEach(async ({ page, languageSettingsPage }) => {
		login(page);
		await languageSettingsPage.navigate();
	});

	test('should have not accessibility issues', async ({ languageSettingsPage }) => {
		await languageSettingsPage.hasNoAccessibilityIssues();
	});

	test('should have four language buttons', async ({ languageSettingsPage }) => {
		await languageSettingsPage.hasFourLanguageButtons();
	});

	test('should change language to Deutch', async ({ languageSettingsPage }) => {
		await languageSettingsPage.changeLanguageAndExpectProfilePageToChange();
	});
    
});
