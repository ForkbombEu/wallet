import keypairoomGenerateHMAC from '../../../zenflows-crypto/src/keypairoomServer-6-7.zen?raw';
import keypairoomClient from '../../../zenflows-crypto/src/keypairoomClient-8-9-10-11-12.zen?raw';
import keypairoomClientRecreateKeys from '../../../zenflows-crypto/src/keypairoomClientRecreateKeys.zen?raw';
import { zencodeExec } from './zencode';
import type { ValueOf } from '$lib/utils/types';
import _ from 'lodash';

//

const SERVER_SIDE_SALT: string = 'cGlwcG8gY29tZSBzdGE/';

const HMAC_KEY = 'seedServerSideShard.HMAC';

/* - HMAC generation - */

export async function generateHMAC(email: string): Promise<string> {
	const response = await zencodeExec<KeypairoomGenerateHMACData, KeypairoomGenerateHMACOutput>(
		keypairoomGenerateHMAC,
		{
			userData: { email },
			serverSideSalt: SERVER_SIDE_SALT
		}
	);
	return response[HMAC_KEY];
}

type KeypairoomGenerateHMACData = {
	userData: { email: string };
	serverSideSalt: string;
};

type KeypairoomGenerateHMACOutput = { [HMAC_KEY]: string };

/* - Keypair generation - */

export async function generateKeypair(
	email: string,
	answers: UserChallengesAnswers
): Promise<Keypair> {
	const HMAC = await generateHMAC(email);
	return await zencodeExec<KeypairoomClientData, KeypairoomClientOutput>(keypairoomClient, {
		userChallenges: answers,
		username: email,
		[HMAC_KEY]: HMAC
	});
}

type KeypairoomClientData = {
	userChallenges: UserChallengesAnswers;
	username: string;
	[HMAC_KEY]: string;
};

type KeypairoomClientOutput = Keypair;

/* - Keypair regeneration - */

export async function regenerateKeypair(email: string, seed: string): Promise<Keypair> {
	const HMAC = await generateHMAC(email);
	return await zencodeExec<RegenerateKeypairData, RegenerateKeypairOutput>(
		keypairoomClientRecreateKeys,
		{
			seed,
			[HMAC_KEY]: HMAC
		}
	);
}

type RegenerateKeypairData = {
	seed: string;
	[HMAC_KEY]: string;
};

type RegenerateKeypairOutput = Keypair;

/* - Type definitions - */

// Keypair generation - Input

export const UserChallenges = {
	whereParentsMet: 'whereParentsMet',
	nameFirstPet: 'nameFirstPet',
	nameFirstTeacher: 'nameFirstTeacher',
	whereHomeTown: 'whereHomeTown',
	nameMotherMaid: 'nameMotherMaid'
} as const;

export type UserChallenge = ValueOf<typeof UserChallenges>;

export type UserChallengesAnswers = Record<UserChallenge, string | 'null'>;

// Keypair generation - Output

export type Keyring = {
	eddsa: string;
	ethereum: string;
	reflow: string;
	bitcoin: string;
	ecdh: string;
	es256: string;
};

export type Keypair = {
	seed: string;
	keyring: Keyring;
	ecdh_public_key: string;
	bitcoin_public_key: string;
	eddsa_public_key: string;
	reflow_public_key: string;
	es256_public_key: string;
	ethereum_address: string;
};

export type PublicKeys = Omit<Keypair, 'keyring' | 'seed'>;

export function getPublicKeysFromKeypair(keypair: Keypair): PublicKeys {
	const keypair_clone = _.cloneDeep(keypair);
	_.unset(keypair_clone, 'seed');
	_.unset(keypair_clone, 'keyring');
	return keypair_clone;
}
