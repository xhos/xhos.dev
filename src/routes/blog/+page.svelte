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
		gap: 0.25rem;
	}

	.post-link {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		padding: 0.75rem 1rem;
		border-radius: 10px;
		background: rgba(3, 10, 20, 0.45);
		border: 1px solid transparent;
		transition: background 0.3s, border-color 0.3s, transform 0.2s;
	}

	.post-link:hover {
		background: rgba(5, 15, 28, 0.6);
		border-color: rgba(62, 173, 213, 0.12);
		transform: translateY(-2px);
	}

	.post-top {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1.25rem;
	}

	.post-title {
		font-size: 1rem;
		font-weight: 500;
		color: var(--text);
		transition: color 0.2s;
	}

	.post-link:hover .post-title {
		color: var(--accent);
	}

	.post-date {
		font-family: var(--mono);
		font-size: 0.75rem;
		color: var(--text-dim);
		flex-shrink: 0;
	}

	.post-desc {
		font-size: 0.9rem;
		font-weight: 300;
		color: var(--text-dim);
		line-height: 1.5;
	}

	@media (max-width: 480px) {
		.post-top {
			flex-direction: column;
			gap: 0.15rem;
		}
	}
</style>
