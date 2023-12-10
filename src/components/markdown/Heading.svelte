<script>
  export let depth
  export let raw
  export let text

  const kebabCase = string => string
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/[\s_]+/g, '-')
        .toLowerCase();

  let id = kebabCase(text)

</script>

{#if depth === 1}
  <h1 class="text-5xl py-2" {id}><slot></slot></h1>
{:else if depth === 2}
  <h2 class="text-4xl py-2" {id}><slot></slot></h2>
{:else if depth === 3}
  <h3 class="text-3xl py-2" {id}><slot></slot></h3>
{:else if depth === 4}
  <h4 class="text-2xl py-2" {id}><slot></slot></h4>
{:else if depth === 5}
  <h5 class="text-xl py-2" {id}><slot></slot></h5>
{:else if depth === 6}
  <h6 {id}><slot></slot></h6>
{:else}
  {raw}
{/if}
