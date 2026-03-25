<script lang="ts">
  import TravelMap from "$lib/components/TravelMap.svelte";
  import { levels } from "$lib/data/travel";
  let { data } = $props();
</script>

<svelte:head>
  <title>travel — xhos</title>
</svelte:head>

<div class="travel">
  <TravelMap
    landPath={data.landPath}
    graticulePath={data.graticulePath}
    visited={data.visited}
    VW={data.VW}
    VH={data.VH}
  />

  <div class="vignette"></div>

  <header>
    <a href="/" class="back">← home</a>
    <h1>travel</h1>
    <p class="count">{data.visited.length} countries visited</p>
    <p class="sub">
      yeah yeah, coloring a whole country after a few weeks of travel is, to say <br />
      the least, inaccurate, but whatever, fancy map goes brrr
    </p>
  </header>

  <div class="legend">
    {#each levels.slice(1) as lev}
      <div class="legend-item">
        <span class="dot" style="background:{lev.color}"></span>
        <span>{lev.label}</span>
      </div>
    {/each}
  </div>

</div>

<style>
  .travel {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }

  .vignette {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background:
      linear-gradient(180deg, rgba(1,8,16,0.9) 0%, rgba(1,8,16,0.4) 15%, transparent 30%),
      linear-gradient(0deg, rgba(1,8,16,0.85) 0%, rgba(1,8,16,0.3) 12%, transparent 25%),
      linear-gradient(90deg, rgba(1,8,16,0.6) 0%, transparent 15%),
      linear-gradient(270deg, rgba(1,8,16,0.3) 0%, transparent 10%);
  }

  header {
    position: absolute;
    top: 1.5rem;
    left: 1.5rem;
    z-index: 2;
    pointer-events: none;
  }
  header > * { pointer-events: auto; }

  .back {
    font-family: var(--mono);
    font-size: 0.72rem;
    color: var(--text-dim);
    text-decoration: none;
    transition: color 0.2s;
    display: inline-block;
    margin-bottom: 0.5rem;
  }
  .back:hover { color: var(--accent); }

  h1 {
    font-family: var(--display);
    font-size: 2rem;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.03em;
    margin: 0;
    line-height: 1.1;
  }

  .sub {
    font-size: 0.78rem;
    color: var(--text-dim);
    margin: 0.2rem 0 0;
    opacity: 0.7;
  }

  .legend {
    position: absolute;
    bottom: 1.25rem;
    left: 1.25rem;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    pointer-events: none;
  }
  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-family: var(--mono);
    font-size: 0.6rem;
    color: var(--text-dim);
    opacity: 0.7;
  }
  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .count {
    font-family: var(--mono);
    font-size: 0.72rem;
    color: var(--accent);
    opacity: 0.7;
    margin: 0.15rem 0 0;
  }

  @media (max-width: 600px) {
    header { top: 1rem; left: 1rem; }
    h1 { font-size: 1.4rem; }
    .sub { font-size: 0.65rem; }
    .back { font-size: 0.6rem; margin-bottom: 0.3rem; }
    .legend { bottom: 0.75rem; left: 0.75rem; gap: 0.2rem; }
    .legend-item { font-size: 0.5rem; }
    .dot { width: 5px; height: 5px; }
    .meta { bottom: 0.75rem; right: 0.75rem; font-size: 0.5rem; }
  }
</style>
