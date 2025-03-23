import js from '@eslint/js';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import stylistic from '@stylistic/eslint-plugin-js';

/** @type {import('eslint').Linter.Config[]} */
export default [
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		plugins: { '@stylistic': stylistic },
	},
	{
		files: ['**/*.svelte'],
		languageOptions: { parserOptions: { parser: ts.parser } },
	},
	{
		ignores: ['build/', '.svelte-kit/', 'dist/'],
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			// 'prefer-const': 'error',
			'@stylistic/comma-dangle': ['error', 'always-multiline'],
			'@stylistic/comma-spacing': 'error',
			'@stylistic/array-bracket-spacing': 'error',
			'@stylistic/arrow-parens': 'error',
			'@stylistic/eol-last': 'error',
			'@stylistic/indent': ['error', 'tab', { 'SwitchCase': 1 }],
			'@stylistic/key-spacing': 'error',
			'@stylistic/keyword-spacing': 'error',
			'@stylistic/max-len': ['error', {
				code: 120,
				ignoreTemplateLiterals: true,
				ignoreTrailingComments: true,
				ignoreComments: true,
			}],
			'@stylistic/no-extra-semi': 'error',
			'@stylistic/no-trailing-spaces': 'error',
			'@stylistic/object-curly-spacing': ['error', 'always'],
			'@stylistic/object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
			'@stylistic/quotes': ['error', 'single'],
			'@stylistic/semi': ['error', 'always'],
			'@stylistic/space-in-parens': 'error',
			'@stylistic/space-infix-ops': 'error',
			'@stylistic/spaced-comment': 'error',
			'@stylistic/template-curly-spacing': 'error',
			'@stylistic/no-multiple-empty-lines': ['error', { max: 1 }],
			'@stylistic/no-multi-spaces': 'error',
			'@stylistic/block-spacing': 'error',
			'@stylistic/padded-blocks': ['error', 'never'],

			'svelte/indent': ['error', { indent: 'tab' }],
			'svelte/no-useless-mustaches': 'error',
			'svelte/html-quotes': ['error', { 'prefer': 'double' }],
		},
	},
];
