import { test } from './fixtures/testWithFixtures';
import { addActivitiesToLocalStorage, addCredentialsToLocalStorage, login } from './utils';

test.describe('Activity Page', () => {
	test.beforeEach(async ({ page, activityPage }) => {
		await login(page);
		await addCredentialsToLocalStorage(page);
		await addActivitiesToLocalStorage(page);
		await activityPage.navigate();
	});

	test.skip('should load activity page after login', async ({ activityPage }) => {
		await activityPage.isPageVisible();
	});

	test('should have not accessibility issues', async ({ activityPage }) => {
		await activityPage.hasNoAccessibilityIssues();
	});

	test('should display "No activity yet" when there are no activities', async ({
		activityPage
	}) => {
		await activityPage.clearAllActivities();
		await activityPage.verifyNoActivityMessage();
	});

	test('should display activities if available', async ({ activityPage }) => {
		await activityPage.verifyActivitiesPresent();
	});

	test('should show clear all button when activities are present', async ({ activityPage }) => {
		await activityPage.verifyClearAllButtonVisible();
	});

	test('should show info-led on tab button when activity is present', async ({ activityPage }) => {
		await activityPage.verifyHasInfoLedOnTab();
	});

	test('should not show info-led on tab button after user see activities', async ({
		page,
		activityPage
	}) => {
		await activityPage.verifyHasInfoLedOnTab();
		await page.waitForTimeout(5000);
		await activityPage.verifyInfoLedNotPresent();
	});

	test('should clear all activities when clear all button is clicked', async ({ activityPage }) => {
		await activityPage.clearAllActivities();
		await activityPage.verifyNoActivityMessage();
		await activityPage.verifyInfoLedNotPresent();
	});

	test('should navigate to credential detail if click on card', async ({
		activityPage
	}) => {
		await activityPage.clickOnFirstActivityCard();
	});
});
