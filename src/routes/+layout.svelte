<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import Scrollbar from '$lib/components/Scrollbar.svelte';
	import Lightbox from '$lib/components/Lightbox.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/favicon.ico" />
</svelte:head>

<div id="site-content" class="site" class:inner={$page.url.pathname !== '/'}>
	{@render children()}
</div>
{#if browser}<Scrollbar />{/if}
<Lightbox />

<style>
	.inner {
		background:
			radial-gradient(ellipse 80% 40% at 50% 0%, #051830 0%, transparent 100%),
			linear-gradient(180deg, #020c18 0%, #010810 40%, #000406 100%);
		min-height: 100vh;
	}
</style>
