import type { Feedback } from './utils/types';
import { writable } from 'svelte/store';

export type VerificationResults = {
	feedback: Feedback;
	date: string;
	id: string;
	success: boolean;
};

export type VerificationResponse = {
	complete_transaction_id: string;
	output: Array<string>;
	transaction_result: Array<{
		path: Array<string>;
		value: string;
	}>;
};
  

export const verificationResultsStore = writable<VerificationResults>();
