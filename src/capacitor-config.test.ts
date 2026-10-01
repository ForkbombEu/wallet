import { readFileSync } from 'node:fs';
import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
	vi.unstubAllEnvs();
	vi.resetModules();
});

describe('Capacitor 8 configuration', () => {
	it('compiles and targets Android 16 (API level 36)', () => {
		const variables = readFileSync(new URL('../android/variables.gradle', import.meta.url), 'utf8');

		expect(variables).toMatch(/compileSdkVersion\s*=\s*36\b/);
		expect(variables).toMatch(/targetSdkVersion\s*=\s*36\b/);
	});

	it('delegates Android insets to Capawesome without enabling native HTTP', async () => {
		vi.stubEnv('ANDROID', '1');
		const { default: config } = await import('../capacitor.config');

		expect(config.plugins?.SystemBars?.insetsHandling).toBe('disable');
		expect(config.plugins?.Keyboard?.resizeOnFullScreen).toBe(false);
		expect(config.plugins?.CapacitorHttp).toBeUndefined();
	});

	it('preserves shared plugin settings when enabling native HTTP on iOS', async () => {
		vi.stubEnv('ANDROID', '');
		const { default: config } = await import('../capacitor.config');

		expect(config.plugins?.SystemBars?.insetsHandling).toBe('disable');
		expect(config.plugins?.Keyboard?.resizeOnFullScreen).toBe(false);
		expect(config.plugins?.CapacitorHttp?.enabled).toBe(true);
	});
});
