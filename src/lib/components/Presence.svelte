<script lang="ts">
  import { onMount } from "svelte";

  let { status: generalStatus = [] }: { status: string[] } = $props();

  const USER_ID = "383623763360481282";

  type DiscordStatus = "online" | "idle" | "dnd" | "offline";

  interface DiscordUser {
    username: string;
    global_name: string | null;
    avatar: string | null;
  }

  interface Spotify {
    song: string;
    artist: string;
  }

  interface Activity {
    name: string;
    details?: string;
    type: number;
  }

  let discordStatus = $state<DiscordStatus>("offline");
  let discordUser = $state<DiscordUser | null>(null);
  let spotify = $state<Spotify | null>(null);
  let activity = $state<Activity | null>(null);
  let ready = $state(false);
  let activityEl = $state<HTMLElement | null>(null);
  let isScrolling = $state(false);

  $effect(() => {
    if (!activityEl) return;
    const track = activityEl.querySelector(".scroll-track");
    const content = activityEl.querySelector(".scroll-text-inner");
    if (!track || !content) return;
    isScrolling = (content as HTMLElement).scrollWidth > (track as HTMLElement).clientWidth;
  });

  const avatarUrl = $derived(
    discordUser?.avatar
      ? `https://cdn.discordapp.com/avatars/${USER_ID}/${discordUser.avatar}.png?size=64`
      : `https://cdn.discordapp.com/embed/avatars/0.png`,
  );

  const displayName = $derived(
    discordUser?.global_name ?? discordUser?.username ?? "xhos",
  );

  onMount(() => {
    const ws = new WebSocket("wss://api.lanyard.rest/socket");
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
        discordUser = msg.d.discord_user as DiscordUser;
        discordStatus = msg.d.discord_status as DiscordStatus;
        spotify = msg.d.listening_to_spotify
          ? (msg.d.spotify as Spotify)
          : null;

        const activities: Activity[] = msg.d.activities ?? [];
        activity = activities.find((a) => a.type !== 2 && a.type !== 4) ?? null;

        ready = true;
      }
    };

    ws.onerror = () => {
      ready = true;
    };
    ws.onclose = () => {
      ready = true;
    };

    return () => {
      clearInterval(heartbeat);
      if (
        ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING
      ) {
        ws.close();
      }
    };
  });
</script>

<div class="presence" class:loading={!ready}>
  <p class="q">what am i doing, like <em>right now</em>?</p>

  {#if discordStatus === "offline"}
    <div class="discord-bar offline-bar">
      <span class="offline-text">touching grass offline :)</span>
    </div>
  {:else}
    <div class="discord-bar">
      <div class="avatar-wrap">
        <img class="avatar" src={avatarUrl} alt="" />
        <span class="dot {discordStatus}"></span>
      </div>
      <div class="info">
        <span class="name">{displayName}</span>
        {#if spotify}
          <span
            class="activity-line"
            class:scrolling={isScrolling}
            bind:this={activityEl}
          >
            <svg class="note" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              ><path fill="#45a366" d="M8.65 1.51A2 2 0 0 0 6 3.41v9.88A3.98 3.98 0 0 0 4.5 13C2.57 13 1 14.34 1 16s1.57 3 3.5 3S8 17.66 8 16V5.4l11 3.81v7.08a3.98 3.98 0 0 0-1.5-.29c-1.93 0-3.5 1.34-3.5 3s1.57 3 3.5 3 3.5-1.34 3.5-3V7.03c0-.74-.47-1.4-1.18-1.65L8.65 1.51Z"
              /></svg
            >
            <span class="scroll-track">
              <span class="scroll-content" class:animate={isScrolling}>
                <span class="scroll-text-inner">{spotify.song} · {spotify.artist}</span>
                {#if isScrolling}<span class="scroll-text-inner" aria-hidden="true">{spotify.song} · {spotify.artist}</span>{/if}
              </span>
            </span>
          </span>
        {:else if activity}
          <span class="activity-line">{activity.name}</span>
        {/if}
      </div>
    </div>
  {/if}

  {#if generalStatus.length > 0}
    <div class="general">
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
  .presence {
    display: flex;
    flex-direction: column;
    gap: 1.4rem;
    transition: opacity 0.8s ease;
  }

  .presence.loading {
    opacity: 0;
  }

  /* ── discord bar ── */
  .discord-bar {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    background: var(--bg-raised);
    border: none;
    border-radius: 8px;
    padding: 0.5rem 0.8rem;
    min-width: 220px;
    max-width: 280px;
    width: 280px;
  }

  .avatar-wrap {
    position: relative;
    flex-shrink: 0;
  }

  .avatar {
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 50%;
    display: block;
  }

  .dot {
    position: absolute;
    bottom: -1px;
    right: -1px;
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 50%;
  }

  .dot.online {
    background: #3ba55c;
  }
  .dot.idle {
    background: #faa61a;
  }
  .dot.dnd {
    background: #ed4245;
  }
  .dot.offline {
    background: var(--text-dim);
  }

  .offline-bar {
    background: none;
    padding: 0;
    border-radius: 0;
  }

  .offline-text {
    font-family: var(--body);
    font-size: 0.95rem;
    font-weight: 300;
    color: var(--text-dim);
    font-style: italic;
  }

  /* ── info ── */
  .info {
    display: flex;
    flex-direction: column;
    gap: 0.05rem;
    min-width: 0;
  }

  .name {
    font-family: var(--body);
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text);
    line-height: 1.2;
  }

  .activity-line {
    display: flex;
    align-items: center;
    font-family: var(--body);
    font-size: 0.82rem;
    font-weight: 300;
    color: var(--text-dim);
    white-space: nowrap;
    overflow: hidden;
    line-height: 1.3;
  }

  .scroll-track {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
  }

  .activity-line.scrolling .scroll-track {
    -webkit-mask-image: linear-gradient(to right, black 75%, transparent 100%);
    mask-image: linear-gradient(to right, black 75%, transparent 100%);
  }

  .scroll-content {
    display: inline-flex;
    white-space: nowrap;
  }

  .scroll-text-inner {
    padding-right: 2rem;
  }

  .scroll-content.animate {
    animation: marquee 8s linear infinite;
  }

  @keyframes marquee {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }

  .note {
    width: 0.75rem;
    height: 0.75rem;
    flex-shrink: 0;
    margin-right: 0.25rem;
  }

  /* ── general ── */
  .general {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
  }

  .q {
    font-family: var(--body);
    font-size: 0.95rem;
    font-weight: 300;
    color: var(--text-dim);
    line-height: 1.4;
  }

  .q em {
    font-style: italic;
    color: var(--accent);
    font-weight: 400;
  }

  .items {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .item {
    font-family: var(--body);
    font-size: 0.95rem;
    font-weight: 400;
    color: var(--text);
    opacity: 0.5;
  }
</style>
