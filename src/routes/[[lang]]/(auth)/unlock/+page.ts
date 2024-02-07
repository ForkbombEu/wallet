import { BiometricAuth } from '@aparajita/capacitor-biometric-auth';

export const load = async () => {
	const biometryCheckResult = await BiometricAuth.checkBiometry();
	return { biometryCheckResult };
};
