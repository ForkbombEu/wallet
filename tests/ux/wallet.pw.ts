import { test, expect } from './fixtures';

test('welcome remains scrollable and its account actions work', async ({ page }) => {
	await page.goto('/en/register-login');
	await page.getByRole('link', { name: /Create an account/i }).click();
	await expect(page).toHaveURL(/\/en\/login\?registration=true$/);
	await expect(page.getByRole('textbox', { name: 'Email', exact: true })).toBeVisible();
});

test('onboarding explains benefits and offers explicit progress and completion', async ({
	page
}) => {
	await page.goto('/en/on-boarding');
	await expect(page.getByRole('heading', { name: 'Your credentials, in one place' })).toBeVisible();
	await expect(page.getByText(/EUDI-ARF/)).not.toBeVisible();
	await page.getByRole('button', { name: 'Continue', exact: true }).click();
	await expect(page.getByRole('heading', { name: 'Choose what to share' })).toBeVisible();
	await page.getByRole('button', { name: 'Continue', exact: true }).click();
	await expect(page.getByRole('button', { name: 'Get started', exact: true })).toBeVisible();
	await page.getByRole('button', { name: 'Get started', exact: true }).click();
	await expect(page).toHaveURL(/\/en\/home$/);
});

test('login labels, zoom and password controls remain accessible', async ({ page }) => {
	await page.goto('/en/login');
	await expect(page.locator('meta[name="viewport"]')).not.toHaveAttribute(
		'content',
		/user-scalable=no|maximum-scale=/
	);
	const email = page.getByRole('textbox', { name: 'Email', exact: true });
	await expect(email).toHaveAttribute('autocomplete', 'email');
	await email.fill('review@example.test');
	const password = page.locator('input[name="password"]');
	await password.fill('not-a-real-password');
	await page.getByRole('button', { name: 'Show password', exact: true }).press('Space');
	await expect(password).toHaveAttribute('type', 'text');
	await expect(page.getByRole('button', { name: 'Hide password', exact: true })).toHaveAttribute(
		'aria-pressed',
		'true'
	);
	await page.getByRole('button', { name: 'Hide password', exact: true }).press('Tab');
	await expect(page).toHaveURL(/\/en\/login$/);
	// Clicking the visible label must focus the real input, not just rely on aria-label.
	await page.locator('d-input[name="email"] label.label').click();
	await expect(email).toBeFocused();
});

test('tabs support arrow focus and explicit activation without accidental navigation', async ({
	page
}) => {
	await page.goto('/en/wallet');
	await expect(page.getByRole('tab')).toHaveCount(4);
	const wallet = page.getByRole('tab', { name: 'Wallet', exact: true });
	await expect(wallet).toHaveAttribute('aria-selected', 'true');
	await wallet.focus();
	await wallet.press('ArrowRight');
	const activity = page.getByRole('tab', { name: 'Activity', exact: true });
	await expect(activity).toBeFocused();
	await expect(page).toHaveURL(/\/en\/wallet$/);
	await activity.press('Space');
	await expect(page).toHaveURL(/\/en\/activity$/);
});

test('empty wallet exposes issuance services and a keyboard-operable service', async ({ page }) => {
	await page.goto('/en/wallet');
	await page.getByRole('link', { name: /Get credentials/i }).click();
	await expect(page).toHaveURL(/\/en\/home$/);
	const service = page.getByRole('link', { name: /Proof of age/ });
	await expect(service).toBeVisible();
	await service.focus();
	await service.press('Tab');
	await expect(page).toHaveURL(/\/en\/home$/);
});

test('populated wallet keeps expiry and readable claim names visible', async ({ page }) => {
	await page.goto('/en/wallet?filled');
	await expect(page.locator('d-credential-card')).toBeVisible();
	await expect(page.getByText('Expires', { exact: true })).toBeVisible();
	await expect(page.locator('d-badge').filter({ hasText: 'Over 18' })).toBeVisible();
});

test('profile no longer carries an unrelated scanning action', async ({ page }) => {
	await page.goto('/en/profile');
	await expect(page.getByRole('link', { name: /Scan QR/i })).toHaveCount(0);
	await expect(page.getByRole('button', { name: 'Settings', exact: true })).toBeVisible();
});

test('decline works before any credential is selected and sends nothing', async ({ page }) => {
	await page.goto('/en/verification/select-credential');
	await expect(page.getByText('recipient.example.test', { exact: true })).toBeVisible();
	await expect(page.getByRole('button', { name: 'Share selected information' })).toBeDisabled();
	await page.getByRole('button', { name: 'Decline', exact: true }).click();
	await expect(page).toHaveURL(/\/en\/wallet$/);
	expect(await page.evaluate(() => (window as any).__uxPresentations ?? [])).toEqual([]);
});

test('selection is reversible and sharing preserves the original signed credential', async ({
	page
}) => {
	await page.goto('/en/verification/select-credential');
	const card = page.locator('d-verification-card button');
	await expect(card).toHaveAttribute('aria-pressed', 'false');
	await card.press('Space');
	await expect(card).toHaveAttribute('aria-pressed', 'true');
	await card.press('Space');
	await expect(card).toHaveAttribute('aria-pressed', 'false');
	await card.press('Enter');
	await expect(page.getByRole('button', { name: 'Share selected information' })).toBeEnabled();
	await page.getByRole('button', { name: 'Share selected information' }).click();
	await expect(page).toHaveURL(/\/verification\/results$/);
	expect(await page.evaluate(() => (window as any).__uxPresentations)).toEqual([
		{
			url: 'https://recipient.example.test/presentation',
			body: {
				state: 'synthetic-state',
				vp_token: { proof_of_age: ['synthetic-signed-credential'] }
			}
		}
	]);
});

test('no matching credentials still leaves a usable cancel action', async ({ page }) => {
	await page.goto('/en/verification/select-credential?empty');
	await expect(page.getByRole('heading', { name: 'No matching credentials' })).toBeVisible();
	await expect(page.getByRole('button', { name: 'Share selected information' })).toBeDisabled();
	await page.getByRole('button', { name: 'Decline', exact: true }).click();
	await expect(page).toHaveURL(/\/en\/wallet$/);
});

test('security questions show the minimum and answer progress before submission', async ({
	page
}) => {
	await page.goto('/en/login');
	await page.evaluate(async () => {
		// Synthetic in-memory account only; no authentication or key generation.
		// @ts-expect-error Vite-only browser fixture imports.
		const { userEmailStore } = await import('/src/routes/[[lang]]/(auth)/login/_lib/index.ts');
		userEmailStore.set({
			email: 'review@example.test',
			registration: false,
			password: 'synthetic'
		});
		// @ts-expect-error Vite-only browser fixture imports.
		const { goto } = await import('/src/lib/i18n/index.ts');
		await goto('/login/questions');
	});
	const next = page.getByRole('button', { name: 'Next', exact: true });
	await expect(next).toBeDisabled();
	const answers = page.locator('input.native-input');
	await answers.nth(0).fill('synthetic answer');
	await answers.nth(1).fill('synthetic answer');
	await expect(next).toBeDisabled();
	await answers.nth(2).fill('synthetic answer');
	await expect(page.getByText('3 of 5 answered · at least 3 required')).toBeVisible();
	await expect(next).toBeEnabled();
});
