<script>
	import Footer from '../../components/footer/Footer.svelte';
	import AlertList from '../../components/alerts/AlertList.svelte';
	import { afterUpdate } from 'svelte';

	let isLogedIn = false;
	afterUpdate(async () => {
		const res = await fetch('/blog/login.json');
		isLogedIn = (await res.json()).isLogedIn;
	});
</script>

<div class="bg-slate-50 min-h-screen text-slate-900">
	<div class="container mx-auto sm:px-4">
		<div class="flex flex-wrap  md:justify-center">
			<AlertList />

			<div class="relative flex-grow max-w-full flex-1 py-4 px-4 lg:w-3/5 pr-4 pl-4 mt-3">
				<a
					data-sveltekit-preload-data="hover"
					class="text-reset text-decoration-none"
					href={isLogedIn ? '/blog/admin' : '/blog/'}
				>
					<h1 class="sm:text-7xl text-4xl py-2 text-center font-extrabold text-transparent bg-clip-text bg-gradient-to-r bg-gradient-to-r from-gray-900 to-gray-600">
						James' Dev Blog <img
							class="inline"
							style="height: 1em; width: 1em"
							alt="logo"
							src={'/img/logo.svg'}
						/>
					</h1>
				</a>
			</div>
		</div>
		<main>
			<slot />
		</main>
		<Footer {isLogedIn} />
	</div>
</div>
