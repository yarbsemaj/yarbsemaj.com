<script>
  export let ordered
  export let start
</script>

{#if ordered}
  <ol class="list-decimal marker:text-blue-500 py-4 ml-8" {start}><slot></slot></ol>
{:else}
  <ul class="list-disc marker:text-blue-500 py-4 ml-8"><slot></slot></ul>
{/if}
