// import { dev } from '$app/environment';
import { setLogPreference } from './preferences/logs';

const dev = true

export const log = dev ? logAndSave : () => {};

function logAndSave(message: string) {
	const stackTrace = new Error().stack;
	const [, callerInfo] = stackTrace ? stackTrace.split('\n')[2].match(/\((.*)\)/) || [] : [];
	const logMessage = callerInfo ? `${callerInfo}: ${message}` : message;
	console.log(logMessage);
	setLogPreference(logMessage);
}
