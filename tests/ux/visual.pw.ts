import { test, expect } from './fixtures';

test('review all repaired flows at the project viewport', async ({ page }, testInfo) => {
	const screenshots = [
		['onboarding', '/en/on-boarding'],
		['login', '/en/login'],
		['passphrase', '/en/login/passphrase'],
		['questions', '/en/login/questions'],
		['wallet-empty', '/en/wallet'],
		['wallet-populated', '/en/wallet?filled'],
		['profile', '/en/profile'],
		['sharing', '/en/verification/select-credential']
	];
	for (const [name, path] of screenshots) {
		if (name === 'passphrase' || name === 'questions') {
			await page.goto('/en/login');
			await expect(page.getByRole('textbox', { name: 'Email', exact: true })).toBeVisible();
			await page.evaluate(async (target) => {
				// @ts-expect-error Vite-only synthetic browser fixture.
				const { userEmailStore } = await import('/src/routes/[[lang]]/(auth)/login/_lib/index.ts');
				userEmailStore.set({
					email: 'review@example.test',
					registration: false,
					password: 'synthetic'
				});
				// @ts-expect-error Vite-only synthetic browser fixture.
				const { goto } = await import('/src/lib/i18n/index.ts');
				await goto(target);
			}, path);
		} else await page.goto(path);
		await expect(page.locator('ion-content').first()).toBeVisible();
		await page.evaluate(() => document.fonts.ready);
		await page.waitForTimeout(200);
		const screenshot = await page.screenshot({ path: testInfo.outputPath(name + '.png') });
		await testInfo.attach(name, { body: screenshot, contentType: 'image/png' });
		// Prevent horizontal clipping without disabling user zoom.
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
			true
		);
	}
});
