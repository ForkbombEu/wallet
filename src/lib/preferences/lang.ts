import { getPreference, setPreference } from ".";

export const LANG = 'lang';
export async function setLanguagePreference(lang: string) {
    await setPreference(LANG, lang, false);
}
export async function getLanguagePreference() {
    return await getPreference(LANG, false);
}