import type { Feedback } from './../../src/lib/utils/types';
import { expect, type Locator, type Page } from '@playwright/test';

export class FeedbackComponent {
	private readonly page: Page;
	private readonly component: Locator;
	private readonly closeButton: Locator;
	private readonly seeMoreButton: Locator;
	private readonly seeLessButton: Locator;
	private readonly feedbackText: Locator;
	private readonly feedbackMessage: Locator;

	constructor(page: Page) {
		this.page = page;
		this.component = this.page.locator('d-feedback');
		this.closeButton = this.page.locator('d-button:has-text("X")');
		this.seeMoreButton = this.page.locator('button:has-text("See more")');
		this.seeLessButton = this.page.locator('d-button:has-text("Show less")');
		this.feedbackText = this.component.locator('d-text').first();
		this.feedbackMessage = this.component.locator('d-text.text-on-alt');
	}

	async isVisible(): Promise<void> {
		await expect(this.component).toBeVisible();
	}

	async isNotVisible(): Promise<void> {
		await expect(this.component).not.toBeVisible();
	}

	async closeFeedback() {
		await this.closeButton.click();
	}
	async seeMore() {
		await this.seeMoreButton.click();
	}
	async hasSeeMoreButton(): Promise<void> {
		await expect(this.seeMoreButton).toBeVisible();
	}

	async seeLess() {
		await this.seeLessButton.click();
	}

	async hasSeeLessButton(): Promise<void> {
		await expect(this.seeLessButton).toBeVisible();
	}

	async verifyFeedbackText(text: string | RegExp): Promise<void> {
		await expect(this.feedbackText).toHaveText(text);
	}

	async verifyFeedbackMessage(message: string | RegExp): Promise<void> {
		await this.seeMore();
		await expect(this.feedbackMessage).toHaveText(message);
	}

	async verifyFeedbackType(type: Feedback['type']): Promise<void> {
		await expect(this.component).toHaveClass(`feedback-${type}`);
	}

	async verifyFeedback(message: Partial<Feedback>): Promise<void> {
		if (message.type) {
			await this.verifyFeedbackType(message.type);
		}
		if (message.message) {
			await this.verifyFeedbackMessage(message.message);
		}
		if (message.feedback) {
			await this.verifyFeedbackText(message.feedback);
		}
	}
}
