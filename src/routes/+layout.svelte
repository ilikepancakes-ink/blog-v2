<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="https://ilikepancakes.ink/favicon-16x16.png" />
</svelte:head>

{@render children()}
