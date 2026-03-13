<script lang="ts">
	import { onMount } from 'svelte';

	let thumbHeight = $state(0);
	let thumbTop = $state(0);
	let dragging = $state(false);
	let visible = $state(false);
	let atTop = $state(true);
	let dragStartY = 0;
	let dragStartScroll = 0;
	let hideTimer: ReturnType<typeof setTimeout>;

	function update() {
		const docH = document.documentElement.scrollHeight;
		const winH = window.innerHeight;
		const scrollY = window.scrollY;
		thumbHeight = Math.max((winH / docH) * winH * 0.55, 24);
		thumbTop = (scrollY / (docH - winH)) * (winH - thumbHeight);
		atTop = scrollY < 40;

		visible = true;
		clearTimeout(hideTimer);
		if (!dragging) hideTimer = setTimeout(() => { visible = false; }, 1200);
	}

	function onDragStart(e: MouseEvent) {
		dragging = true;
		dragStartY = e.clientY;
		dragStartScroll = window.scrollY;
		e.preventDefault();
	}

	function onDragMove(e: MouseEvent) {
		if (!dragging) return;
		const docH = document.documentElement.scrollHeight;
		const winH = window.innerHeight;
		const delta = e.clientY - dragStartY;
		window.scrollTo({ top: dragStartScroll + (delta / (winH - thumbHeight)) * (docH - winH) });
	}

	function onDragEnd() {
		dragging = false;
		hideTimer = setTimeout(() => { visible = false; }, 1200);
	}

	onMount(() => {
		update();
		window.addEventListener('scroll', update, { passive: true });
		window.addEventListener('resize', update, { passive: true });
		window.addEventListener('mousemove', onDragMove);
		window.addEventListener('mouseup', onDragEnd);
		return () => {
			window.removeEventListener('scroll', update);
			window.removeEventListener('resize', update);
			window.removeEventListener('mousemove', onDragMove);
			window.removeEventListener('mouseup', onDragEnd);
			clearTimeout(hideTimer);
		};
	});
</script>

<div class="track" class:visible class:atTop>
	<div
		class="thumb"
		class:dragging
		style="height: {thumbHeight}px; transform: translateY({thumbTop}px)"
		onmousedown={onDragStart}
		role="scrollbar"
		aria-controls="site-content"
		aria-valuenow={Math.round((thumbTop / (window?.innerHeight - thumbHeight)) * 100)}
		aria-valuemin={0}
		aria-valuemax={100}
		tabindex="0"
	></div>
</div>

<style>
	.track {
		position: fixed;
		right: 6px;
		top: 12px;
		bottom: 12px;
		width: 2px;
		z-index: 9999;
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.5s ease;
		background: rgba(255, 255, 255, 0.03);
		border-radius: 99px;
	}

	.track.visible:not(.atTop) { opacity: 1; }

	.thumb {
		position: absolute;
		left: 0;
		width: 100%;
		border-radius: 99px;
		background: rgba(62, 173, 213, 0.18);
		pointer-events: all;
		cursor: grab;
		transition: background 0.3s, width 0.3s, left 0.3s;
	}

	.thumb:hover {
		width: 3px;
		left: -0.5px;
		background: rgba(62, 173, 213, 0.35);
	}

	.thumb.dragging {
		cursor: grabbing;
		width: 3px;
		left: -0.5px;
		background: rgba(62, 173, 213, 0.45);
	}
</style>
