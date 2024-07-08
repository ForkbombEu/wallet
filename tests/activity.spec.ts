import { expect, test } from '@playwright/test';
import {
	addActivitiesToLocalStorage,
	addCredentialsToLocalStorage,
	login,
	tabBarClick
} from './utils';

test.describe('Activity Page', () => {
	test('should load activity page after login', async ({ page }) => {
		await login(page);
		await tabBarClick('Activity', page);
		await expect(page).toHaveURL('/en/activity');
		await expect(page.getByText('ACTIVITY').first()).toBeVisible();
	});

	test('should display "No activity yet" when there are no activities', async ({ page }) => {
		await login(page);
		await tabBarClick('Activity', page);
		await expect(page.locator('d-heading:has-text("No activity yet")')).toBeVisible();
		await expect(
			page.locator(
				'd-text:has-text("Get alerts on new activities and keep your account up-to-date.")'
			)
		).toBeVisible();
	});

	test('should display activities if available', async ({ page }) => {
		await login(page);
		await page.evaluate(addCredentialsToLocalStorage);
		await page.evaluate(addActivitiesToLocalStorage);
		await tabBarClick('Home', page);
		await tabBarClick('Activity', page);
		const activityLocator = page.locator('d-activity-card');
		await expect(activityLocator.first()).toBeVisible();
	});

	test('should show clear all button when activities are present', async ({ page }) => {
		await login(page);
		await page.evaluate(addActivitiesToLocalStorage);
		await page.evaluate(addCredentialsToLocalStorage);
		await tabBarClick('Activity', page);
		await expect(page.locator('d-button:has-text("clear all")')).toBeVisible();
	});

	test.skip('should remove activity when remove button is clicked', async ({ page }) => {
		await login(page);
		await page.evaluate(addActivitiesToLocalStorage);
		await page.evaluate(addCredentialsToLocalStorage);
		await tabBarClick('Activity', page);
		const removeButton = page.locator('d-button:has-text("remove")').first();
		await removeButton.click();
		await expect(removeButton).not.toBeVisible();
	});

	test.skip('should clear all activities when clear all button is clicked', async ({ page }) => {
		await login(page);
		await page.evaluate(addActivitiesToLocalStorage);
		await page.evaluate(addCredentialsToLocalStorage);
		await tabBarClick('Activity', page);
		const clearAllButton = page.locator('d-button:has-text("clear all")');
		await clearAllButton.click();
		await expect(page.locator('.itens-start')).not.toBeVisible();
	});

	test('should navigate to credential detail on "show me!" button click', async ({ page }) => {
		await login(page);
		await page.evaluate(addActivitiesToLocalStorage);
		await page.evaluate(addCredentialsToLocalStorage);
		await tabBarClick('Activity', page);
		const showMeButton = page.locator('d-button:has-text("show me!")').first();
		await showMeButton.click();
		await expect(page).toHaveURL(/\/credential-detail$/);
	});
});
