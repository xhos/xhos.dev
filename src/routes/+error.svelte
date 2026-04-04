<script lang="ts">
  import { page } from '$app/stores';
</script>

<svelte:head>
  <title>{$page.status} — xhos</title>
</svelte:head>

<div class="ocean">
  <div class="rays">
    <div class="ray"></div>
    <div class="ray"></div>
    <div class="ray"></div>
    <div class="ray"></div>
  </div>
  <div class="particles">
    {#each Array(18) as _, i}
      <span class="p" style="--i:{i}"></span>
    {/each}
  </div>

  <div class="center">
    <div class="sonar" aria-hidden="true">
      <span class="ring"></span>
      <span class="ring"></span>
      <span class="ring"></span>
    </div>

    <h1 class="code">{$page.status}</h1>

    <p class="message">you've drifted beyond charted waters</p>

    <a href="/" class="surface">← surface</a>
  </div>
</div>

<style>
  .ocean {
    --pad: clamp(1.5rem, 5vw, 4rem);
    min-height: 100svh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    background:
      radial-gradient(ellipse 120% 28% at 50% 0%, #0b2d5a 0%, transparent 100%),
      radial-gradient(ellipse 50% 18% at 12% 32%, #051830 0%, transparent 100%),
      radial-gradient(ellipse 35% 14% at 90% 28%, #040f20 0%, transparent 100%),
      linear-gradient(180deg, #030e1d 0%, #020a16 25%, #010810 50%, #000406 100%);
    background-color: #000406;
  }

  /* ━━━ rays ━━━ */
  .rays {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
  }
  .ray {
    position: absolute;
    top: -25%;
    transform-origin: top center;
  }
  .ray:nth-child(1) {
    left: 18%;
    width: 160px;
    height: 80%;
    background: linear-gradient(180deg, rgba(62, 173, 213, 0.07) 0%, transparent 80%);
    transform: rotate(5deg);
    animation: ray 14s ease-in-out infinite alternate;
  }
  .ray:nth-child(2) {
    left: 42%;
    width: 80px;
    height: 60%;
    background: linear-gradient(180deg, rgba(62, 173, 213, 0.04) 0%, transparent 70%);
    transform: rotate(-3deg);
    animation: ray 19s ease-in-out infinite alternate-reverse;
  }
  .ray:nth-child(3) {
    left: 64%;
    width: 120px;
    height: 72%;
    background: linear-gradient(180deg, rgba(62, 173, 213, 0.06) 0%, transparent 75%);
    transform: rotate(10deg);
    animation: ray 16s 1.5s ease-in-out infinite alternate;
  }
  .ray:nth-child(4) {
    left: 80%;
    width: 70px;
    height: 50%;
    background: linear-gradient(180deg, rgba(62, 173, 213, 0.035) 0%, transparent 65%);
    transform: rotate(-6deg);
    animation: ray 21s 3s ease-in-out infinite alternate-reverse;
  }

  /* ━━━ particles ━━━ */
  .particles {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  }
  .p {
    position: absolute;
    width: 2px;
    height: 2px;
    border-radius: 50%;
    background: rgba(62, 173, 213, 0.3);
    left: calc(3% + var(--i) * 5.4%);
    top: calc(10% + var(--i) * 4.6%);
    animation: float calc(5s + var(--i) * 0.9s) ease-in-out infinite alternate;
    animation-delay: calc(var(--i) * -0.65s);
    opacity: calc(0.12 + var(--i) * 0.025);
  }
  .p:nth-child(even) {
    width: 3px;
    height: 3px;
    background: rgba(62, 173, 213, 0.15);
  }
  .p:nth-child(3n) {
    width: 1px;
    height: 1px;
    background: rgba(62, 173, 213, 0.45);
  }

  /* ━━━ center layout ━━━ */
  .center {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0;
    animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  /* ━━━ sonar rings ━━━ */
  .sonar {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    width: 0;
    height: 0;
  }
  .ring {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 340px;
    height: 340px;
    border-radius: 50%;
    border: 1px solid rgba(62, 173, 213, 0.18);
    transform: translate(-50%, -50%) scale(0.2);
    animation: sonar 5s ease-out infinite;
  }
  .ring:nth-child(2) { animation-delay: 1.65s; }
  .ring:nth-child(3) { animation-delay: 3.3s; }

  /* ━━━ 404 display ━━━ */
  .code {
    font-family: var(--display);
    font-size: clamp(7rem, 22vw, 16rem);
    font-weight: 800;
    line-height: 0.85;
    letter-spacing: -0.04em;
    color: var(--text);
    /* layered: a solid text with a ghost duplicate via text-shadow */
    text-shadow:
      0 0 120px rgba(62, 173, 213, 0.12),
      0 0 40px rgba(62, 173, 213, 0.07);
    animation: fadeUp 1s 0.05s cubic-bezier(0.16, 1, 0.3, 1) both;
    position: relative;
  }
  /* ghost echo behind the number */
  .code::before {
    content: attr(data-code);
    position: absolute;
    inset: 0;
    color: transparent;
    -webkit-text-stroke: 1px rgba(62, 173, 213, 0.08);
    transform: translateY(6px) scale(1.015);
    pointer-events: none;
  }

  /* ━━━ subtitle ━━━ */
  .message {
    font-family: var(--body);
    font-size: clamp(0.9rem, 2vw, 1.05rem);
    font-weight: 300;
    color: var(--text-dim);
    letter-spacing: 0.02em;
    margin-top: 1.75rem;
    opacity: 0.75;
    animation: fadeUp 1s 0.2s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  /* ━━━ home link ━━━ */
  .surface {
    font-family: var(--mono);
    font-size: 0.75rem;
    color: var(--text-dim);
    letter-spacing: 0.06em;
    margin-top: 2.25rem;
    transition:
      color 0.25s,
      transform 0.25s;
    display: inline-block;
    animation: fadeUp 1s 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
    border: 1px solid rgba(62, 173, 213, 0.12);
    padding: 0.55rem 1.1rem;
    border-radius: 4px;
    background: rgba(62, 173, 213, 0.03);
  }
  .surface:hover {
    color: var(--accent);
    border-color: rgba(62, 173, 213, 0.3);
    background: rgba(62, 173, 213, 0.06);
    transform: translateY(-2px);
  }

  /* ━━━ keyframes ━━━ */
  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(28px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes ray {
    0% {
      opacity: 0.7;
      transform: rotate(var(--r, 6deg)) translateX(0);
    }
    50% {
      opacity: 0.3;
    }
    100% {
      opacity: 0.7;
      transform: rotate(calc(var(--r, 6deg) + 4deg)) translateX(22px);
    }
  }
  @keyframes float {
    from { transform: translateY(0) translateX(0); }
    to   { transform: translateY(-22px) translateX(6px); }
  }
  @keyframes sonar {
    0%   { transform: translate(-50%, -50%) scale(0.2); opacity: 0.7; }
    100% { transform: translate(-50%, -50%) scale(1.8); opacity: 0; }
  }
</style>
