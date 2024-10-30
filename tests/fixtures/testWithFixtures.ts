import { LanguageSettingsPage } from './pages/LanguageSettingPage';
import { VerificationPage } from './pages/VerificationPage';
import { SecurityQuestionsPage } from './pages/SecurityQuestionsPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { PassphrasePage } from './pages/PassphrasePage';
import { CredentialOfferPage } from './pages/CredentialOfferPage';
import { CredentialDetailPage } from './pages/CredentialDetailPage';
import { test as base } from '@playwright/test';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { WalletPage } from './pages/WalletPage';
import { ActivityPage } from './pages/ActivityPage';
import { RegisterLoginPage } from './pages/RegisterLoginPage';

type MyFixtures = {
	settingsPage: SettingsPage;
	credentialDetailPage: CredentialDetailPage;
	credentialOfferPage: CredentialOfferPage;
	loginPage: LoginPage;
	passphrasePage: PassphrasePage;
	profilePage: ProfilePage;
	walletPage: WalletPage;
	activityPage: ActivityPage;
	registerLoginPage: RegisterLoginPage;
	registrationPage: RegistrationPage;
	securityQuestionsPage: SecurityQuestionsPage;
	verificationPage: VerificationPage;
	languageSettingsPage: LanguageSettingsPage;
};

export const test = base.extend<MyFixtures>({
	settingsPage: async ({ page }, use) => {
		await use(new SettingsPage(page));
	},
	credentialDetailPage: async ({ page }, use) => {
		await use(new CredentialDetailPage(page));
	},
	credentialOfferPage: async ({ page }, use) => {
		await use(new CredentialOfferPage(page));
	},
	loginPage: async ({ page }, use) => {
		await use(new LoginPage(page));
	},
	passphrasePage: async ({ page }, use) => {
		await use(new PassphrasePage(page));
	},
	walletPage: async ({ page }, use) => {
		await use(new WalletPage(page));
	},
	profilePage: async ({ page }, use) => {
		await use(new ProfilePage(page));
	},
	activityPage: async ({ page }, use) => {
		await use(new ActivityPage(page));
	},
	registerLoginPage: async ({ page }, use) => {
		await use(new RegisterLoginPage(page));
	},
	registrationPage: async ({ page }, use) => {
		await use(new RegistrationPage(page));
	},
	securityQuestionsPage: async ({ page }, use) => {
		await use(new SecurityQuestionsPage(page));
	},
	verificationPage: async ({ page }, use) => {
		await use(new VerificationPage(page));
	},
	languageSettingsPage: async ({ page }, use) => {
		await use(new LanguageSettingsPage(page));
	}
});
export { expect } from '@playwright/test';
