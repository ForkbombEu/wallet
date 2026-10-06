import { describe, expect, it } from 'vitest';
import {
	isSelectionComplete,
	toggleCredential,
	preparePresentation,
	type CredentialGroup,
	type SelectedCredentials
} from './credentialSelection';

const credential = (key: string, signature = 'signed-original') =>
	[
		key,
		[{ claims: { age_over_18: true } }],
		[signature]
	] as CredentialGroup['claims'][number][number];
const required: CredentialGroup = { required: true, claims: [[credential('proof_of_age')]] };
const optional: CredentialGroup = {
	required: false,
	claims: [[credential('optional_a'), credential('optional_b')]]
};

describe('explicit credential consent', () => {
	it('requires a real selection, including when every group is optional', () => {
		expect(isSelectionComplete([required], [])).toBe(false);
		expect(isSelectionComplete([{ ...required, required: false }], [])).toBe(false);
		expect(isSelectionComplete([], [])).toBe(false);
		expect(isSelectionComplete([{ required: true, claims: [] }], [])).toBe(false);
	});
	it('selects and deselects without mutating the previous state', () => {
		const original: SelectedCredentials = [];
		const selection = toggleCredential(original, 0, 0, 0, 0);
		expect(original).toEqual([]);
		expect(isSelectionComplete([required], selection)).toBe(true);
		expect(isSelectionComplete([required], toggleCredential(selection, 0, 0, 0, 0))).toBe(false);
		expect(selection[0]?.[0]?.[0]).toBe(0);
	});
	it('replaces alternative groups instead of sharing both alternatives', () => {
		const groups = [{ required: true, claims: [[credential('first')], [credential('second')]] }];
		let selection = toggleCredential([], 0, 0, 0, 0);
		selection = toggleCredential(selection, 0, 1, 0, 0);
		expect(preparePresentation(groups, selection).vp_token).toEqual({
			second: ['signed-original']
		});
	});
	it('rejects partially selected optional groups and malformed indices', () => {
		let selection = toggleCredential([], 0, 0, 0, 0);
		selection = toggleCredential(selection, 1, 0, 0, 0);
		expect(isSelectionComplete([required, optional], selection)).toBe(false);
		expect(() => preparePresentation([required, optional], selection)).toThrow('INCOMPLETE');
		expect(isSelectionComplete([required], [[[100]]])).toBe(false);
		expect(isSelectionComplete([required], [[[-1]]])).toBe(false);
		expect(isSelectionComplete([required], [[[0.5]]])).toBe(false);
		expect(isSelectionComplete([required], [[[0], [0]]])).toBe(false);
	});
	it('requires every credential in a chosen combination', () => {
		let selection = toggleCredential([], 0, 0, 0, 0);
		expect(isSelectionComplete([optional], selection)).toBe(false);
		selection = toggleCredential(selection, 0, 0, 1, 0);
		expect(isSelectionComplete([optional], selection)).toBe(true);
	});
	it('preserves signed material and technical keys exactly', () => {
		const signed = { proof: { proofValue: 'DO_NOT_CHANGE' }, nested: ['original'] };
		const groups: CredentialGroup[] = [
			{
				required: true,
				claims: [[['raw_claim_key', [{ claims: { raw_field: 'unchanged' } }], [signed]]]]
			}
		];
		const before = JSON.stringify(groups);
		const presentation = preparePresentation(groups, toggleCredential([], 0, 0, 0, 0));
		expect(presentation.vp_token.raw_claim_key[0]).toBe(signed);
		expect(presentation.prop).toEqual({ raw_claim_key: ['raw_field'] });
		expect(JSON.stringify(groups)).toBe(before);
	});
});
