import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [
		vitePreprocess(),
	],

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
		alias: {
			$components: 'src/lib/components',
			$types: 'src/lib/types',
			$stores: 'src/lib/stores',
			$globalStyles: 'src/lib/globalStyles',
			$apps: 'src/lib/components/apps',
			'$app.constants': 'src/lib/app.constants',
			'$windowsData': 'src/lib/windowsData',
			$icons: 'src/lib/icons',
			$utils: 'src/lib/utils',
			$actions: 'src/lib/actions',
			$contexts: 'src/lib/contexts',
		},
	},
	extensions: ['.svelte', '.md'],
};

export default config;
