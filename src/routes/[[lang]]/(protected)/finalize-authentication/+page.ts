import { getCredentialAuthenticationPreference } from "$lib/preferences/credentialAuthentication.js";

export const load = async ({ url }) => {
	let code = url.searchParams.get('code');

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
		code, ...data[0]
	};
};
