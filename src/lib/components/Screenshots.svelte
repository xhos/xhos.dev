<script lang="ts">
	import { openLightbox } from '$lib/lightbox';

	let { screenshots, name }: { screenshots: string[]; name: string } = $props();

	// track = [clone of last, ...real, clone of first]
	const track = $derived([
		screenshots[screenshots.length - 1],
		...screenshots,
		screenshots[0],
	]);

	let index = $state(1); // start at first real slide
	let animated = $state(true);

	function go(dir: number, e: MouseEvent) {
		e.stopPropagation();
		animated = true;
		index += dir;
	}

	function onTransitionEnd() {
		// snap silently from clone to real counterpart
		if (index === 0) {
			animated = false;
			index = screenshots.length;
		} else if (index === track.length - 1) {
			animated = false;
			index = 1;
		}
	}

	const realIndex = $derived(
		index === 0 ? screenshots.length - 1 :
		index === track.length - 1 ? 0 :
		index - 1
	);
</script>

<div class="carousel" role="presentation" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()}>
	<div
		class="track"
		class:animated
		style="transform: translateX(calc({index} * -88%))"
		ontransitionend={onTransitionEnd}
	>
		{#each track as src, i}
			<div class="slide" class:active={i === index}>
				<button class="img-btn" onclick={() => openLightbox(src)} aria-label="view {name} screenshot fullscreen">
					<img {src} alt="{name} screenshot" />
				</button>
			</div>
		{/each}
	</div>

	{#if screenshots.length > 1}
		<button class="arrow left" onclick={(e) => go(-1, e)} aria-label="previous">‹</button>
		<button class="arrow right" onclick={(e) => go(1, e)} aria-label="next">›</button>
		<div class="dots">
			{#each screenshots as _, i}
				<button
					class="dot"
					class:active={i === realIndex}
					onclick={(e) => { e.stopPropagation(); animated = true; index = i + 1; }}
					aria-label="go to {i + 1}"
				></button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.carousel {
		position: relative;
		overflow: hidden;
		border-radius: 8px;
	}

	.track {
		display: flex;
		gap: 4%;
	}

	.track.animated {
		transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.slide {
		flex: 0 0 84%;
		border-radius: 6px;
		overflow: hidden;
		opacity: 0.4;
	}

	.track.animated .slide {
		transition: opacity 0.3s;
	}

	.slide.active {
		opacity: 1;
	}

	.img-btn {
		display: block;
		width: 100%;
		padding: 0;
		border: none;
		background: none;
		cursor: zoom-in;
		border-radius: 6px;
		overflow: hidden;
	}

	.slide img {
		width: 100%;
		height: 140px;
		object-fit: cover;
		display: block;
	}

	.arrow {
		position: absolute;
		top: calc(50% - 0.75rem);
		transform: translateY(-50%);
		background: rgba(1, 8, 16, 0.7);
		border: 1px solid rgba(62, 173, 213, 0.15);
		color: var(--text);
		width: 1.6rem;
		height: 1.6rem;
		border-radius: 50%;
		font-size: 1.1rem;
		line-height: 1;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.2s, color 0.2s;
		z-index: 2;
	}

	.arrow:hover {
		background: rgba(62, 173, 213, 0.15);
		color: var(--accent);
	}

	.arrow.left  { left: 0.4rem; }
	.arrow.right { right: 0.4rem; }

	.dots {
		display: flex;
		justify-content: center;
		gap: 0.35rem;
		margin-top: 0.5rem;
	}

	.dot {
		width: 0.3rem;
		height: 0.3rem;
		border-radius: 50%;
		background: var(--text-dim);
		opacity: 0.3;
		border: none;
		cursor: pointer;
		padding: 0;
		transition: opacity 0.2s, background 0.2s;
	}

	.dot.active {
		background: var(--accent);
		opacity: 1;
	}
</style>
