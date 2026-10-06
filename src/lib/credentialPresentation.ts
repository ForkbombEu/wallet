import { m } from '$lib/i18n';

// Presentation only: never change claim paths, values or signed credentials.
export function claimLabel(identifier: string): string {
	const labels: Record<string, () => string> = {
		given_name: m.Claim_first_name,
		first_name: m.Claim_first_name,
		firstName: m.Claim_first_name,
		family_name: m.Claim_last_name,
		last_name: m.Claim_last_name,
		lastName: m.Claim_last_name,
		name: m.Claim_full_name,
		full_name: m.Claim_full_name,
		birthdate: m.Claim_birth_date,
		birth_date: m.Claim_birth_date,
		date_of_birth: m.Claim_birth_date,
		age_over_18: m.Claim_age_over_18,
		email: m.Email,
		address: m.Claim_address,
		nationality: m.Claim_nationality,
		proof_of_age: m.Proof_of_age
	};
	if (/^(https?:|urn:|did:)/.test(identifier)) return identifier;
	if (identifier.includes('.')) return identifier.split('.').map(claimLabel).join(' / ');
	const label = labels[identifier];
	if (label) return label();
	const words = identifier
		.replace(/([a-z])([A-Z])/g, '$1 $2')
		.replace(/[_-]+/g, ' ')
		.trim();
	return words ? words[0].toLocaleUpperCase() + words.slice(1) : identifier;
}

export function claimValue(value: unknown): string {
	if (value === true || value === 'true') return m.Claim_yes();
	if (value === false || value === 'false') return m.Claim_no();
	if (value === null || value === undefined) return '';
	return typeof value === 'object' ? JSON.stringify(value) : String(value);
}

export function recipientDomain(endpoint: string): string {
	try {
		const url = new URL(endpoint);
		return ['https:', 'http:'].includes(url.protocol) ? url.host : m.Recipient_unavailable();
	} catch {
		return m.Recipient_unavailable();
	}
}

export function formatCredentialDate(timestamp: number, locale: string): string {
	const date = new Date(timestamp * 1000);
	if (!Number.isFinite(timestamp) || Number.isNaN(date.getTime())) return m.Date_unavailable();
	return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}
