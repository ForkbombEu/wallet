import { isDark } from '../../isDark';
import fingerPrintLottie from '$lib/assets/lottieFingerPrint/fingerPrintLottie.json?raw';
import fingerPrintLottieLight from '$lib/assets/lottieFingerPrint/fingerPrintLottieLight.json?raw';

export const getLottieAnimation = () =>
	JSON.parse(isDark ? fingerPrintLottie : fingerPrintLottieLight);
