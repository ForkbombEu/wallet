export type SelectedCredentials = Array<Array<Array<number | undefined> | undefined> | undefined>;
export type CredentialGroup = {
	required: boolean;
	claims: Array<
		Array<
			[string, Array<{ claims: Record<string, unknown> }>, Array<string | Record<string, unknown>>]
		>
	>;
};

function completeOption(
	group: CredentialGroup,
	option: number,
	indices: Array<number | undefined>
) {
	return (
		group.claims[option]?.length > 0 &&
		group.claims[option].every(([, variants, signed], index) => {
			const selected = indices[index];
			return (
				selected !== undefined &&
				Number.isInteger(selected) &&
				selected >= 0 &&
				selected < variants.length &&
				signed[selected] !== undefined
			);
		})
	);
}

export function isSelectionComplete(
	groups: CredentialGroup[],
	selection: SelectedCredentials
): boolean {
	let hasSelection = false;
	const complete = groups.every((group, index) => {
		const options = selection[index];
		const chosen =
			options?.flatMap((indices, option) =>
				indices?.some((value) => value !== undefined) ? [option] : []
			) ?? [];
		if (!chosen.length) return !group.required;
		hasSelection = true;
		return chosen.length === 1 && completeOption(group, chosen[0], options![chosen[0]]!);
	});
	return complete && hasSelection;
}

export function toggleCredential(
	selection: SelectedCredentials,
	group: number,
	option: number,
	credential: number,
	variant: number
): SelectedCredentials {
	const result = selection.slice();
	const indices = selection[group]?.[option]?.slice() ?? [];
	indices[credential] = indices[credential] === variant ? undefined : variant;
	result[group] = indices.some((index) => index !== undefined) ? [] : undefined;
	if (result[group]) result[group]![option] = indices;
	return result;
}

export function preparePresentation(groups: CredentialGroup[], selection: SelectedCredentials) {
	if (!isSelectionComplete(groups, selection)) throw new Error('INCOMPLETE_CREDENTIAL_SELECTION');
	const vp_token: Record<string, [string | Record<string, unknown>]> = {};
	const prop: Record<string, string[]> = {};
	groups.forEach((group, index) => {
		const options = selection[index];
		const option = options?.findIndex((indices) => indices?.some((value) => value !== undefined));
		if (option === undefined || option < 0) return;
		group.claims[option].forEach(([key, variants, signed], credential) => {
			const variant = options![option]![credential]!;
			vp_token[key] = [signed[variant]];
			prop[key] = Object.keys(variants[variant].claims);
		});
	});
	return { prop, vp_token };
}
