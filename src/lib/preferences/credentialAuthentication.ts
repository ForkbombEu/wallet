import dayjs from 'dayjs';
import { getStructuredPreferences, setStructuredPreferences } from '.';
import type { CallParResult, QrToWellKnown } from '$lib/openId4vci';

//

export const CREDENTIALS_PREFERENCES_KEY = 'credentials-authentication';

export type CredentialAuthentication = {
    wn: QrToWellKnown;
    authorizeUrl: string;
    parResult: CallParResult;
    timestamp: number;
};

export async function setCredentialAuthenticationPreference(
    credentialAuthentication: Omit<CredentialAuthentication, 'timestamp'>
): Promise<CredentialAuthentication> {
    const ca = {
        ...credentialAuthentication,
        timestamp: dayjs().unix()
    };
    await setStructuredPreferences(CREDENTIALS_PREFERENCES_KEY, [ca], true);
    return ca;
}

export async function getCredentialAuthenticationPreference(): Promise<CredentialAuthentication[] | undefined> {
    return await getStructuredPreferences(CREDENTIALS_PREFERENCES_KEY, true);
}


export async function removeOldCredentialAuthenticationPreferences(): Promise<void> {
    const preferences = await getCredentialAuthenticationPreference();
    if (!preferences) return;
    const now = dayjs().unix();
    const tenMinutesAgo = now - 10 * 60; // 10 minutes ago
    const filteredPreferences = preferences.filter((ca) => ca.timestamp > tenMinutesAgo);
    if (filteredPreferences.length === preferences.length) return; // No old preferences
    await setStructuredPreferences(CREDENTIALS_PREFERENCES_KEY, filteredPreferences, true);
}

