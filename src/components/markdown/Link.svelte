<script>
  export let href = ''
  export let title = undefined
</script>

<a class="underline" {href} {title}><slot></slot></a>
