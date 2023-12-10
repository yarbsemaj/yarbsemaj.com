<script>
  export let href = "";
  export let title = undefined;
  export let text = "";
</script>

{#if title}
<figure class="inline-block mb-4">
  <img
    src="{href}"
    class="mb-2 leading-none max-w-full h-auto rounded"
    alt="{text}"
  />
  <figcaption class="text-gray-500">{title}</figcaption>
</figure>
{:else}
<img class="max-w-full h-auto rounded" src={href} {title} alt={text} />
{/if}
