<script lang="ts">
	import { lightboxSrc, closeLightbox } from '$lib/lightbox';

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') closeLightbox();
	}
</script>

<svelte:window onkeydown={onKeydown} />

{#if $lightboxSrc}
	<button class="overlay" onclick={closeLightbox} aria-label="close image">
		<img src={$lightboxSrc} alt="" />
	</button>
{/if}

<style>
	.overlay {
		appearance: none;
		border: none;
		position: fixed;
		inset: 0;
		z-index: 99999;
		background: rgba(0, 0, 0, 0.85);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: zoom-out;
		animation: fadeIn 0.18s ease;
		backdrop-filter: blur(4px);
	}

	img {
		max-width: 90vw;
		max-height: 90vh;
		border-radius: 8px;
		object-fit: contain;
		box-shadow: 0 0 60px rgba(0, 0, 0, 0.6);
		cursor: default;
		animation: scaleIn 0.18s cubic-bezier(0.16, 1, 0.3, 1);
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to   { opacity: 1; }
	}

	@keyframes scaleIn {
		from { transform: scale(0.92); opacity: 0; }
		to   { transform: scale(1);    opacity: 1; }
	}
</style>
