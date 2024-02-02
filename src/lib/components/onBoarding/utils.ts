import { goto } from "$app/navigation";
import { getPreference, setPreference } from "$lib/preferences";

const ISBOARDED_KEY = 'isBoarded';

export const completeOnBoarding = async ()=>{
    await setPreference(ISBOARDED_KEY, 'true', false)
    goto("/home")
}
export async function isAlreadyBoarded(): Promise<Boolean> {
	const isAlreadyBoardedString = await getPreference(ISBOARDED_KEY, false);
	if (!isAlreadyBoardedString) return false;
	return true
}