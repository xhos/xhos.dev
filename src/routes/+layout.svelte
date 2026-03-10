<script lang="ts">
	import '../app.css';
	import Nav from '$lib/components/Nav.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/favicon.ico" />
</svelte:head>

<Nav />

<main>
	{@render children()}
</main>

<footer>
	<span>xhos</span>
</footer>

<style>
	main {
		max-width: var(--max-w);
		margin: 0 auto;
		padding-bottom: 6rem;
	}

	footer {
		max-width: var(--max-w);
		margin: 0 auto;
		padding: 2rem 0 3rem;
		border-top: 1px solid var(--border);
		font-family: var(--mono);
		font-size: 0.75rem;
		color: var(--text-muted);
	}
</style>
