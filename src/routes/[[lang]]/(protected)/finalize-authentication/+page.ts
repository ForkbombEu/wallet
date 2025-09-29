import { getCredentialAuthenticationPreference } from "$lib/preferences/credentialAuthentication.js";

export const load = async ({ url }) => {
	const code = url.searchParams.get('code');
	const error = url.searchParams.get('error');
	const error_description = url.searchParams.get('error_description');

    const data = await getCredentialAuthenticationPreference();
    if (!data || data.length === 0) {
        return {
            code: undefined,
            feedbackData: {
                type: 'error',
                feedback: 'No credential authentication data found.'
            }
        };
    }
	return {
		error, error_description, code, ...data[0]
	};
};
