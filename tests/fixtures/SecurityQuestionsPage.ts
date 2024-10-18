import { type Page, type Locator, expect } from '@playwright/test';

export class SecurityQuestionsPage {
	private readonly page: Page;
	private readonly questionOneInput: Locator;
	private readonly questionTwoInput: Locator;
	private readonly questionThreeInput: Locator;
	private readonly nextButton: Locator;
	private readonly errorMessage: Locator;

	constructor(page: Page) {
		this.page = page;
		this.questionOneInput = page.locator('input[name="whereParentsMet"]');
		this.questionTwoInput = page.locator('input[name="nameFirstPet"]');
		this.questionThreeInput = page.locator('input[name="whereHomeTown"]');
		this.nextButton = page.getByRole('button', { name: 'Next' }).first();
		this.errorMessage = page.locator('text="AT_LEAST_THREE_QUESTIONS"');
	}

	async fillQuestionOne(answer: string) {
		await this.questionOneInput.fill(answer);
	}

	async fillQuestionTwo(answer: string) {
		await this.questionTwoInput.fill(answer);
	}

	async fillQuestionThree(answer: string) {
		await this.questionThreeInput.fill(answer);
	}

	async clickNext() {
		await this.nextButton.click();
	}

	async checkErrorForIncompleteQuestions() {
		await expect(this.errorMessage).toBeVisible();
	}

	async verifyKeyringAndDID() {
		const keyring = await this.page.evaluate(() =>
			localStorage.getItem('CapacitorStorage.keyring')
		);
		const did = await this.page.evaluate(() => localStorage.getItem('CapacitorStorage.did'));
		expect(keyring).not.toBeNull();
		expect(did).not.toBeNull();
	}

	async expectKeyringGenerated() {
		const seedText = await this.page.locator('text="You have a keyring!"');
		await expect(seedText).toBeVisible();
	}
}
