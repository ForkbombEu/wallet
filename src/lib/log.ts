// import { dev } from '$app/environment';
import { setLogPreference } from './preferences/logs';

const dev = true;

export const log = dev ? logAndSave : () => {};

async function logAndSave(message: string) {
	const stackTrace = new Error().stack;
	let callerInfo = '';

	if (stackTrace) {
		const stackLines = stackTrace.split('\n');
		for (let i = 2; i < stackLines.length; i++) {
			const match = stackLines[i].match(/at\s+(.*)\s+\((.*):(\d+):(\d+)\)/);
			if (match) {
				const functionName = match[1];
				const fileName = match[2]?.replace(/^.*\/\/[^/]+/, '');
				const lineNumber = match[3];
				const columnNumber = match[4];
				callerInfo = `${functionName} (${fileName}:${lineNumber}:${columnNumber})`;
				break; 
			}
		}
	}
	const logMessage = callerInfo ? `${callerInfo}: ${message}` : message;
	console.log(logMessage);
	await setLogPreference(logMessage);
}
