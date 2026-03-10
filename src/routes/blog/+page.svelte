<svelte:head>
	<title>blog — xhos</title>
</svelte:head>

<script lang="ts">
	let { data } = $props();
</script>

<h1>blog</h1>
<p class="subtitle">notes, writeups, and thinking out loud</p>

<ul class="post-list">
	{#each data.posts as post}
		<li>
			<a href="/blog/{post.slug}" class="post-link">
				<span class="post-date">{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })}</span>
				<span class="post-title">{post.title}</span>
			</a>
			{#if post.description}
				<p class="post-desc">{post.description}</p>
			{/if}
		</li>
	{/each}
</ul>

<style>
	h1 {
		font-family: var(--mono);
		font-size: 1rem;
		font-weight: 500;
		color: var(--accent);
		margin-bottom: 0.4rem;
	}

	.subtitle {
		color: var(--text-muted);
		font-size: 0.9rem;
		margin-bottom: 3rem;
	}

	.post-list {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.post-link {
		display: flex;
		align-items: baseline;
		gap: 1.25rem;
		margin-bottom: 0.3rem;
	}

	.post-link:hover .post-title {
		color: var(--accent);
	}

	.post-date {
		font-family: var(--mono);
		font-size: 0.72rem;
		color: var(--text-muted);
		flex-shrink: 0;
		width: 76px;
	}

	.post-title {
		font-size: 0.95rem;
		color: var(--text);
		transition: color 0.15s;
	}

	.post-desc {
		font-size: 0.85rem;
		color: var(--text-muted);
		line-height: 1.6;
		padding-left: calc(76px + 1.25rem);
	}

	@media (max-width: 480px) {
		.post-link {
			flex-direction: column;
			gap: 0.25rem;
		}

		.post-desc {
			padding-left: 0;
		}
	}
</style>
