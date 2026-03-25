<script lang="ts">
	import { levels } from '$lib/data/travel';

	interface Props {
		landPath: string;
		graticulePath: string;
		visited: { d: string; name: string; a3: string; level: number }[];
		VW: number;
		VH: number;
	}

	let { landPath, graticulePath, visited, VW, VH }: Props = $props();

	// ── zoom / pan ──
	let zoom = $state(1);
	let px = $state(0);
	let py = $state(0);
	let dragging = $state(false);
	let origin = { x: 0, y: 0, px: 0, py: 0 };

	function bound(x: number, y: number, z: number) {
		const bx = (VW * (z - 1)) / 2;
		const by = (VH * (z - 1)) / 2;
		return { x: Math.max(-bx, Math.min(bx, x)), y: Math.max(-by, Math.min(by, y)) };
	}

	function getSvgScale(el: EventTarget | null) {
		return VW / (el as SVGSVGElement).getBoundingClientRect().width;
	}

	// mouse wheel zoom
	function wheel(e: WheelEvent) {
		e.preventDefault();
		const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
		const s = VW / r.width;
		const mx = (e.clientX - r.left) * s;
		const my = (e.clientY - r.top) * s;
		const f = e.deltaY < 0 ? 1.15 : 1 / 1.15;
		const nz = Math.max(1, Math.min(12, zoom * f));
		const ratio = nz / zoom;
		px = px * ratio + (mx - VW / 2) * (1 - ratio);
		py = py * ratio + (my - VH / 2) * (1 - ratio);
		zoom = nz;
		({ x: px, y: py } = bound(px, py, zoom));
	}

	// pointer drag (mouse + single touch)
	function down(e: PointerEvent) {
		if (e.button !== 0) return;
		dragging = true;
		origin = { x: e.clientX, y: e.clientY, px, py };
		(e.currentTarget as Element).setPointerCapture(e.pointerId);
	}

	function move(e: PointerEvent) {
		if (!dragging) return;
		const s = getSvgScale(e.currentTarget);
		({ x: px, y: py } = bound(
			origin.px + (e.clientX - origin.x) * s,
			origin.py + (e.clientY - origin.y) * s,
			zoom,
		));
	}

	function up() { dragging = false; }

	// pinch zoom (two-finger touch)
	let pinch = { dist: 0, zoom: 1, cx: 0, cy: 0 };

	function touchStart(e: TouchEvent) {
		if (e.touches.length === 2) {
			e.preventDefault();
			const [a, b] = [e.touches[0], e.touches[1]];
			pinch = {
				dist: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
				zoom,
				cx: (a.clientX + b.clientX) / 2,
				cy: (a.clientY + b.clientY) / 2,
			};
		}
	}

	function touchMove(e: TouchEvent) {
		if (e.touches.length !== 2) return;
		e.preventDefault();
		const [a, b] = [e.touches[0], e.touches[1]];
		const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
		const nz = Math.max(1, Math.min(12, pinch.zoom * (dist / pinch.dist)));

		const svg = (e.currentTarget as SVGSVGElement);
		const r = svg.getBoundingClientRect();
		const s = VW / r.width;
		const mx = (pinch.cx - r.left) * s;
		const my = (pinch.cy - r.top) * s;
		const ratio = nz / zoom;
		px = px * ratio + (mx - VW / 2) * (1 - ratio);
		py = py * ratio + (my - VH / 2) * (1 - ratio);
		zoom = nz;
		({ x: px, y: py } = bound(px, py, zoom));
	}

	// ── tooltip ──
	let tip = $state<{ name: string; level: number; mx: number; my: number } | null>(null);
</script>

<div class="map-wrap">
	<svg
		viewBox="0 0 {VW} {VH}"
		preserveAspectRatio="xMidYMid slice"
		class="map"
		class:dragging
		role="img"
		aria-label="Interactive world travel map"
		onwheel={wheel}
		onpointerdown={down}
		onpointermove={move}
		onpointerup={up}
		onpointerleave={up}
		ontouchstart={touchStart}
		ontouchmove={touchMove}
	>
		<g transform="translate({VW/2 + px},{VH/2 + py}) scale({zoom}) translate({-VW/2},{-VH/2})">
			<path d={graticulePath} fill="none" stroke="rgba(62,173,213,0.03)" stroke-width="0.4" />
			<path d={landPath} fill="#05101a" />

			{#each visited as c}
				<path
					d={c.d}
					fill={levels[c.level].color}
					class="visited"
					role="img"
					tabindex="0"
					aria-label="{c.name}, {levels[c.level].label}"
					onmouseenter={(e) => { if (!dragging) tip = { name: c.name, level: c.level, mx: e.clientX, my: e.clientY }; }}
					onmousemove={(e) => { if (tip && !dragging) tip = { ...tip, mx: e.clientX, my: e.clientY }; }}
					onmouseleave={() => { tip = null; }}
				/>
			{/each}
		</g>
	</svg>

	<!-- HTML tooltip -->
	{#if tip && !dragging}
		<div class="tip" style="left:{tip.mx + 10}px;top:{tip.my + 10}px">
			<span class="tip-name">{tip.name}</span>
			<span class="tip-level">
				<span class="tip-dot" style="background:{levels[tip.level].color}"></span>
				{levels[tip.level].label}
			</span>
		</div>
	{/if}
</div>

<style>
	.map-wrap {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
	}

	.map {
		width: 100%;
		height: 100%;
		display: block;
		cursor: grab;
		touch-action: none;
		user-select: none;
	}
	.map.dragging { cursor: grabbing; }

	.visited {
		stroke: none;
		cursor: crosshair;
		transition: opacity 0.15s ease;
	}
	.visited:hover { opacity: 0.75; }

	/* ── tooltip ── */
	.tip {
		position: fixed;
		z-index: 20;
		pointer-events: none;
		background: var(--bg-raised);
		border: 1px solid var(--border);
		border-radius: 5px;
		padding: 5px 8px;
		display: flex;
		flex-direction: column;
		gap: 2px;
		white-space: nowrap;
	}
	.tip-name {
		font-family: var(--body);
		font-size: 0.7rem;
		color: var(--text);
	}
	.tip-level {
		font-family: var(--mono);
		font-size: 0.6rem;
		color: var(--text-dim);
		display: flex;
		align-items: center;
		gap: 4px;
	}
	.tip-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
	}

	/* ── mobile ── */
	@media (max-width: 600px) {
		.legend { bottom: 0.75rem; left: 0.75rem; gap: 0.2rem; }
		.legend-item { font-size: 0.5rem; }
		.legend-dot { width: 5px; height: 5px; }
		.meta { bottom: 0.75rem; right: 0.75rem; font-size: 0.5rem; }
	}
</style>
