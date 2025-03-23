import postcssPresetEnv from 'postcss-preset-env';

/** @type {import('postcss-load-config').Config} */
const config = {
	plugins: [
		postcssPresetEnv({
			features: {
				'nesting-rules': true,
			},
		}),
	],
};

export default config;
