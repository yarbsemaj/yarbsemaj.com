<script>
	import Carousel from '../carousel/Carousel.svelte';

	export let text;

	let carouselsRegx = /<carousel>(.|\n)*?<\/carousel>/g;

	let carousells = text.match(carouselsRegx) || [];
	text = text.replace(carouselsRegx, '');

	carousells = carousells.map((carousel) => {
		carousel = carousel.replace('<carousel>', '');
		carousel = carousel.replace('</carousel>', '');
		try {
			return JSON.parse(carousel);
		} catch (e) {
			return e.toString();
		}
	});
</script>

{@html text}

{#each carousells as carousellItems}
	{#if typeof carousellItems === 'string'}
		{carousellItems}
	{:else}
		<Carousel items={carousellItems} />
	{/if}
{/each}
