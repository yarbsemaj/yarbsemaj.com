<script type="ts">
	import type { PageData } from './$types';

	import Post from '../../../components/post/Post.svelte';
	export let data: PageData;
	let { post } = data;
</script>

<svelte:head>
	<title>{post.title}</title>
	<meta name="description" content={post.description} />
	<meta property="og:image" content={post.image} />
</svelte:head>

<div class="flex flex-wrap  md:justify-center">
	<div class="relative flex-grow max-w-full flex-1 px-4 lg:max-w-[60%] pr-3 pl-3">
		<Post {post} />
	</div>
</div>
