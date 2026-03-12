<script lang="ts">
	import { onMount } from 'svelte';

	let { status: generalStatus = [] }: { status: string[] } = $props();

	const USER_ID = '383623763360481282';

	type Status = 'online' | 'idle' | 'dnd' | 'offline';

	interface Spotify {
		song: string;
		artist: string;
		album_art_url: string;
		track_id: string;
	}

	let discordStatus = $state<Status>('offline');
	let spotify = $state<Spotify | null>(null);
	let ready = $state(false);

	const statusLabel: Record<Status, string> = {
		online: 'online',
		idle: 'away',
		dnd: 'busy',
		offline: 'offline'
	};

	onMount(() => {
		const ws = new WebSocket('wss://api.lanyard.rest/socket');
		let heartbeat: ReturnType<typeof setInterval>;

		ws.onmessage = (e: MessageEvent) => {
			const msg = JSON.parse(e.data as string);

			if (msg.op === 1) {
				heartbeat = setInterval(() => {
					if (ws.readyState === WebSocket.OPEN) {
						ws.send(JSON.stringify({ op: 3 }));
					}
				}, msg.d.heartbeat_interval);

				ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: USER_ID } }));
			}

			if (msg.op === 0) {
				discordStatus = msg.d.discord_status as Status;
				spotify = msg.d.listening_to_spotify ? (msg.d.spotify as Spotify) : null;
				ready = true;
			}
		};

		ws.onerror = () => { ready = true; };
		ws.onclose = () => { ready = true; };

		return () => {
			clearInterval(heartbeat);
			if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
				ws.close();
			}
		};
	});
</script>

<div class="status-block" class:loading={!ready}>
	<p class="q">what am i doing, like <em>right</em> now?</p>

	<div class="section">
		<div class="status-line">
			<span class="dot-wrap">
				<span class="dot {discordStatus}"></span>
				{#if discordStatus === 'online'}
					<span class="dot-ping"></span>
				{/if}
			</span>
			<span class="status-text">{ready ? statusLabel[discordStatus] : '...'}</span>
		</div>
		{#if spotify}
			<div class="spotify">
				<span class="track">{spotify.song}</span>
				<span class="by">by {spotify.artist}</span>
			</div>
		{/if}
	</div>

	{#if generalStatus.length > 0}
		<div class="section">
			<p class="q">and <em>lately?</em></p>
			<div class="items">
				{#each generalStatus as item}
					<span class="item">{item}</span>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.status-block {
		display: flex;
		flex-direction: column;
		gap: 1.6rem;
		transition: opacity 0.5s;
	}

	.status-block.loading {
		opacity: 0.25;
	}

	.q {
		font-family: var(--body);
		font-size: 0.92rem;
		font-weight: 300;
		color: var(--text-dim);
		line-height: 1.4;
	}

	.q em {
		font-style: italic;
		color: var(--accent);
		font-weight: 400;
	}

	.section {
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
	}

	/* ── live ── */
	.status-line {
		display: flex;
		align-items: center;
		gap: 0.55rem;
	}

	.dot-wrap {
		position: relative;
		width: 10px;
		height: 10px;
		flex-shrink: 0;
	}

	.dot {
		position: absolute;
		inset: 1px;
		border-radius: 50%;
	}

	.dot.online  { background: #3ba55c; }
	.dot.idle    { background: #faa61a; }
	.dot.dnd     { background: #ed4245; }
	.dot.offline { background: #1a2d3d; }

	.dot-ping {
		position: absolute;
		inset: 0;
		border-radius: 50%;
		background: rgba(59, 165, 92, 0.4);
		animation: ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
	}

	.status-text {
		font-family: var(--body);
		font-size: 0.88rem;
		font-weight: 400;
		color: var(--text);
	}

	.spotify {
		display: flex;
		flex-direction: column;
		gap: 0.12rem;
		padding-left: 1.55rem;
	}

	.track {
		font-family: var(--body);
		font-size: 0.88rem;
		font-weight: 500;
		color: var(--text);
	}

	.by {
		font-family: var(--body);
		font-size: 0.74rem;
		font-weight: 300;
		color: var(--text-dim);
	}

	/* ── general ── */
	.items {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.item {
		font-family: var(--body);
		font-size: 0.88rem;
		font-weight: 400;
		color: var(--text);
		opacity: 0.5;
	}

	@keyframes ping {
		0%   { transform: scale(1); opacity: 0.6; }
		75%, 100% { transform: scale(2.2); opacity: 0; }
	}
</style>
