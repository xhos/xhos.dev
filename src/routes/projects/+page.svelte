<svelte:head>
	<title>projects — xhos</title>
</svelte:head>

<script lang="ts">
	const projects = [
		{
			name: 'project-one',
			description: 'A short description of what this does and why it exists.',
			repo: 'https://github.com/xhos/project-one',
			lang: 'go'
		},
		{
			name: 'project-two',
			description: 'Another project. Useful for a specific thing I kept doing manually.',
			repo: 'https://github.com/xhos/project-two',
			lang: 'typescript'
		},
		{
			name: 'project-three',
			description: 'An experiment that turned into something I actually use.',
			repo: 'https://github.com/xhos/project-three',
			lang: 'python'
		}
	];
</script>

<h1>projects</h1>
<p class="subtitle">things I've built or am building</p>

<ul class="project-list">
	{#each projects as project}
		<li>
			<div class="project-header">
				<a href={project.repo} target="_blank" rel="noopener" class="project-name">
					{project.name}
				</a>
				<span class="lang">{project.lang}</span>
			</div>
			<p class="project-desc">{project.description}</p>
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

	.project-list {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 2.25rem;
	}

	.project-header {
		display: flex;
		align-items: baseline;
		gap: 0.75rem;
		margin-bottom: 0.35rem;
	}

	.project-name {
		font-family: var(--mono);
		font-size: 0.9rem;
		color: var(--text);
		border-bottom: 1px solid transparent;
	}

	.project-name:hover {
		color: var(--accent);
		border-bottom-color: color-mix(in srgb, var(--accent) 40%, transparent);
	}

	.lang {
		font-family: var(--mono);
		font-size: 0.7rem;
		color: var(--text-muted);
	}

	.project-desc {
		font-size: 0.9rem;
		color: var(--text-muted);
		line-height: 1.65;
	}
</style>
