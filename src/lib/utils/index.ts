import { Directory, Filesystem } from '@capacitor/filesystem';
import type { Feedback } from './types';
import { log } from '$lib/log';

export function toggleDarkMode() {
	document.body.classList.toggle('dark');
}

/**
 * @param feedback - The feedback message to display
 * @param message - The additional message to display in show more
 * @returns A feedback object
 * @example
 * positiveFeedback('Feedback message', 'Additional message');
 * // returns { type: 'success', feedback: 'Feedback message', message: 'Additional message' }
 **/
export function positiveFeedback(feedback: string, message?: string): Feedback {
	return {
		type: 'success',
		feedback,
		message
	};
}

/**
 * @param feedback - The feedback message to display
 * @param message - The additional message to display in show more
 * @returns A feedback object
 * @example
 * negativeFeedback('Feedback message', 'Additional message');
 * // returns { type: 'error', feedback: 'Feedback message', message: 'Additional message' }
 **/
export function negativeFeedback(feedback: string, message?: string): Feedback {
	return {
		type: 'error',
		feedback,
		message
	};
}


export const clearHttpStorage = async () => {
	try {
		const result = await Filesystem.readdir({
			path: 'HTTPStorages/com.didroom.wallet/',
			directory: Directory.Library
		});

		const httpStorageFiles = result.files.filter((file) =>
			file.name.includes('httpstorages.sqlite')
		);

		for (const file of httpStorageFiles) {
			await Filesystem.deleteFile({
				path: `HTTPStorages/com.didroom.wallet/${file.name}`,
				directory: Directory.Library
			});
		}
	} catch (error) {
		log(String(error));
	}
};
