<script>
    import hightlight from "highlight.js"
	export let lang;
	export let text;
</script>

<pre class="{lang}"><code class="hljs rounded">{@html hightlight.highlightAuto(text).value}</code></pre>

<style lang="scss">
    @import "highlight.js/styles/hybrid.css"
</style>
