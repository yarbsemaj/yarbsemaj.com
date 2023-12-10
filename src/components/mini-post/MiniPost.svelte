<script>
	import dayjs from 'dayjs';
	export let id;
	export let title;
	export let description;
	export let image;
	export let createdDate;
	export let status;

	export let admin = false;
</script>

<a data-sveltekit-preload-data="hover" class="text-center text-decoration-none" href={`/blog/${admin ? 'admin/' : ''}${id}`}>
	<div class={`grid place-items-center h-fit overlay rounded-3xl ${status === 'draft' ? 'bg-amber-200' : 'bg-white'} border-solid h-fit w-full mb-9 inline-block`}>
		<div style="background-image: url('{image}');" class="rounded-t-3xl card-img-top w-full" alt={title} />
		<div class="flex-auto py-6 px-1">
			<h4 class="text-3xl">{title}</h4>
			<p class="">
				{description}
			</p>
		</div>
		<div class="py-3 px-6 border-t-1 text-center">
			{dayjs(createdDate).format('DD MMM YYYY')}
		</div>
	</div>
</a>

<style type="scss">
	@import './MiniPost.scss';

	.card-img-top {
		background-position: center;
		background-size: cover;
		background-color: #aaaaaa;
	}
</style>
