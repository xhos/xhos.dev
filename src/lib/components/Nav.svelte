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
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		height: var(--nav-h);
		padding: 0 2.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: rgba(1, 10, 20, 0.65);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border-bottom: 1px solid rgba(13, 36, 56, 0.7);
	}

	.home {
		font-family: var(--mono);
		font-size: 0.82rem;
		color: var(--accent);
		letter-spacing: 0.04em;
		opacity: 0.85;
		transition: opacity 0.2s;
	}

	.home:hover {
		opacity: 1;
		color: var(--accent);
	}

	.links {
		display: flex;
		gap: 2rem;
	}

	.links a {
		font-family: var(--mono);
		font-size: 0.76rem;
		color: var(--text-muted);
		letter-spacing: 0.04em;
		transition: color 0.2s;
	}

	.links a:hover,
	.links a.active {
		color: var(--text);
	}
</style>
