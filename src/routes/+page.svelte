<svelte:head>
	<title>xhos</title>
</svelte:head>

<section class="bio">
	<p class="handle">xhos</p>
	<p class="tagline">
		Building things in public. Open source, homelab, and the occasional rabbit hole.
		Based somewhere with bad weather and good coffee.
	</p>
</section>

<section class="links">
	<div class="link-group">
		<span class="group-label">here</span>
		<a href="/projects">projects</a>
		<a href="/blog">blog</a>
		<a href="/uses">uses</a>
	</div>
	<div class="link-group">
		<span class="group-label">elsewhere</span>
		<a href="https://github.com/xhos" target="_blank" rel="noopener">github</a>
	</div>
</section>

<style>
	.bio {
		margin-bottom: 3.5rem;
	}

	.handle {
		font-family: var(--mono);
		font-size: 1.1rem;
		color: var(--accent);
		margin-bottom: 1rem;
	}

	.tagline {
		color: var(--text-muted);
		font-size: 1rem;
		max-width: 480px;
		line-height: 1.75;
	}

	.links {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.link-group {
		display: flex;
		align-items: baseline;
		gap: 1.5rem;
	}

	.group-label {
		font-family: var(--mono);
		font-size: 0.72rem;
		color: var(--text-muted);
		width: 64px;
		flex-shrink: 0;
	}

	.link-group a {
		font-family: var(--mono);
		font-size: 0.85rem;
		color: var(--text);
		opacity: 0.7;
	}

	.link-group a:hover {
		opacity: 1;
		color: var(--accent);
	}
</style>
