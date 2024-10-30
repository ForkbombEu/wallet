import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from '../BasePage';
import { tabBarClick } from '../../utils';

export class LanguageSettingsPage extends BasePage {
	path = '/en/settings/language';
	pageTitle = 'Language';

	private languageButtons: Locator;

	constructor(page: Page) {
		super(page);
		this.languageButtons = page.locator(
			'button.flex.h-16.w-full.items-center.justify-between.rounded-lg.border-b.border-solid.border-b-stroke.px-5.py-8'
		);
	}

	async navigate(): Promise<void> {
		await tabBarClick('Profile', this.page);
		await this.page.getByRole('banner').locator('ion-button').click();
		await this.page.locator('d-button:has-text("Languages")').click();
	}

	async hasFourLanguageButtons(): Promise<void> {
		await expect(this.languageButtons).toHaveCount(4);
	}

	async changeLanguage(lang: 'English' | 'Deutsch' | 'Francais' | 'Italiano'): Promise<void> {
		await this.page.locator(`button:has-text("${lang}")`).click();
	}

	async verifyHeadingIsChanged(
		lang: 'English' | 'Deutsch' | 'Francais' | 'Italiano'
	): Promise<void> {
		const textsToExpect = {
			English: 'Language',
			Deutsch: 'Sprache',
			Francais: 'Langue',
			Italiano: 'Lingua'
		};
		this.expectText(textsToExpect[lang]);
	}

	async clickOnBack(): Promise<void> {
		await this.page.locator('ion-button.button-clear.in-toolbar.button-has-icon-only').click();
	}

	async changeLanguageAndExpectProfilePageToChange(): Promise<void> {
		await this.changeLanguage('Deutsch');
		await this.verifyHeadingIsChanged('Deutsch');
		await this.clickOnBack();
		await this.waitForUrlContains('/de/profile');
		await expect(this.page.getByText('Profil', { exact: true })).toBeVisible();
	}
}
