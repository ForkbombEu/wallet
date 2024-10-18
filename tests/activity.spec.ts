import { test } from '@playwright/test';
import { ActivityPage } from './fixtures/ActivityPage';
import {
	addActivitiesToLocalStorage,
	addCredentialsToLocalStorage,
	login,
} from './utils';

test.describe('Activity Page', () => {
	let activityPage: ActivityPage;

	test.beforeEach(async ({ page }) => {
		activityPage = new ActivityPage(page);
		await login(page);
		await addCredentialsToLocalStorage(page);
		await addActivitiesToLocalStorage(page);
		await activityPage.navigateToActivityTab();
	});

	test('should load activity page after login', async () => {
		await activityPage.verifyActivityPageLoaded();
	});

	test('should display "No activity yet" when there are no activities', async () => {
		await activityPage.clearAllActivities();
		await activityPage.verifyNoActivitiesMessage();
	});

	test('should display activities if available', async ({ page }) => {
		await activityPage.verifyActivitiesPresent();
	});

	test('should show clear all button when activities are present', async () => {
		await activityPage.verifyClearAllButtonVisible();
	});

	test('should remove activity when remove button is clicked', async () => {
		await activityPage.removeFirstActivity();
		await activityPage.verifyHowManyActivitiesPresent(1);
	});

	test('should clear all activities when clear all button is clicked', async () => {
		await activityPage.clearAllActivities();
	});

	test('should navigate to credential detail on "show me!" button click', async () => {
		await activityPage.clickShowMeButton();
	});
});
