import preprocess from 'svelte-preprocess';
import serverless from '@yarbsemaj/adapter-lambda';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess({
		postcss: true,
	}),


	kit: {
		adapter: serverless(),
	},

};

export default config;
