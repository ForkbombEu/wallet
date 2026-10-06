import typescriptEslint from '@typescript-eslint/eslint-plugin';
import localization from 'eslint-plugin-localization';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import parser from 'svelte-eslint-parser';

export default [
	{
		ignores: [
			'**/.DS_Store',
			'**/node_modules',
			'build',
			'.svelte-kit',
			'package',
			'**/.env',
			'**/.env.*',
			'!**/.env.example',
			'**/pnpm-lock.yaml',
			'**/package-lock.json',
			'**/yarn.lock',
			'**/static/components/**',
			'android/app/src/main/assets/public/**',
			'ios/App/App/public/**',
			'ios/App/Pods/**',
			'src/paraglide/**',
			'didroom-components/**'
		]
	},
	{
		plugins: {
			'@typescript-eslint': typescriptEslint,
			localization
		},

		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			},

			parser: tsParser,
			ecmaVersion: 2020,
			sourceType: 'module',

			parserOptions: {
				extraFileExtensions: ['.svelte']
			}
		},

		rules: {
			'localization/check-localization': 'error'
		}
	},
	{
		files: ['**/*.svelte'],

		languageOptions: {
			parser: parser,
			ecmaVersion: 5,
			sourceType: 'script',

			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		}
	}
];
