<script lang="ts">
	import ThreeD from '../components/ThreeD.svelte';
	import type { TypedItem } from '../components/typewriter/types';
	import Typewriter from '../components/typewriter/Typewriter.svelte';

	import Fa from 'svelte-fa';
	import { faLaptopCode } from '@fortawesome/free-solid-svg-icons';
	import { faGithub, faLinkedin, faMastodon } from '@fortawesome/free-brands-svg-icons';
	import { onMount } from 'svelte';
	import { check_webp_feature } from '$lib/utils';
	import Keyboard from '../components/keyboard/Keyboard.svelte';

	let inputKey: (key: string) => void;

	let showKeyboard = false;

	let typedLines: Array<TypedItem> = [
		{ text: 'React' },
		{ text: 'PHP' },
		{ text: 'SQL' },
		{ text: 'Svelte' },
		{ text: 'Z80 Assembly', url: 'https://z80.yarbsemaj.com' },
		{ text: 'NodeJS' },
		{ text: 'Serverless' },
		{ text: 'Dynamodb' },
		{ text: 'Lambda' },
		{ text: 'CDK' },
		{ text: 'AngularJS' },
		{ text: 'Tiny CPU ASM', url: 'https://tiny-cpu-emu.yarbsemaj.com' },
		{ text: 'Javascript' },
		{ text: 'Java' },
		{ text: 'Tailwindcss' }
	];

	onMount(() => {
		check_webp_feature('lossy', (feature, supported) => {
			if (!supported) {
				window.location.href = '/old-browser';
			}
		});
	});
</script>

<svelte:head>
	<title>James Bray</title>
	<meta name="description" content="Full Stack Software Developer working in Manchester" />
	<meta name="og:image" content="https://yarbsemaj.com/img/og-image.jpeg" />
	<link rel="preload" as="image" href="/img/loader.webp" />
	<link
		rel="preload"
		as="font"
		type="font/woff2"
		href="/fonts/Windows-Command-Prompt.woff2"
		crossorigin="anonymous"
	/>
</svelte:head>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	on:click={() => {
		showKeyboard = !showKeyboard;
	}}
>
	<ThreeD bind:inputKey />
</div>
<div
	class="bg-black z-20 fixed bottom-0 left-0 right-0 top-0 flex flex-col justify-between {showKeyboard
		? 'block md:hidden'
		: 'hidden'}"
>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		class="pt-10"
		id="emuScreen"
		on:click={() => {
			showKeyboard = !showKeyboard;
		}}
	/>
	<div class="">
		{#if showKeyboard}
			<Keyboard keyPress={inputKey} />
		{/if}
	</div>
</div>

<div class="h-screen flex flex-col justify-center items-center z-10 relative">
	<div class="text-center px-2">
		<h1
			class="md:text-9xl text-6xl font-extrabold text-transparent bg-clip-text bg-linear-to-br from-zinc-100 to-stone-400"
		>
			Hello there!
		</h1>
		<div class="md:text-2xl text-xl">
			I'm James, a Full Stack Software Engineer based in Manchester.
		</div>
		<div class="my-6 md:my-10">
			<Typewriter className="sm:text-6xl text-3xl font-bold font-mono" {typedLines} />
		</div>

		<div class="flex justify-center sm:gap-10 gap-2">
			<a aria-label="Github" class="sm:text-8xl text-6xl p-4" href="https://github.com/yarbsemaj">
				<Fa icon={faGithub} />
			</a>
			<a
				aria-label="Linkedin"
				class="sm:text-8xl text-6xl p-4"
				href="https://www.linkedin.com/in/yarbsemaj"
			>
				<Fa icon={faLinkedin} />
			</a>
			<a class="sm:text-8xl text-6xl p-4" aria-label="Blog" href="https://blog.yarbsemaj.com">
				<Fa icon={faLaptopCode} />
			</a>
			<a
				class="sm:text-8xl text-6xl p-4"
				rel="me"
				aria-label="Mastodon"
				href="https://me.bray.im/@james"
			>
				<Fa icon={faMastodon} />
			</a>
		</div>
	</div>
	<div class="text-center text-sm pb-2 absolute bottom-0 text-gray-400">
		<a class="underline" href="https://skfb.ly/ou69O">Retro computer model by Urpo, </a> modify by James
		Bray
	</div>
</div>

<style>
	@import url('https://fonts.googleapis.com/css?family=Courier+Prime&display=swap');
	:global(body) {
		background-color: black;
		color: white;
	}
</style>
