<script context="module" lang="ts">
	import Fa from 'svelte-fa';
	import MiniPost from '../../../components/mini-post/MiniPost.svelte';
</script>

<script type="ts">
	import type { PageData } from './$types';
	import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
	export let data: PageData;
	let { posts } = data;
	
</script>

<svelte:head>
	<title>Post List</title>
</svelte:head>

<div class="flex flex-wrap  md:justify-center">
	<div class="relative flex-grow lg:grow-0 max-w-full px-4 lg:w-1/2 pr-4 pl-4 flex-initial">
		<a href="/blog/admin/new" class="text-reset text-decoration-none px-4">
			<div class="p-4 relative text-white text-2xl rounded-3xl text-center bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-3 new-post">
				Create a new post <Fa class="inline" icon={faPlusCircle} />
			</div>
		</a>
		{#each posts as item}
			<MiniPost {...item} admin={true} />
		{/each}
	</div>
</div>