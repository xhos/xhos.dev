<script lang="ts">
	import { page } from '$app/stores';

	const links = [
		{ href: '/blog', label: 'blog' },
		{ href: '/projects', label: 'projects' },
		{ href: '/uses', label: 'uses' }
	];
</script>

<nav>
	<a href="/" class="home">xhos</a>
	<div class="links">
		{#each links as link}
			<a href={link.href} class:active={$page.url.pathname.startsWith(link.href)}>
				{link.label}
			</a>
		{/each}
	</div>
</nav>

<style>
	nav {
		max-width: var(--max-w);
		margin: 0 auto;
		padding: 2.5rem 0 3rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.home {
		font-family: var(--mono);
		font-size: 0.9rem;
		color: var(--accent);
		letter-spacing: 0.02em;
	}

	.home:hover {
		color: var(--accent);
		opacity: 0.75;
	}

	.links {
		display: flex;
		gap: 1.75rem;
	}

	.links a {
		font-family: var(--mono);
		font-size: 0.8rem;
		color: var(--text-muted);
		letter-spacing: 0.02em;
		transition: color 0.15s;
	}

	.links a:hover,
	.links a.active {
		color: var(--text);
	}
</style>
