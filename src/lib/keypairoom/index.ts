import type { UserAnswers } from './userQuestions';
import { zencode_exec } from 'zenroom';
import keypairoomClient from '../../../zenflows-crypto/src/keypairoomClient-8-9-10-11-12.zen?raw';
import keypairoomClientRecreateKeys from '../../../zenflows-crypto/src/keypairoomClientRecreateKeys.zen?raw';
import keypairoomGenerateHMAC from '../../../zenflows-crypto/src/keypairoomServer-6-7.zen?raw';
//

export const KEYRING_PREFERENCES_KEY = 'keyring';

export interface Keyring {
	eddsa: string;
	ethereum: string;
	reflow: string;
	bitcoin: string;
	ecdh: string;
}

export interface Keypair {
	seed: string;
	keyring: Keyring;
	ecdh_public_key: string;
	bitcoin_public_key: string;
	eddsa_public_key: string;
	reflow_public_key: string;
	ethereum_address: string;
}

//

const serverSideSalt: string = 'cGlwcG8gY29tZSBzdGE/';

async function zencodeExec<T>(contract: string, data: Record<string, unknown>): Promise<T> {
	const { result } = await zencode_exec(contract, { data: JSON.stringify(data) });
	return JSON.parse(result);
}

export async function generateKeypair(answers: UserAnswers): Promise<Keypair> {
	const HMAC = await generateHMAC(answers.email!);
	console.log(answers);
	return await zencodeExec<Keypair>(keypairoomClient, {
		userChallenges: {
			whereParentsMet: answers.question1,
			nameFirstPet: answers.question2,
			nameFirstTeacher: answers.question3,
			whereHomeTown: answers.question4,
			nameMotherMaid: answers.question5
		},
		username: answers.email!,
		'seedServerSideShard.HMAC': HMAC
	});
}

export async function regenerateKeypair(email: string, seed: string): Promise<Keypair> {
	const HMAC = await generateHMAC(email);
	return await zencodeExec<Keypair>(keypairoomClientRecreateKeys, {
		seed,
		'seedServerSideShard.HMAC': HMAC
	});
}

//

export async function generateHMAC(email: string): Promise<string> {
	const response = await zencodeExec<string>(keypairoomGenerateHMAC, {
		userData: { email: email },
		serverSideSalt
	});
	console.log('hmac', response);
	//@ts-ignore
	return response['seedServerSideShard.HMAC'];
}
