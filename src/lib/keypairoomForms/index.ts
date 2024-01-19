import QuestionsForm from './QuestionsForm.svelte';
import SeedForm from './SeedForm.svelte';
export { QuestionsForm, SeedForm };

/* */

import { z } from 'zod';
import { UserChallenges as C, type UserChallenge } from '$lib/keypairoom';

//

export const questions: Array<{ id: UserChallenge; text: string }> = [
	{ id: C.whereParentsMet, text: 'Where did your parents meet?' },
	{ id: C.nameFirstPet, text: 'What is the name of your first pet?' },
	{ id: C.whereHomeTown, text: 'What is your home town?' },
	{ id: C.nameFirstTeacher, text: 'What is the name of your first teacher?' },
	{ id: C.nameMotherMaid, text: 'What is the surname of your mother before wedding?' }
];

//

export const answersSchemaError = 'AT_LEAST_THREE_QUESTIONS';

export const answersSchema = z
	.object({
		[C.whereParentsMet]: z.string(),
		[C.nameFirstPet]: z.string(),
		[C.whereHomeTown]: z.string(),
		[C.nameFirstTeacher]: z.string(),
		[C.nameMotherMaid]: z.string()
	})
	.partial()
	.refine((v) => {
		return Object.values(v).filter((v) => Boolean(v)).length >= 3;
	}, answersSchemaError);

//
