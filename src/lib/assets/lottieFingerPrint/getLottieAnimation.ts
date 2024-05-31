import { isDark } from "../../isDark"
import fingerPrintLottie from '$lib/assets/lottieFingerPrint/fingerPrintLottie.json?url';
import fingerPrintLottieLight from '$lib/assets/lottieFingerPrint/fingerPrintLottieLight.json?url';

export const getLottieAnimation = () => isDark ? fingerPrintLottie : fingerPrintLottieLight