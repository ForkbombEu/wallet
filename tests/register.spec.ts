import { test } from '@playwright/test';
import { RegistrationPage } from './fixtures/RegistrationPage';
import { SecurityQuestionsPage } from './fixtures/SecurityQuestionsPage';
import { randomEmail, randomString } from './utils';

test.describe('Registration Flow', () => {
	test('should navigate to registration insert password page', async ({ page }) => {
		const registrationPage = new RegistrationPage(page);
		await registrationPage.navigateToRegistration();
		await registrationPage.enterEmail('newuser@example.com');
		await registrationPage.acceptConditions();
		await registrationPage.clickNext();
		await registrationPage.expectToBeOnPasswordPage();
	});

	test('should show error if passwords do not match', async ({ page }) => {
		const registrationPage = new RegistrationPage(page);
		await registrationPage.navigateToRegistration();
		await registrationPage.enterEmail('newuser@example.com');
		await registrationPage.acceptConditions();
		await registrationPage.clickNext();
		await registrationPage.enterPasswords('password123', 'password456');
		await registrationPage.clickNext();
		await registrationPage.checkPasswordMismatchError();
	});

	test('should navigate to questions page after successful registration', async ({ page }) => {
		const registrationPage = new RegistrationPage(page);
		const password = randomString(8);
		await registrationPage.navigateToRegistration();
		await registrationPage.enterEmail(randomEmail());
		await registrationPage.acceptConditions();
		await registrationPage.clickNext();
		await registrationPage.enterPasswords(password, password);
		await registrationPage.clickNext();
		await registrationPage.expectToBeOnQuestionsPage();
	});
});

test.describe('Security Questions Page', () => {
	test('should show error if less than three questions are answered', async ({ page }) => {
		const registrationPage = new RegistrationPage(page);
		const securityQuestionsPage = new SecurityQuestionsPage(page);
		const password = randomString(8);

		await registrationPage.navigateToRegistration();
		await registrationPage.enterEmail(randomEmail());
		await registrationPage.acceptConditions();
		await registrationPage.clickNext();
		await registrationPage.enterPasswords(password, password);
		await registrationPage.clickNext();

		await securityQuestionsPage.fillQuestionOne('zinot');
		await securityQuestionsPage.fillQuestionTwo('Paris');
		await securityQuestionsPage.clickNext();
		await securityQuestionsPage.checkErrorForIncompleteQuestions();
	});

	test.skip('should complete security questions and generate keypair', async ({ page }) => {
		const registrationPage = new RegistrationPage(page);
		const securityQuestionsPage = new SecurityQuestionsPage(page);
		const password = randomString(8);

		await registrationPage.navigateToRegistration();
		await registrationPage.enterEmail(randomEmail());
		await registrationPage.acceptConditions();
		await registrationPage.clickNext();
		await registrationPage.enterPasswords(password, password);
		await registrationPage.clickNext();

		await securityQuestionsPage.fillQuestionOne('Paris');
		await securityQuestionsPage.fillQuestionTwo('Buddy');
		await securityQuestionsPage.fillQuestionThree('New York');
		await securityQuestionsPage.clickNext();
		await page.waitForTimeout(5000);

		await securityQuestionsPage.expectKeyringGenerated();
		await securityQuestionsPage.verifyKeyringAndDID();
	});
});
