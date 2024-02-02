import { goto } from "$app/navigation";
import { getPreference, setPreference } from "$lib/preferences";

export const isAlreadyBoarded = getPreference("isBoarded", false);
export const completeOnBoarding = ()=>{
    setPreference('isBoarded', 'true', true)
    goto("/home")
}