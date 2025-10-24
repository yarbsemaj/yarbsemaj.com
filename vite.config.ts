import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	assetsInclude: ["**/*.cim"],
	plugins: [tailwindcss(), sveltekit()]
});
