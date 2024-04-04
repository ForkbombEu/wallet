import { isDark } from "./isDark"
import fingerPrintLottie from '$lib/assets/fingerPrintLottie.json?url';
import fingerPrintLottieLight from '$lib/assets/fingerPrintLottieLight.json?url';

export const getLottieAnimation = () => isDark ? fingerPrintLottie : fingerPrintLottieLight