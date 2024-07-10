import { getCredentialsPreference } from '$lib/preferences/credentials';
import dayjs from 'dayjs';

export const load = async () => {
	const credentialsPreference = await getCredentialsPreference();
	const sortCredentials = () => {
		if (!credentialsPreference || !credentialsPreference.length) return [];
		return credentialsPreference.slice().sort((a: any, b: any) => {
			const currentTime = dayjs().unix();
			const isAExpired = a.expirationDate < currentTime;
			const isBExpired = b.expirationDate < currentTime;

			if (isAExpired && !isBExpired) return 1;
			if (!isAExpired && isBExpired) return -1;
			return a.expirationDate - b.expirationDate;
		});
	};
	return { credentials: sortCredentials() };
};
