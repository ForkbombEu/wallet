import type { Feedback } from './utils/types';
import { writable } from 'svelte/store';

export type VerificationResults = {
	feedback: Feedback;
	date: string;
	id: string;
	success: boolean;
};

export const verificationResultsStore = writable<VerificationResults>();
