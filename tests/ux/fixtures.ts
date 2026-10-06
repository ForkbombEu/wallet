import { test as base, expect } from '@playwright/test';

const user = {
	id: 'ux-synthetic',
	name: 'Review Person',
	email: 'review@example.test',
	avatar: ''
};
const service = {
	id: 'synthetic-service',
	display_name: 'Proof of age',
	type_name: 'proof_of_age',
	logo: '',
	credential_issuer: 'synthetic-issuer',
	expand: {
		credential_issuer: { name: 'Example issuer', endpoint: 'https://issuer.example.test' },
		organization: { name: 'Example organization' }
	}
};
const credential = {
	id: 1,
	type: 'ldp_vc',
	display_name: 'Proof of age',
	issuer: 'Example issuer',
	description: 'Synthetic credential',
	issuerUrl: 'https://issuer.example.test',
	expirationDate: 1893456000,
	logo: {},
	verified: false,
	ldpVc: {
		credentialSubject: { age_over_18: true },
		type: ['VerifiableCredential', 'proof_of_age']
	}
};
const selection = {
	credentials: [
		{
			required: true,
			claims: [
				[
					[
						'proof_of_age',
						[
							{
								issuer: 'Example issuer',
								type: ['VerifiableCredential', 'proof_of_age'],
								logo: '',
								claims: { age_over_18: true }
							}
						],
						['synthetic-signed-credential']
					]
				]
			]
		}
	],
	verifier: 'https://recipient.example.test/presentation'
};

export const test = base.extend({
	page: async ({ page }, use, testInfo) => {
		const errors: string[] = [];
		page.on('pageerror', (error) => errors.push(error.message));
		page.on('console', (message) => {
			if (message.type() === 'error') errors.push(message.text());
		});
		await page.addInitScript(() => {
			localStorage.clear();
			localStorage.setItem('CapacitorStorage.isBoarded', 'true');
		});
		// Do not contact an account, issuer or verifier. Only the local Vite server is real.
		await page.route('**/*', (route) => {
			if (new URL(route.request().url()).origin === 'http://127.0.0.1:4187')
				return route.continue();
			return route.fulfill({ status: 200, contentType: 'application/json', body: '{"items":[]}' });
		});
		await page.route('**/src/routes/**', (route) => {
			const path = decodeURIComponent(new URL(route.request().url()).pathname);
			let body: string | undefined;
			if (path === '/src/routes/[[lang]]/(protected)/+layout.ts') {
				body = `export const _protectedLayoutKey = 'load:protected-layout'; export const load = async () => ({hasHomeFeedback:false,notReadedActivities:0});`;
			} else if (path.endsWith('/(protected)/wallet/+page.ts')) {
				body = `export const load = async ({url}) => ({credentials:url.searchParams.has('filled') ? [${JSON.stringify(credential)}] : []});`;
			} else if (path.endsWith('/(protected)/home/+page.ts')) {
				body = `export const load = async () => ({services:[${JSON.stringify(service)}]});`;
			} else if (path.endsWith('/(protected)/profile/+page.ts')) {
				body = `export const load = async () => (${JSON.stringify({ user, orgs: [], did: { didDocument: { id: 'did:example:synthetic' } } })});`;
			} else if (path.endsWith('/(protected)/verification/select-credential/+page.ts')) {
				body = `
					import { verificationStore } from '/src/lib/verificationStore.ts';
					export const load = async ({url}) => {
						verificationStore.set({post_url:'https://recipient.example.test/presentation',state:'synthetic-state',vps:[]});
						return {...${JSON.stringify(selection)},credentials:url.searchParams.has('empty') ? [] : ${JSON.stringify(selection.credentials)}};
					};`;
			}
			return body
				? route.fulfill({ contentType: 'application/javascript', body })
				: route.continue();
		});
		await page.route('**/src/lib/components/organisms/scanner/tools.ts*', (route) => {
			if (new URL(route.request().url()).searchParams.has('ux-original')) return route.continue();
			return route.fulfill({
				contentType: 'application/javascript',
				body: `
					export * from '/src/lib/components/organisms/scanner/tools.ts?ux-original';
					export const verifyCredential = async payload => {
						window.__uxPresentations ||= [];
						window.__uxPresentations.push(payload);
						return {result:{result:{status:'200',result:{complete_transaction_id:'synthetic-transaction'}}},logs:''};
					};`
			});
		});
		await use(page);
		await testInfo.attach('browser-errors', {
			body: Buffer.from(JSON.stringify(errors)),
			contentType: 'application/json'
		});
	}
});

export { expect };
