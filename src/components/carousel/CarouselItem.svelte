<script type="ts">
    export let imageUrl: string;
    export let description: string;
</script>

<div class="m-3 rounded-3xl overflow-hidden shadow-lg">
	<div>
		<img src={imageUrl} alt={description} />
	</div>
	<div class="m-6">
		{@html description}
	</div>
</div>