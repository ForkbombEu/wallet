import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './fixtures';

for (const path of ['/en/login', '/en/wallet', '/en/verification/select-credential']) {
	test('no serious accessibility violations: ' + path, async ({ page }, testInfo) => {
		await page.goto(path);
		await expect(page.locator('ion-content').first()).toBeVisible();
		const result = await new AxeBuilder({ page }).analyze();
		await testInfo.attach('axe-results', {
			body: Buffer.from(JSON.stringify(result.violations)),
			contentType: 'application/json'
		});
		expect(
			result.violations.filter((violation) =>
				['serious', 'critical'].includes(violation.impact || '')
			)
		).toEqual([]);
	});
}
