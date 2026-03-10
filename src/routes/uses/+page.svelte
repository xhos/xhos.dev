<svelte:head>
	<title>uses — xhos</title>
</svelte:head>

<script lang="ts">
	const sections = [
		{
			label: 'hardware',
			items: [
				{ name: 'Main machine', detail: 'placeholder — e.g. Thinkpad X1 Carbon' },
				{ name: 'Server', detail: 'placeholder — e.g. old PC running Proxmox' },
				{ name: 'Monitor', detail: 'placeholder' },
				{ name: 'Keyboard', detail: 'placeholder' }
			]
		},
		{
			label: 'software',
			items: [
				{ name: 'Editor', detail: 'placeholder — e.g. Neovim' },
				{ name: 'Terminal', detail: 'placeholder — e.g. Kitty' },
				{ name: 'Shell', detail: 'placeholder — e.g. zsh + starship' },
				{ name: 'OS', detail: 'placeholder — e.g. Arch btw' }
			]
		},
		{
			label: 'homelab',
			items: [
				{ name: 'Hypervisor', detail: 'placeholder — e.g. Proxmox VE' },
				{ name: 'DNS', detail: 'placeholder — e.g. AdGuard Home' },
				{ name: 'Reverse proxy', detail: 'placeholder — e.g. Caddy' },
				{ name: 'Monitoring', detail: 'placeholder — e.g. Grafana + Prometheus' }
			]
		},
		{
			label: 'services',
			items: [
				{ name: 'Git hosting', detail: 'placeholder — e.g. Forgejo (self-hosted)' },
				{ name: 'Cloud', detail: 'placeholder — e.g. Hetzner' },
				{ name: 'Domain registrar', detail: 'placeholder — e.g. Porkbun' }
			]
		}
	];
</script>

<h1>uses</h1>
<p class="subtitle">hardware, software, and daily drivers</p>

<div class="sections">
	{#each sections as section}
		<div class="section">
			<span class="section-label">{section.label}</span>
			<ul>
				{#each section.items as item}
					<li>
						<span class="item-name">{item.name}</span>
						<span class="item-detail">{item.detail}</span>
					</li>
				{/each}
			</ul>
		</div>
	{/each}
</div>

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

	.sections {
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
	}

	.section {
		display: grid;
		grid-template-columns: 80px 1fr;
		gap: 0 2rem;
		align-items: start;
	}

	.section-label {
		font-family: var(--mono);
		font-size: 0.72rem;
		color: var(--text-muted);
		padding-top: 0.1rem;
	}

	ul {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	li {
		display: flex;
		align-items: baseline;
		gap: 0.75rem;
		font-size: 0.9rem;
	}

	.item-name {
		color: var(--text);
		min-width: 140px;
		flex-shrink: 0;
	}

	.item-detail {
		color: var(--text-muted);
		font-size: 0.85rem;
	}

	@media (max-width: 480px) {
		.section {
			grid-template-columns: 1fr;
			gap: 0.75rem;
		}

		li {
			flex-direction: column;
			gap: 0.15rem;
		}
	}
</style>
