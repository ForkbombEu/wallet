const path = require('path');

/** @type { import("eslint").Linter.Config } */
module.exports = {
	root: true,
	extends: [
		// 'eslint:recommended',
		// 'plugin:@typescript-eslint/recommended',
		// 'plugin:svelte/recommended',
		// 'prettier'
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'localization'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte']
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	rules: {
		'localization/check-localization': 'error'
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		}
	]
};
