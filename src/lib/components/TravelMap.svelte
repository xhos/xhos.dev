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

	// ── transform state ──
	let zoom = $state(1);
	let px = $state(0);
	let py = $state(0);
	let dragging = $state(false);

	function clamp(v: number, lo: number, hi: number) {
		return Math.max(lo, Math.min(hi, v));
	}

	function bound(x: number, y: number, z: number) {
		const bx = (VW * (z - 1)) / 2;
		const by = (VH * (z - 1)) / 2;
		return { x: clamp(x, -bx, bx), y: clamp(y, -by, by) };
	}

	// ── mouse wheel zoom ──
	function onWheel(e: WheelEvent) {
		e.preventDefault();
		const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
		const s = VW / r.width;
		const mx = (e.clientX - r.left) * s;
		const my = (e.clientY - r.top) * s;
		const f = e.deltaY < 0 ? 1.15 : 1 / 1.15;
		const nz = clamp(zoom * f, 1, 12);
		const ratio = nz / zoom;
		px = px * ratio + (mx - VW / 2) * (1 - ratio);
		py = py * ratio + (my - VH / 2) * (1 - ratio);
		zoom = nz;
		({ x: px, y: py } = bound(px, py, zoom));
	}

	// ── mouse/trackpad drag (non-touch pointer only) ──
	let mouseOrigin = { x: 0, y: 0, px: 0, py: 0 };

	function onPointerDown(e: PointerEvent) {
		if (e.pointerType === 'touch') return;
		if (e.button !== 0) return;
		dragging = true;
		mouseOrigin = { x: e.clientX, y: e.clientY, px, py };
		(e.currentTarget as Element).setPointerCapture(e.pointerId);
	}

	function onPointerMove(e: PointerEvent) {
		if (e.pointerType === 'touch') return;
		if (!dragging) return;
		const s = VW / (e.currentTarget as SVGSVGElement).getBoundingClientRect().width;
		({ x: px, y: py } = bound(
			mouseOrigin.px + (e.clientX - mouseOrigin.x) * s,
			mouseOrigin.py + (e.clientY - mouseOrigin.y) * s,
			zoom,
		));
	}

	function onPointerUp(e: PointerEvent) {
		if (e.pointerType === 'touch') return;
		dragging = false;
	}

	// ── touch: pan + pinch + inertia + double-tap ──
	let inertiaRaf = 0;
	let vx = 0;
	let vy = 0;

	function cancelInertia() {
		if (inertiaRaf) { cancelAnimationFrame(inertiaRaf); inertiaRaf = 0; }
	}

	function startInertia() {
		cancelInertia();
		function tick() {
			vx *= 0.94;
			vy *= 0.94;
			if (Math.abs(vx) < 0.05 && Math.abs(vy) < 0.05) return;
			const b = bound(px + vx, py + vy, zoom);
			px = b.x; py = b.y;
			inertiaRaf = requestAnimationFrame(tick);
		}
		inertiaRaf = requestAnimationFrame(tick);
	}

	// track active touches by id → {x, y}
	let activeTouches = new Map<number, { x: number; y: number }>();
	let lastMidX = 0, lastMidY = 0;
	let lastPinchDist = 0;
	let lastMoveT = 0;
	let lastDx = 0, lastDy = 0;

	// double-tap state
	let lastTapT = 0;
	let lastTapX = 0, lastTapY = 0;

	function touchMid() {
		const pts = [...activeTouches.values()];
		return { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
	}

	function touchDist() {
		const pts = [...activeTouches.values()];
		return Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
	}

	function onTouchStart(e: TouchEvent) {
		e.preventDefault();
		cancelInertia();

		for (const t of e.changedTouches) {
			activeTouches.set(t.identifier, { x: t.clientX, y: t.clientY });
		}

		if (activeTouches.size === 1) {
			const t = [...activeTouches.values()][0];
			dragging = true;
			lastMidX = t.x;
			lastMidY = t.y;
			lastMoveT = Date.now();
			vx = 0; vy = 0;

			// double-tap to zoom
			const now = Date.now();
			if (now - lastTapT < 280 && Math.hypot(t.x - lastTapX, t.y - lastTapY) < 40) {
				lastTapT = 0;
				const svg = e.currentTarget as SVGSVGElement;
				const r = svg.getBoundingClientRect();
				const s = VW / r.width;
				const mx = (t.x - r.left) * s;
				const my = (t.y - r.top) * s;
				if (zoom > 1.5) {
					// reset
					px = 0; py = 0; zoom = 1;
				} else {
					const nz = clamp(zoom * 3, 1, 12);
					const ratio = nz / zoom;
					px = px * ratio + (mx - VW / 2) * (1 - ratio);
					py = py * ratio + (my - VH / 2) * (1 - ratio);
					zoom = nz;
					({ x: px, y: py } = bound(px, py, zoom));
				}
				return;
			}
			lastTapT = now;
			lastTapX = t.x;
			lastTapY = t.y;
		}

		if (activeTouches.size === 2) {
			dragging = true;
			lastPinchDist = touchDist();
			const mid = touchMid();
			lastMidX = mid.x;
			lastMidY = mid.y;
		}
	}

	function onTouchMove(e: TouchEvent) {
		e.preventDefault();

		for (const t of e.changedTouches) {
			if (activeTouches.has(t.identifier)) {
				activeTouches.set(t.identifier, { x: t.clientX, y: t.clientY });
			}
		}

		const svg = e.currentTarget as SVGSVGElement;
		const r = svg.getBoundingClientRect();
		const s = VW / r.width;

		if (activeTouches.size === 1) {
			const t = [...activeTouches.values()][0];
			const now = Date.now();
			const dt = Math.max(1, now - lastMoveT);
			const dx = (t.x - lastMidX) * s;
			const dy = (t.y - lastMidY) * s;

			// rolling velocity (SVG units per frame @ 60fps)
			vx = dx / dt * 16;
			vy = dy / dt * 16;
			lastDx = dx; lastDy = dy;

			({ x: px, y: py } = bound(px + dx, py + dy, zoom));
			lastMidX = t.x;
			lastMidY = t.y;
			lastMoveT = now;
		} else if (activeTouches.size === 2) {
			const dist = touchDist();
			const mid = touchMid();

			// zoom around pinch midpoint
			const nz = clamp(zoom * (dist / lastPinchDist), 1, 12);
			const mx = (lastMidX - r.left) * s;
			const my = (lastMidY - r.top) * s;
			const ratio = nz / zoom;
			px = px * ratio + (mx - VW / 2) * (1 - ratio);
			py = py * ratio + (my - VH / 2) * (1 - ratio);
			zoom = nz;

			// pan from midpoint movement
			px += (mid.x - lastMidX) * s;
			py += (mid.y - lastMidY) * s;
			({ x: px, y: py } = bound(px, py, zoom));

			lastPinchDist = dist;
			lastMidX = mid.x;
			lastMidY = mid.y;
		}
	}

	function onTouchEnd(e: TouchEvent) {
		e.preventDefault();
		for (const t of e.changedTouches) {
			activeTouches.delete(t.identifier);
		}

		if (activeTouches.size === 0) {
			dragging = false;
			// launch inertia if there was meaningful velocity
			if (Math.abs(vx) > 0.5 || Math.abs(vy) > 0.5) startInertia();
		} else if (activeTouches.size === 1) {
			// finger lifted during pinch — re-anchor single-touch pan
			const t = [...activeTouches.values()][0];
			lastMidX = t.x;
			lastMidY = t.y;
			lastMoveT = Date.now();
			vx = 0; vy = 0;
		}
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
		onwheel={onWheel}
		onpointerdown={onPointerDown}
		onpointermove={onPointerMove}
		onpointerup={onPointerUp}
		onpointerleave={onPointerUp}
		ontouchstart={onTouchStart}
		ontouchmove={onTouchMove}
		ontouchend={onTouchEnd}
		ontouchcancel={onTouchEnd}
	>
		<g transform="translate({VW / 2 + px},{VH / 2 + py}) scale({zoom}) translate({-VW / 2},{-VH / 2})">
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
		-webkit-user-select: none;
	}
	.map.dragging { cursor: grabbing; }

	.visited {
		stroke: none;
		cursor: crosshair;
		transition: opacity 0.15s ease;
	}
	.visited:hover { opacity: 0.75; }

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
</style>
