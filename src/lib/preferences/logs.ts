import { getStructuredPreferences, setStructuredPreferences } from '.';
import dayjs from 'dayjs';

//

export const LOGS_PREFERENCES_KEY = 'logs';

export type Log = {
	date: number;
	message: string;
};

const getNow = async () => {
	return dayjs().valueOf();
};

export async function setLogPreference(message: string): Promise<Log> {
	const logs = await getLogsPreference();
	const date = await getNow();
	const c = {
		message,
		date
	};
	if (logs) {
		logs.push(c);
		await setStructuredPreferences(LOGS_PREFERENCES_KEY, logs);
		return c;
	}

	await setStructuredPreferences(LOGS_PREFERENCES_KEY, [c]);
	return c;
}

export async function getLogsPreference(): Promise<Log[] | undefined> {
	return await getStructuredPreferences(LOGS_PREFERENCES_KEY);
}

export async function clearLogsPreferences(): Promise<void> {
	await setStructuredPreferences(LOGS_PREFERENCES_KEY, []);
}