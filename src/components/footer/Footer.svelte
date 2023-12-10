<script>
	import { goto } from '$app/navigation';
	let date = new Date();

	export let isLogedIn = false;

	async function logout() {
		await fetch(`/blog/login.json`, {
			method: 'DELETE'
		});
	    goto('/blog/');
	}
</script>

<div class="flex flex-wrap  justify-center mt-3 text-center">
	<div class="login-footer">
		<div class="text-center">
			<a data-sveltekit-preload-data="hover" class="text-reset text-decoration-none" href="/"
				><span>&copy; James Bray {date.getFullYear()}</span></a
			>
			{#if isLogedIn}
				<div style="cursor: pointer;" class="text-center text-gray-700 mb-2" on:click={() => logout()}>
					Logout
				</div>
			{:else}
				<a data-sveltekit-preload-data="hover" class="text-reset text-decoration-none" href="/blog/login">
					<div class="text-center text-gray-700 mb-2">Login</div>
				</a>
			{/if}
		</div>
	</div>
</div>
