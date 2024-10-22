import { test } from '@playwright/test';
import { RegistrationPage } from './fixtures/RegistrationPage';
import { SecurityQuestionsPage } from './fixtures/SecurityQuestionsPage';

test.describe('Registration Flow', () => {
	let registrationPage: RegistrationPage;
	test.beforeEach(async ({ page }) => {
		registrationPage = new RegistrationPage(page);
		await registrationPage.navigate();
	});

	test('should render registration page', async () => {
		await registrationPage.isPageVisible();
	});

	test('should show error if passwords do not match', async ({ page }) => {
		const registrationPage = new RegistrationPage(page);
		await registrationPage.registerUser({
			email: 'newuser@example.com',
			password: 'password123',
			confirmPassword: 'password456',
			conditionsAccepted: true
		});
		await registrationPage.checkPasswordMismatchError();
	});

	test('should navigate to questions page after successful registration', async ({ page }) => {
		await registrationPage.registerUser();
		await registrationPage.waitForUrlContains('/en/login/questions');
	});
});

test.describe('Security Questions Page', () => {
	let registrationPage: RegistrationPage;
	let securityQuestionsPage: SecurityQuestionsPage;

	test.beforeEach(async ({ page }) => {
		registrationPage = new RegistrationPage(page);
		securityQuestionsPage = new SecurityQuestionsPage(page);
		await registrationPage.navigate();
	});

	test('should show error if less than three questions are answered', async ({ page }) => {
		await registrationPage.registerUser();
		await securityQuestionsPage.fillQuestions({
			whereParentsMet: 'paris'
		});
		await securityQuestionsPage.checkErrorForIncompleteQuestions();
	});

	test.skip('should complete security questions and generate keypair', async ({ page }) => {
		await registrationPage.registerUser();
		await securityQuestionsPage.fillQuestions({
			whereParentsMet: 'paris',
			nameFirstPet: 'tommy',
			whereHomeTown: 'new york'
		});
		await page.waitForTimeout(5000);
		// await securityQuestionsPage.expectKeyringGenerated();
		await securityQuestionsPage.verifyKeyringAndDID();
	});
});
