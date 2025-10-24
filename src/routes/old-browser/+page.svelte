<script lang="ts">
	import type { TypedItem } from '../../components/typewriter/types';
	import Typewriter from '../../components/typewriter/Typewriter.svelte';
	import background from './old-browser.jpeg'

	import Fa from 'svelte-fa';
	import { faLaptopCode } from '@fortawesome/free-solid-svg-icons';
	import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
	import { onMount } from 'svelte';
	import { check_webp_feature } from '$lib/utils';

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

	onMount(()=>{
		check_webp_feature('lossy', (feature, supported)=>{
			if(supported){
				window.location.href = '/'
			}
		})
	})
</script>

<svelte:head>
	<title>James Bray</title>
	<meta name="description" content="Full Stack Software Developer working in Manchester" />
	<meta name="og:image" content="https://yarbsemaj.com/img/og-image.jpeg" />
	<meta name="robots" content="noindex">
</svelte:head>

<div class="h-screen w-screen flex flex-col justify-center items-center z-10 absolute blur opacity-50">
	<img alt='background' src={background} />
</div>

<div class="h-screen flex flex-col justify-center items-center z-10 relative">
	<div class="text-center px-2">
		<h1
			class="md:text-9xl text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-zinc-100 to-stone-400"
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
			<a
				class="sm:text-8xl text-6xl p-4"
				aria-label="Blog"
				href="/blog"
			>
				<Fa icon={faLaptopCode} />
			</a>
		</div>
	</div>
	<div class="text-center text-sm pb-2 absolute bottom-0">
		Visit this page on a modern browser for additional features.
	</div>
</div>

<style>
	@import url('https://fonts.googleapis.com/css?family=Courier+Prime&display=swap');
	:global(body) {
		background-color: black;
		color: white;
	}
</style>
