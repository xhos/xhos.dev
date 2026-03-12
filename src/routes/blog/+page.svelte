<svelte:head>
	<title>blog — xhos</title>
</svelte:head>

<script lang="ts">
	let { data } = $props();
</script>

<div class="page-shell">
	<div class="back"><a href="/">← home</a></div>

	<h1>blog</h1>
	<p class="subtitle">notes, writeups, and thinking out loud</p>

	<ul class="post-list">
		{#each data.posts as post}
			<li>
				<a href="/blog/{post.slug}" class="post-link">
					<div class="post-top">
						<span class="post-title">{post.title}</span>
						<span class="post-date">{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })}</span>
					</div>
					{#if post.description}
						<p class="post-desc">{post.description}</p>
					{/if}
				</a>
			</li>
		{/each}
	</ul>
</div>

<style>
	.post-list {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.post-link {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 0.85rem 1rem;
		border-radius: 8px;
		border: 1px solid transparent;
		transition: border-color 0.3s, background 0.3s;
	}

	.post-link:hover {
		border-color: var(--border);
		background: var(--bg-raised);
	}

	.post-top {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1.25rem;
	}

	.post-title {
		font-family: var(--body);
		font-size: 0.92rem;
		font-weight: 500;
		color: var(--text);
		opacity: 0.8;
		transition: color 0.2s, opacity 0.2s;
	}

	.post-link:hover .post-title {
		color: var(--accent);
		opacity: 1;
	}

	.post-date {
		font-family: var(--mono);
		font-size: 0.62rem;
		color: var(--text-dim);
		flex-shrink: 0;
	}

	.post-desc {
		font-size: 0.82rem;
		font-weight: 300;
		color: var(--text-dim);
		line-height: 1.55;
	}

	@media (max-width: 480px) {
		.post-top {
			flex-direction: column;
			gap: 0.15rem;
		}
	}
</style>
