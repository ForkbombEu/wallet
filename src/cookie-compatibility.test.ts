import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';

// Resolve cookie from SvelteKit's dependency graph, not from a root installation.
const require = createRequire(import.meta.url);
const requireFromKit = createRequire(require.resolve('@sveltejs/kit/package.json'));
const cookie = requireFromKit('cookie');

describe('SvelteKit 2 cookie compatibility', () => {
	it('provides the parse and serialize exports used by SvelteKit', () => {
		expect(cookie.parse).toBeTypeOf('function');
		expect(cookie.serialize).toBeTypeOf('function');
	});

	it('parses and serializes encoded session cookies', () => {
		expect(cookie.parse('session=wallet%20test')).toEqual({ session: 'wallet test' });
		expect(cookie.serialize('session', 'wallet test', { httpOnly: true, sameSite: 'lax' })).toBe(
			'session=wallet%20test; HttpOnly; SameSite=Lax'
		);
	});
});
