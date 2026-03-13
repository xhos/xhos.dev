<script lang="ts">
	import { slide } from 'svelte/transition';
	import { SiGithub } from '@icons-pack/svelte-simple-icons';
	import { projects, langColor } from '$lib/projects';
	import Screenshots from '$lib/components/Screenshots.svelte';

	let expandedProject = $state<string | null>(null);
	function toggleProject(name: string) {
		expandedProject = expandedProject === name ? null : name;
	}
</script>

<svelte:head>
	<title>projects — xhos</title>
</svelte:head>

<div class="page-shell">
	<div class="back"><a href="/">← home</a></div>

	<h1>projects</h1>
	<p class="subtitle">things i've built or am building</p>

	<ul class="card-list">
		{#each projects as project}
			{@const open = expandedProject === project.name}
			<li>
				<div
					class="card"
					class:open
					role="button"
					tabindex="0"
					onclick={() => toggleProject(project.name)}
					onkeydown={(e) => e.key === 'Enter' && toggleProject(project.name)}
				>
					<div class="card-row">
						<span class="card-title mono">{project.name}</span>
						<div class="card-row-right">
							<span class="card-lang">
								<span class="lang-dot" style="background: {langColor[project.lang] ?? 'var(--accent)'}"></span>
								{project.lang}
							</span>
							<span class="chevron" class:rotated={open}>›</span>
						</div>
					</div>
					<span class="card-desc">{project.description}</span>

					{#if open}
						<div class="card-expanded" transition:slide={{ duration: 220 }}>
							{#if project.screenshots.length > 0}
								<Screenshots screenshots={project.screenshots} name={project.name} />
							{/if}
							<p class="card-details">{project.details}</p>
							<a
								href={project.repo}
								target="_blank"
								rel="noopener"
								class="repo-link"
								onclick={(e) => e.stopPropagation()}
							>
								<SiGithub size={13} /> view on github
							</a>
						</div>
					{/if}
				</div>
			</li>
		{/each}
	</ul>
</div>

<style>
	.card-list {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.card {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		padding: 0.75rem 1rem;
		border-radius: 10px;
		background: rgba(3, 10, 20, 0.45);
		border: 1px solid transparent;
		cursor: pointer;
		user-select: none;
		transition: background 0.3s, border-color 0.3s, transform 0.2s;
	}

	.card:hover,
	.card.open {
		background: rgba(5, 15, 28, 0.6);
		border-color: rgba(62, 173, 213, 0.12);
	}

	.card:hover { transform: translateY(-2px); }
	.card.open  { transform: none; cursor: default; }

	.card-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 1rem;
	}

	.card-row-right {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		flex-shrink: 0;
	}

	.card-title {
		font-size: 1rem;
		font-weight: 500;
		color: var(--text);
		transition: color 0.2s;
	}

	.card-title.mono { font-family: var(--mono); }
	.card:hover .card-title { color: var(--accent); }

	.card-lang {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-family: var(--mono);
		font-size: 0.75rem;
		color: var(--text-dim);
		flex-shrink: 0;
	}

	.lang-dot {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.chevron {
		font-size: 1rem;
		color: var(--text-dim);
		line-height: 1;
		display: inline-block;
		transition: transform 0.2s;
	}
	.chevron.rotated { transform: rotate(90deg); }

	.card-desc {
		font-size: 0.9rem;
		font-weight: 300;
		color: var(--text-dim);
		line-height: 1.5;
	}

	.card-expanded {
		margin-top: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		overflow: hidden;
	}

	.screenshots {
		display: flex;
		gap: 0.5rem;
		overflow-x: auto;
		border-radius: 6px;
	}

	.screenshots img {
		height: 120px;
		width: auto;
		border-radius: 6px;
		object-fit: cover;
		flex-shrink: 0;
	}

	.card-details {
		font-size: 0.88rem;
		font-weight: 300;
		color: var(--text-dim);
		line-height: 1.6;
		border-top: 1px solid rgba(62, 173, 213, 0.08);
		padding-top: 0.6rem;
	}

	.repo-link {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		font-family: var(--mono);
		font-size: 0.75rem;
		color: var(--text-dim);
		transition: color 0.2s;
		width: fit-content;
	}
	.repo-link:hover { color: var(--accent); }
</style>
