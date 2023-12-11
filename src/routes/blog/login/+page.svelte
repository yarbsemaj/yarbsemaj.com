<script>
	import { addAlert } from '../../../stores/alerts';
	import { goto } from '$app/navigation';

	let form = {
		uname: '',
		password: ''
	};

	async function login(event) {
		event.preventDefault();
		try {
			let login = await fetch(`/blog/login.json`, {
				method: 'POST',
				body: JSON.stringify({ uname: form.uname, password: form.password }),
				headers: {
					'content-type': 'application/json'
				}
			});
			if (login.status !== 200) {
				throw 'login-error';
			}
			goto('/blog/admin/');
		} catch (e) {
			addAlert('Login Error', 'danger');
		}
	}
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<div class="min-h-full flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
	<div class="max-w-md w-full space-y-8">
		<form class="space-y-6" on:submit={login}>
			<div class="rounded-md shadow-sm -space-y-px">
				<div>
					<label for="username" class="sr-only">Username</label>
					<input
						bind:value={form.uname}
						id="username"
						name="username"
						type="text"
						required
						class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
						placeholder="Username"
					/>
				</div>
				<div>
					<label for="password" class="sr-only">Password</label>
					<input
						id="password"
						name="password"
						type="password"
						required
						class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
						placeholder="Password"
						bind:value={form.password}
					/>
				</div>
			</div>
			<div>
				<button
					type="submit"
					class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
				>
					Sign in
				</button>
			</div>
		</form>
	</div>
</div>
