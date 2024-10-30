import { test } from './fixtures/testWithFixtures';

test.describe('Registration Flow', () => {
	test.beforeEach(async ({ registrationPage }) => {
		await registrationPage.navigate();
	});

	test('should have not accessibility issues', async ({ registrationPage }) => {
		await registrationPage.hasNoAccessibilityIssues();
	});

	test('should render registration page', async ({ registrationPage }) => {
		await registrationPage.isPageVisible();
	});

	test('should show error if passwords do not match', async ({ registrationPage }) => {
		await registrationPage.registerUser({
			email: 'newuser@example.com',
			password: 'password123',
			confirmPassword: 'password456',
			conditionsAccepted: true
		});
		await registrationPage.checkPasswordMismatchError();
	});

	test('should navigate to questions page after successful registration', async ({
		registrationPage
	}) => {
		await registrationPage.registerUser();
		await registrationPage.waitForUrlContains('/en/login/questions');
	});
});

test.describe('Security Questions Page', () => {
	test.beforeEach(async ({ page, registrationPage }) => {
		await registrationPage.navigate();
		await registrationPage.registerUser();
	});

	test('should have not accessibility issues', async ({ securityQuestionsPage }) => {
		await securityQuestionsPage.hasNoAccessibilityIssues();
	});

	test('should show error if less than three questions are answered', async ({
		securityQuestionsPage
	}) => {
		await securityQuestionsPage.hasNoAccessibilityIssues();
		await securityQuestionsPage.fillQuestions({
			whereParentsMet: 'paris'
		});
		await securityQuestionsPage.checkErrorForIncompleteQuestions();
	});

	test.skip('should complete security questions and generate keypair', async ({
		page,
		securityQuestionsPage
	}) => {
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
