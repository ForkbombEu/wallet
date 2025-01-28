import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from '../BasePage';
import { FormComponent } from '../components/FormComponent';

export class QuestionsFormComponent extends FormComponent {
	async fillAndSubmit(
		data: Partial<{
			whereParentsMet?: string;
			nameFirstPet?: string;
			whereHomeTown?: string;
		}>
	): Promise<void> {
		const { whereParentsMet, nameFirstPet, whereHomeTown } = data;
		if (whereParentsMet) {
			await this.fillInputByName('whereParentsMet', whereParentsMet);
		}

		if (nameFirstPet) {
			await this.fillInputByName('nameFirstPet', nameFirstPet);
		}

		if (whereHomeTown) {
			await this.fillInputByName('whereHomeTown', whereHomeTown);
		}

		await this.submitForm('Next');
	}
}

export class SecurityQuestionsPage extends BasePage {
	path = '/en/security-questions';
	pageTitle = 'SECURITY QUESTIONS';

	private readonly errorMessage: Locator;
	private readonly form: QuestionsFormComponent;

	constructor(page: Page) {
		super(page);
		this.errorMessage = page.locator('text="at least 3 answers are required"');
		this.form = new QuestionsFormComponent(page);
	}

	async fillQuestions(
		data: Partial<{
			whereParentsMet: string;
			nameFirstPet: string;
			whereHomeTown: string;
		}>
	): Promise<void> {
		await this.form.fillAndSubmit(data);
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

	// async expectKeyringGenerated() {
	// 	const seedText = await this.page.locator('text="You have a keyring!"');
	// 	await expect(seedText).toBeVisible();
	// }
}
