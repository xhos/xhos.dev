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

	let svgEl: SVGSVGElement | null = null;

	// ── transform state ──
	let zoom = $state(1);
	let px = $state(0);
	let py = $state(0);
	let dragging = $state(false);

	function clamp(v: number, lo: number, hi: number) {
		return Math.max(lo, Math.min(hi, v));
	}

	/**
	 * With `preserveAspectRatio="xMidYMid slice"`, the display scale is
	 *   dispScale = max(elW/VW, elH/VH)
	 * so 1 CSS pixel = 1/dispScale SVG units.
	 * We return s = 1/dispScale = min(VW/elW, VH/elH).
	 */
	function svgScale(r: DOMRect) {
		return Math.min(VW / r.width, VH / r.height);
	}

	/**
	 * Convert absolute client coords → SVG coords, accounting for the
	 * `xMidYMid slice` centering offset.
	 */
	function clientToSvg(cx: number, cy: number, r: DOMRect) {
		const s = svgScale(r);
		// slice centers the viewBox, so the visible SVG origin is offset
		const ox = (VW - r.width * s) / 2;
		const oy = (VH - r.height * s) / 2;
		return { x: ox + (cx - r.left) * s, y: oy + (cy - r.top) * s };
	}

	/**
	 * Panning bounds that account for the overflow `slice` creates at zoom=1.
	 * On mobile portrait the map is cropped horizontally — allow panning to
	 * uncover those hidden parts.
	 */
	function bound(x: number, y: number, z: number) {
		let bx = (VW * (z - 1)) / 2;
		let by = (VH * (z - 1)) / 2;
		if (svgEl) {
			const r = svgEl.getBoundingClientRect();
			const s = svgScale(r);
			bx += Math.max(0, (VW - r.width * s) / 2);
			by += Math.max(0, (VH - r.height * s) / 2);
		}
		return { x: clamp(x, -bx, bx), y: clamp(y, -by, by) };
	}

	// ── animated transitions (double-tap zoom) ──
	let animRaf = 0;

	function animateTo(tz: number, tpx: number, tpy: number) {
		if (animRaf) cancelAnimationFrame(animRaf);
		const t0 = performance.now();
		const z0 = zoom, p0x = px, p0y = py;
		const dur = 320;

		function tick(now: number) {
			const t = Math.min(1, (now - t0) / dur);
			const e = 1 - Math.pow(1 - t, 3); // ease-out cubic
			zoom = z0 + (tz - z0) * e;
			px = p0x + (tpx - p0x) * e;
			py = p0y + (tpy - p0y) * e;
			if (t < 1) {
				animRaf = requestAnimationFrame(tick);
			} else {
				animRaf = 0;
			}
		}
		animRaf = requestAnimationFrame(tick);
	}

	// ── mouse wheel zoom ──
	function onWheel(e: WheelEvent) {
		e.preventDefault();
		if (animRaf) { cancelAnimationFrame(animRaf); animRaf = 0; }
		const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
		const { x: mx, y: my } = clientToSvg(e.clientX, e.clientY, r);
		const f = e.deltaY < 0 ? 1.15 : 1 / 1.15;
		const nz = clamp(zoom * f, 1, 12);
		const ratio = nz / zoom;
		px = px * ratio + (mx - VW / 2) * (1 - ratio);
		py = py * ratio + (my - VH / 2) * (1 - ratio);
		zoom = nz;
		({ x: px, y: py } = bound(px, py, zoom));
	}

	// ── mouse / trackpad drag (skip for touch) ──
	let mouseOrigin = { x: 0, y: 0, px: 0, py: 0 };

	function onPointerDown(e: PointerEvent) {
		if (e.pointerType === 'touch') return;
		if (e.button !== 0) return;
		if (animRaf) { cancelAnimationFrame(animRaf); animRaf = 0; }
		dragging = true;
		mouseOrigin = { x: e.clientX, y: e.clientY, px, py };
		(e.currentTarget as Element).setPointerCapture(e.pointerId);
	}

	function onPointerMove(e: PointerEvent) {
		if (e.pointerType === 'touch' || !dragging) return;
		const s = svgScale((e.currentTarget as SVGSVGElement).getBoundingClientRect());
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
	let vx = 0, vy = 0;

	function cancelInertia() {
		if (inertiaRaf) { cancelAnimationFrame(inertiaRaf); inertiaRaf = 0; }
	}

	function startInertia() {
		cancelInertia();
		function tick() {
			vx *= 0.94;
			vy *= 0.94;
			if (Math.abs(vx) < 0.08 && Math.abs(vy) < 0.08) return;
			const b = bound(px + vx, py + vy, zoom);
			px = b.x; py = b.y;
			inertiaRaf = requestAnimationFrame(tick);
		}
		inertiaRaf = requestAnimationFrame(tick);
	}

	// map of touch id → client coords
	let activeTouches = new Map<number, { x: number; y: number }>();
	let lastMidX = 0, lastMidY = 0;
	let lastPinchDist = 0;
	let lastMoveT = 0;

	// double-tap detection
	let lastTapT = 0;
	let lastTapX = 0, lastTapY = 0;

	function touchMid() {
		const [a, b] = [...activeTouches.values()];
		return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
	}

	function touchDist() {
		const [a, b] = [...activeTouches.values()];
		return Math.hypot(a.x - b.x, a.y - b.y);
	}

	function onTouchStart(e: TouchEvent) {
		e.preventDefault();
		cancelInertia();
		if (animRaf) { cancelAnimationFrame(animRaf); animRaf = 0; }

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

			// double-tap
			const now = Date.now();
			if (now - lastTapT < 280 && Math.hypot(t.x - lastTapX, t.y - lastTapY) < 40) {
				lastTapT = 0;
				const svg = e.currentTarget as SVGSVGElement;
				const r = svg.getBoundingClientRect();
				const { x: mx, y: my } = clientToSvg(t.x, t.y, r);
				if (zoom > 1.5) {
					animateTo(1, 0, 0);
				} else {
					const nz = clamp(zoom * 3, 1, 12);
					const ratio = nz / zoom;
					const tpx = px * ratio + (mx - VW / 2) * (1 - ratio);
					const tpy = py * ratio + (my - VH / 2) * (1 - ratio);
					const { x: bpx, y: bpy } = bound(tpx, tpy, nz);
					animateTo(nz, bpx, bpy);
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
			vx = 0; vy = 0;
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
		const s = svgScale(r);

		if (activeTouches.size === 1) {
			const t = [...activeTouches.values()][0];
			const now = Date.now();
			const dt = Math.max(1, now - lastMoveT);
			const dx = (t.x - lastMidX) * s;
			const dy = (t.y - lastMidY) * s;

			// velocity in SVG units per frame (~60fps)
			vx = (dx / dt) * 16;
			vy = (dy / dt) * 16;

			({ x: px, y: py } = bound(px + dx, py + dy, zoom));
			lastMidX = t.x;
			lastMidY = t.y;
			lastMoveT = now;
		} else if (activeTouches.size === 2) {
			const dist = touchDist();
			const mid = touchMid();

			// zoom around initial pinch center
			const nz = clamp(zoom * (dist / lastPinchDist), 1, 12);
			const { x: mx, y: my } = clientToSvg(lastMidX, lastMidY, r);
			const ratio = nz / zoom;
			px = px * ratio + (mx - VW / 2) * (1 - ratio);
			py = py * ratio + (my - VH / 2) * (1 - ratio);
			zoom = nz;

			// pan from midpoint movement (simultaneous with zoom)
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
			if (Math.abs(vx) > 0.5 || Math.abs(vy) > 0.5) startInertia();
		} else if (activeTouches.size === 1) {
			// one finger lifted mid-pinch — re-anchor for single-touch pan
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
		bind:this={svgEl}
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
