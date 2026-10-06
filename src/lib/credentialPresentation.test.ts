import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$lib/i18n', async () => ({ m: await import('../paraglide/messages.js') }));
import { setLanguageTag } from '../paraglide/runtime';
import {
	claimLabel,
	claimValue,
	recipientDomain,
	formatCredentialDate
} from './credentialPresentation';

beforeEach(() => setLanguageTag('en'));

describe('credential presentation without protocol changes', () => {
	it('localizes familiar claims and gives unknown identifiers a readable fallback', () => {
		expect(claimLabel('proof_of_age')).toBe('Proof of age');
		expect(claimLabel('age_over_18')).toBe('Over 18');
		expect(claimLabel('address.first_name')).toBe('Address / First name');
		expect(claimLabel('customField_name')).toBe('Custom Field name');
		expect(claimLabel('')).toBe('');
		expect(claimLabel('https://issuer.example/vct/EmployeeID')).toBe(
			'https://issuer.example/vct/EmployeeID'
		);
	});
	it('uses the active language', () => {
		setLanguageTag('it');
		expect(claimLabel('age_over_18')).toBe('Maggiorenne');
		expect(claimValue(true)).toBe('Sì');
	});
	it('preserves values while making booleans readable', () => {
		expect(claimValue(true)).toBe('Yes');
		expect(claimValue('false')).toBe('No');
		expect(claimValue(0)).toBe('0');
		expect(claimValue(null)).toBe('');
		expect(claimValue({ raw_key: 'original' })).toBe('{"raw_key":"original"}');
	});
	it('shows the actual destination host, not a username or a misleading URL fragment', () => {
		expect(recipientDomain('https://trusted.example@receiver.example:8443/share')).toBe(
			'receiver.example:8443'
		);
		expect(recipientDomain('https://receiver.example/path?next=trusted.example')).toBe(
			'receiver.example'
		);
		expect(recipientDomain('javascript:alert(1)')).toBe('Recipient unavailable');
		expect(recipientDomain('not a URL')).toBe('Recipient unavailable');
	});
	it('formats dates for the selected locale and handles invalid data', () => {
		const timestamp = 1893456000;
		expect(formatCredentialDate(timestamp, 'it')).toBe(
			new Intl.DateTimeFormat('it', { dateStyle: 'medium', timeStyle: 'short' }).format(
				new Date(timestamp * 1000)
			)
		);
		expect(formatCredentialDate(NaN, 'en')).toBe('Date unavailable');
	});
});
