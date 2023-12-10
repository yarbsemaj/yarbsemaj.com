<script lang="ts">
    import MiniPost from "../../components/mini-post/MiniPost.svelte";
	export let data;
	let {posts} = data;
</script>

<svelte:head>
	<title>James Dev Blog</title>
	<meta name="description" content="A blog for all things techy." />
</svelte:head>

<div class="flex flex-wrap  md:justify-center">
	<div class="relative flex-grow lg:grow-0 max-w-full px-4 lg:w-1/2 pr-4 pl-4 flex-initial">
		{#each posts as item}
			<MiniPost {...item} />
		{/each}
	</div>
</div>
