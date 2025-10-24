import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	assetsInclude: ["**/*.cim"],
	plugins: [sveltekit()]
});
