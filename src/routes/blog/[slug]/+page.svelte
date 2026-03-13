<script lang="ts">
	let { data } = $props();
	const Component = $derived(data.content);
</script>

<svelte:head>
	<title>{data.meta.title} — xhos</title>
	{#if data.meta.description}
		<meta name="description" content={data.meta.description} />
	{/if}
</svelte:head>

<div class="page-shell">
	<div class="back"><a href="/blog">← all posts</a></div>

	<article>
		<header>
			<time class="post-date">
				{new Date(data.meta.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
			</time>
			<h1>{data.meta.title}</h1>
			{#if data.meta.description}
				<p class="post-desc">{data.meta.description}</p>
			{/if}
		</header>

		<div class="prose">
			<Component />
		</div>
	</article>
</div>

<style>
	header {
		margin-bottom: 3rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid var(--border);
	}

	.post-date {
		font-family: var(--mono);
		font-size: 0.68rem;
		color: var(--text-dim);
		letter-spacing: 0.04em;
		display: block;
		margin-bottom: 0.75rem;
	}

	h1 {
		font-family: var(--display);
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--text);
		line-height: 1.3;
		margin-bottom: 0.75rem;
	}

	.post-desc {
		font-family: var(--body);
		font-weight: 300;
		color: var(--text-dim);
		font-size: 0.92rem;
		line-height: 1.6;
	}
</style>
