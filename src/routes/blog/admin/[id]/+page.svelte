<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Fa from 'svelte-fa';
	import { faTrash } from '@fortawesome/free-solid-svg-icons';

	import Post from '../../../../components/post/Post.svelte';
	import { addAlert } from '../../../../stores/alerts';

	export let data;
	let { post } = data;
	let loading = false;

	let id = $page.params.id;
	let isNew = id === 'new';

	async function commit(status) {
		loading = true;
		if (!isNew) {
			await update(status);
		} else {
			await save(status);
		}
		loading = false;
	}
	async function save(status) {
		post.status = status;
		try {
			let response = await (
				await fetch(`/blog/admin.json`, {
					method: 'POST',
					body: JSON.stringify(post),
					headers: { 'content-type': 'application/json' }
				})
			).json();
			if (!response.id) {
				throw 'save-error';
			}
			addAlert('Post Created', 'success');
			goto(`/blog/admin/${response.id}`);
		} catch (e) {
			addAlert('Failed to create post', 'danger');
		}
	}

	async function deletePost() {
		loading = true;
		try {
			await (
				await fetch(`/blog/admin/${id}.json`, {
					method: 'DELETE'
				})
			).json();

			addAlert('Post Removed', 'success');
			goto(`/blog/admin`);
		} catch (e) {
			addAlert('Failed to remove post', 'danger');
		}
		loading = false;
	}

	async function update(status) {
		post.status = status;
		delete post.id;
		delete post.createdDate;
		try {
			let response = await (
				await fetch(`/blog/admin/${id}.json`, {
					method: 'PUT',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify(post)
				})
			).json();
			if (!response.id) {
				throw 'update-error';
			}

			addAlert(`${post.title} Updated`, 'success');
		} catch (e) {
			addAlert('Failed to update post', 'danger');
		}
	}
</script>

<svelte:head>
	<title>Edit:-{post.title}</title>
	<meta name="description" content={post.description} />
</svelte:head>

<div class="flex flex-wrap ">
	<div class="relative flex-grow max-w-full flex-1 px-4">
		<Post {post} />
	</div>
	<div class="relative flex-grow max-w-full flex-1 px-4">
		<form class="flex flex-col h-full">
			<div class="mb-3">
				<label for="imageInput" class="form-label">Title</label>
				<input
					required
					id="imageInput"
					class="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded"
					placeholder="Post title"
					bind:value={post.title}
				/>
			</div>
			<div class="mb-3">
				<label for="imageInput" class="form-label">Short Description</label>
				<textarea required class="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded" bind:value={post.description} />
			</div>
			<div class="mb-3">
				<label for="imageInput" class="form-label">Hero Image</label>
				<input
					required
					id="imageInput"
					class="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded"
					placeholder="https://example.com"
					bind:value={post.image}
				/>
			</div>
			<div class="mb-3 grow flex flex-col">
				<label required for="imageInput" class="form-label">Body</label>
				<textarea class="h-full block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded flex-grow-1" bind:value={post.body} />
			</div>
			<div class="mb-3 flex justify-between">
				{#if loading}
					<div class="spinner-border" role="status">
						<span class="visually-hidden">Loading...</span>
					</div>
				{:else}
					<div class="relative inline-flex align-middle" role="group">
						<button type="button" class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline bg-gray-600 text-white hover:bg-gray-700" on:click={() => commit('draft')}
							>{#if post.status === 'published'}Make Draft{:else}Save Draft{/if}</button
						>
						<button type="button" class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline bg-blue-500 text-white hover:bg-blue-600" on:click={() => commit('published')}
							>{#if post.status === 'published'}
								Update{:else if !isNew}Make Public{:else}Publish{/if}</button
						>
					</div>
					{#if !isNew}
						<button type="button" on:click={deletePost} class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline bg-red-600 text-white hover:bg-red-700">
						<Fa class="inline" icon={faTrash} /> Delete</button
						>
					{/if}
				{/if}
			</div>
		</form>
	</div>
</div>
