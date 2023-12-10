<script lang="ts">
	import SvelteMarkdown from 'svelte-markdown';
	import dayjs from 'dayjs';
	import Blockquote from '../markdown/Blockquote.svelte';
	import Code from '../markdown/Code.svelte';
	import Image from '../markdown/Image.svelte';
	import Table from '../markdown/Table.svelte';
	import Heading from '../markdown/Heading.svelte';
	import Paragraph from '../markdown/Paragraph.svelte';
	import List from '../markdown/List.svelte';
	import Link from '../markdown/Link.svelte';
	import Html from '../markdown/Html.svelte';

	import Fa from 'svelte-fa';
	import { faCalendarDay, faUser } from '@fortawesome/free-solid-svg-icons';
	export let post;

	let renders = {
		image: Image,
		table: Table,
		blockquote: Blockquote,
		code: Code,
		heading: Heading,
		paragraph: Paragraph,
		list: List,
		link: Link,
		html: Html
	};
</script>

<div
	class="relative flex flex-col min-w-0 break-words bg-white mt-2 blog-post rounded-3xl overlay overflow-hidden"
>
	<div
		style="background-image: url('{post.image}'); ;"
		class="card-img-top post-image rounded-t-3xl"
		alt={post.title}
	/>
	<div class="flex-auto p-4">
		<h1 class="mb-3 md:text-5xl text-2xl font-bold">{post.title}</h1>
		<div class="text-gray-700 mb-10">
			<div class="flex justify-between">
				<div><Fa class="inline" icon={faUser} /> James Bray</div>
				<div>
					<Fa class="inline" icon={faCalendarDay} />
					{dayjs(post.createdDate).format('DD MMM YYYY')}
				</div>
			</div>
		</div>
		<p class="mb-0">
			<SvelteMarkdown renderers={renders} source={post.body} />
		</p>
	</div>
</div>

<style type="scss">
	@import './Post.scss';

	.post-image {
		background-position: center;
		background-size: cover;
		background-color: #aaaaaa;
	}
</style>
