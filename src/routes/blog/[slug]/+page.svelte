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

<article>
	<header>
		<p class="post-date">
			{new Date(data.meta.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
		</p>
		<h1>{data.meta.title}</h1>
		{#if data.meta.description}
			<p class="post-desc">{data.meta.description}</p>
		{/if}
	</header>

	<div class="prose">
		<Component />
	</div>
</article>

<div class="back">
	<a href="/blog">← all posts</a>
</div>

<style>
	article {
		max-width: 100%;
	}

	header {
		margin-bottom: 3rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid var(--border);
	}

	.post-date {
		font-family: var(--mono);
		font-size: 0.75rem;
		color: var(--text-muted);
		margin-bottom: 0.75rem;
	}

	h1 {
		font-family: var(--mono);
		font-size: 1.3rem;
		font-weight: 500;
		color: var(--text);
		line-height: 1.35;
		margin-bottom: 0.75rem;
	}

	.post-desc {
		color: var(--text-muted);
		font-size: 0.95rem;
		line-height: 1.65;
	}

	.back {
		margin-top: 4rem;
		padding-top: 2rem;
		border-top: 1px solid var(--border);
	}

	.back a {
		font-family: var(--mono);
		font-size: 0.8rem;
		color: var(--text-muted);
	}

	.back a:hover {
		color: var(--accent);
	}
</style>
