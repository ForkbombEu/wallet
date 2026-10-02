import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';

const eslint = new ESLint({
	overrideConfigFile: new URL('../eslint.config.mjs', import.meta.url).pathname
});

describe('localization lint with ESLint 10', () => {
	it('rejects untranslated text in Svelte components', async () => {
		const [result] = await eslint.lintText('<p>Hello world</p>', {
			filePath: 'src/localization-fixture.svelte'
		});

		expect(result.messages).toEqual([
			expect.objectContaining({
				ruleId: 'localization/check-localization',
				severity: 2,
				message: 'Non-literals:Hello world'
			})
		]);
	});

	it('accepts translated expressions and TypeScript scripts', async () => {
		const [result] = await eslint.lintText(
			'<script lang="ts">import { m } from "$lib/i18n"; const label: string = m.Close();</script><p>{label}</p>',
			{ filePath: 'src/localization-fixture.svelte' }
		);

		expect(result.messages).toEqual([]);
	});
});
