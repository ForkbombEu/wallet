import { test } from '@playwright/test';
import { ActivityPage } from './fixtures/ActivityPage';
import { addActivitiesToLocalStorage, addCredentialsToLocalStorage, login } from './utils';

test.describe('Activity Page', () => {
	let activityPage: ActivityPage;

	test.beforeEach(async ({ page }) => {
		activityPage = new ActivityPage(page);
		await login(page);
		await addCredentialsToLocalStorage(page);
		await addActivitiesToLocalStorage(page);
		await activityPage.navigate();
	});

	test('should load activity page after login', async () => {
		await activityPage.isPageVisible();
	});

	test('should have not accessibility issues', async () => {
		await activityPage.hasNoAccessibilityIssues();
	});

	test('should display "No activity yet" when there are no activities', async () => {
		await activityPage.clearAllActivities();
		await activityPage.verifyNoActivityMessage();
	});

	test('should display activities if available', async () => {
		await activityPage.verifyActivitiesPresent();
	});

	test('should show clear all button when activities are present', async () => {
		await activityPage.verifyClearAllButtonVisible();
	});

	test('should remove activity when remove button is clicked', async () => {
		await activityPage.verifyHowManyActivitiesPresent(1);
		await activityPage.removeFirstActivity();
		await activityPage.verifyHowManyActivitiesPresent(0);
	});

	test('should show info-led on tab button when activity is present', async () => {
		await activityPage.verifyHasInfoLedOnTab();
	});

	test('should not show info-led on tab button after user see activities', async ({ page }) => {
		await activityPage.verifyHasInfoLedOnTab();
		await page.waitForTimeout(5000);
		await activityPage.verifyInfoLedNotPresent();
	});

	test('should clear all activities when clear all button is clicked', async () => {
		await activityPage.clearAllActivities();
		await activityPage.verifyNoActivityMessage();
		await activityPage.verifyInfoLedNotPresent();
	});

	test('should navigate to credential detail on "show me!" button click', async () => {
		await activityPage.clickShowMeButton();
	});
});
