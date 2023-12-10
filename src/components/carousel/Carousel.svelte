<script>
	import CarouselWrapper from './CarouselWrapper.svelte';
	import CarouselItem from './CarouselItem.svelte';

	import Fa from 'svelte-fa';
	import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

	export let items;
</script>

<CarouselWrapper perPage={1} easing="cubic-bezier(.17,.67,.32,1.34)">
	{#each items as items, index (index)}
		<CarouselItem {...items} />
	{/each}
	<div
		class="invisible sm:visible opacity-40 hover:opacity-100 transition-opacity w-10 h-10 rounded-full text-white bg-blue-700 hover:bg-blue-800 flex justify-center items-center"
		slot="left-control"
	>
		<Fa icon={faArrowLeft} />
	</div>
	<div
		class="invisible sm:visible opacity-40 hover:opacity-100 transition-opacity w-10 h-10 rounded-full text-white bg-blue-700 hover:bg-blue-800 flex justify-center items-center"
		slot="right-control"
	>
		<Fa icon={faArrowRight} />
	</div>
</CarouselWrapper>
