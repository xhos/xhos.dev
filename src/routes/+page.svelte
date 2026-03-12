<script lang="ts">
  import Presence from "$lib/components/Presence.svelte";

  let { data } = $props();

  const projects = [
    {
      name: "nix",
      description: "nixos configs for ~5 hosts + homelab ",
      repo: "https://github.com/xhos/nix",
      lang: "nix",
    },
    {
      name: "null",
      description:
        "way too complex of a finance tracker im making for my personal use",
      repo: "https://github.com/xhos/null-core",
      lang: "go",
    },
    {
      name: "yawn",
      description: "a minimalistic yet good-looking TUI greeter",
      repo: "https://github.com/xhos/yawn",
      lang: "go",
    },
  ];

  const uses = [
    {
      label: "hardware",
      items: [
        { name: "desktop", detail: "rtx3060/i9 9900k/32gb ram" },
        {
          name: "laptop",
          detail: "samsung galaxy book2 pro 360 (i7 1260p/16gb ram)",
        },
        { name: "server", detail: "dell optiplex 5050 (i5 7500/40gb ram)" },
        { name: "monitor", detail: "some 4k/160hz msi one" },
        { name: "keyboard", detail: "infi 75 (to be replaced soon-ish)" },
        { name: "mouse", detail: "logitech mx master 3s + g305" },
        { name: "headphones", detail: "sony wh-1000xm5" },
      ],
    },
    {
      label: "software",
      items: [
        { name: "editor", detail: "zed, sometimes nvim" },
        { name: "terminal", detail: "ghostty/foot" },
        { name: "shell", detail: "zsh + starship" },
        { name: "os", detail: "nixos btw" },
      ],
    },
  ];
</script>

<svelte:head>
  <title>xhos</title>
</svelte:head>

<div class="ocean">
  <section class="hero">
    <div class="rays">
      <div class="ray"></div>
      <div class="ray"></div>
      <div class="ray"></div>
    </div>

    <div class="particles">
      {#each Array(14) as _, i}
        <span class="p" style="--i:{i}"></span>
      {/each}
    </div>

    <div class="hero-inner">
      <div class="hero-left">
        <h1 class="name">xhos</h1>
        <div class="socials">
          <a
            href="https://github.com/xhos"
            target="_blank"
            rel="noopener"
            aria-label="GitHub"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"
              ><path
                d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
              /></svg
            >
          </a>
          <a
            href="https://discord.com/users/383623763360481282"
            target="_blank"
            rel="noopener"
            aria-label="Discord"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"
              ><path
                d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"
              /></svg
            >
          </a>
        </div>
      </div>
      <div class="hero-right">
        <Presence status={data.status} />
      </div>
    </div>
  </section>

  {#if data.posts.length > 0}
    <section id="blog" class="depth depth-posts">
      <div class="depth-inner">
        <span class="zone-label">recent</span>
        <ul class="posts">
          {#each data.posts as post}
            <li>
              <a href="/blog/{post.slug}" class="post-card">
                <div class="post-top">
                  <span class="post-title">{post.title}</span>
                  <span class="post-date"
                    >{new Date(post.date).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}</span
                  >
                </div>
                {#if post.description}
                  <span class="post-desc">{post.description}</span>
                {/if}
              </a>
            </li>
          {/each}
        </ul>
        <a href="/blog" class="see-all">all posts →</a>
      </div>
    </section>
  {/if}

  <section id="projects" class="depth depth-projects">
    <div class="depth-inner">
      <span class="zone-label">projects</span>
      <ul class="project-list">
        {#each projects as project}
          <li>
            <a
              href={project.repo}
              target="_blank"
              rel="noopener"
              class="project-card"
            >
              <div class="project-top">
                <span class="project-name">{project.name}</span>
                <span class="lang">{project.lang}</span>
              </div>
              <p class="project-desc">{project.description}</p>
            </a>
          </li>
        {/each}
      </ul>
    </div>
  </section>

  <section id="uses" class="depth depth-uses">
    <div class="depth-inner">
      <span class="zone-label">uses</span>
      <div class="uses-sections">
        {#each uses as section}
          <div class="uses-section">
            <span class="uses-label">{section.label}</span>
            <ul class="uses-list">
              {#each section.items as item}
                <li>
                  <span class="item-name">{item.name}</span>
                  <span class="item-detail">{item.detail}</span>
                </li>
              {/each}
            </ul>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <footer class="site-footer">
    <p>
      this is my personal website. you can see my professional one at <a
        href="https://kdrv.me"
        target="_blank"
        rel="noopener">kdrv.me</a
      >
    </p>
  </footer>
</div>

<style>
  .ocean {
    background: radial-gradient(
        ellipse 120% 28% at 50% 0%,
        #0b2d5a 0%,
        transparent 100%
      ),
      radial-gradient(ellipse 50% 18% at 12% 42%, #051830 0%, transparent 100%),
      radial-gradient(ellipse 35% 14% at 90% 38%, #040f20 0%, transparent 100%),
      linear-gradient(
        180deg,
        #030e1d 0%,
        #020a16 25%,
        #010810 50%,
        #000406 100%
      );
  }

  /* ─── hero ─── */
  .hero {
    min-height: 100svh;
    padding: 2.5rem 2.5rem 4rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    position: relative;
    overflow: hidden;
  }

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
    left: 22%;
    width: 140px;
    height: 75%;
    background: linear-gradient(
      180deg,
      rgba(62, 173, 213, 0.07) 0%,
      transparent 80%
    );
    transform: rotate(6deg);
    animation: ray 14s ease-in-out infinite alternate;
  }

  .ray:nth-child(2) {
    left: 52%;
    width: 90px;
    height: 65%;
    background: linear-gradient(
      180deg,
      rgba(62, 173, 213, 0.05) 0%,
      transparent 70%
    );
    transform: rotate(-4deg);
    animation: ray 18s ease-in-out infinite alternate-reverse;
  }

  .ray:nth-child(3) {
    left: 72%;
    width: 110px;
    height: 70%;
    background: linear-gradient(
      180deg,
      rgba(62, 173, 213, 0.06) 0%,
      transparent 75%
    );
    transform: rotate(9deg);
    animation: ray 16s 2s ease-in-out infinite alternate;
  }

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
    left: calc(5% + var(--i) * 6.8%);
    top: calc(15% + var(--i) * 4.8%);
    animation: float calc(5s + var(--i) * 1s) ease-in-out infinite alternate;
    animation-delay: calc(var(--i) * -0.7s);
    opacity: calc(0.15 + var(--i) * 0.03);
  }

  .p:nth-child(even) {
    width: 3px;
    height: 3px;
    background: rgba(62, 173, 213, 0.15);
  }

  .hero-inner {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 3rem;
  }

  .hero-left {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .name {
    font-family: var(--display);
    font-size: clamp(5.5rem, 15vw, 11rem);
    font-weight: 800;
    line-height: 0.88;
    letter-spacing: -0.03em;
    color: var(--text);
  }

  .socials {
    display: flex;
    gap: 0.85rem;
  }

  .socials a {
    color: var(--text-dim);
    transition:
      color 0.25s,
      transform 0.25s;
    display: flex;
  }

  .socials a:hover {
    color: var(--accent);
    transform: translateY(-2px);
  }

  .hero-right {
    animation: fadeUp 1s 0.15s cubic-bezier(0.16, 1, 0.3, 1) both;
    flex-shrink: 0;
    padding-bottom: 0.15rem;
  }

  /* ─── depth sections ─── */
  .depth {
    position: relative;
    padding: 0 2.5rem;
  }

  .depth-posts {
    padding-top: 4rem;
    padding-bottom: 4rem;
  }
  .depth-projects {
    padding-top: 4rem;
    padding-bottom: 4rem;
  }
  .depth-uses {
    padding-top: 4rem;
    padding-bottom: 4rem;
  }

  .depth-inner {
    max-width: var(--max-w);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .zone-label {
    font-family: var(--mono);
    font-size: 0.58rem;
    color: var(--text-dim);
    text-transform: uppercase;
    letter-spacing: 0.16em;
  }

  /* ─── posts ─── */
  .posts {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .post-card {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    padding: 0.9rem 1.1rem;
    border-radius: 10px;
    border: 1px solid rgba(10, 28, 48, 0.7);
    background: rgba(3, 10, 20, 0.45);
    transition:
      border-color 0.3s,
      background 0.3s;
  }

  .post-card:hover {
    border-color: rgba(62, 173, 213, 0.18);
    background: rgba(5, 15, 28, 0.6);
  }

  .post-top {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1.5rem;
  }

  .post-title {
    font-family: var(--body);
    font-size: 0.88rem;
    font-weight: 500;
    color: var(--text);
    transition: color 0.2s;
  }

  .post-card:hover .post-title {
    color: var(--accent);
  }

  .post-date {
    font-family: var(--mono);
    font-size: 0.6rem;
    color: var(--text-dim);
    flex-shrink: 0;
  }

  .post-desc {
    font-size: 0.78rem;
    font-weight: 300;
    color: var(--text-dim);
    line-height: 1.5;
  }

  .see-all {
    font-family: var(--mono);
    font-size: 0.62rem;
    color: var(--text-dim);
    letter-spacing: 0.06em;
    transition: color 0.2s;
  }

  .see-all:hover {
    color: var(--accent);
  }

  /* ─── projects ─── */
  .project-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .project-card {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    padding: 0.9rem 1.1rem;
    border-radius: 10px;
    border: 1px solid rgba(10, 28, 48, 0.7);
    background: rgba(3, 10, 20, 0.45);
    transition:
      border-color 0.3s,
      background 0.3s;
  }

  .project-card:hover {
    border-color: rgba(62, 173, 213, 0.18);
    background: rgba(5, 15, 28, 0.6);
  }

  .project-top {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
  }

  .project-name {
    font-family: var(--mono);
    font-size: 0.88rem;
    color: var(--text);
    opacity: 0.85;
    transition:
      color 0.2s,
      opacity 0.2s;
  }

  .project-card:hover .project-name {
    color: var(--accent);
    opacity: 1;
  }

  .lang {
    font-family: var(--mono);
    font-size: 0.6rem;
    color: var(--text-dim);
    letter-spacing: 0.04em;
  }

  .project-desc {
    font-size: 0.85rem;
    font-weight: 300;
    color: var(--text-dim);
    line-height: 1.55;
  }

  /* ─── uses ─── */
  .uses-sections {
    display: flex;
    flex-direction: column;
    gap: 2.25rem;
  }

  .uses-section {
    display: grid;
    grid-template-columns: 72px 1fr;
    gap: 0 2rem;
    align-items: start;
  }

  .uses-label {
    font-family: var(--mono);
    font-size: 0.62rem;
    color: var(--text-dim);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    padding-top: 0.15rem;
  }

  .uses-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
  }

  .uses-list li {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    font-size: 0.88rem;
  }

  .item-name {
    font-weight: 500;
    color: var(--text);
    opacity: 0.8;
    min-width: 130px;
    flex-shrink: 0;
  }

  .item-detail {
    font-weight: 300;
    color: var(--text-dim);
    font-size: 0.84rem;
  }

  /* ─── footer ─── */
  .site-footer {
    padding: 3rem 2.5rem 4rem;
    max-width: var(--max-w);
    margin: 0 auto;
  }

  .site-footer p {
    font-family: var(--mono);
    font-size: 0.62rem;
    color: var(--text-dim);
    opacity: 0.4;
    line-height: 1.6;
  }

  .site-footer a {
    color: var(--text-dim);
    transition: color 0.2s;
  }

  .site-footer a:hover {
    color: var(--accent);
  }

  /* ─── animations ─── */
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
      transform: rotate(calc(var(--r, 6deg) + 4deg)) translateX(25px);
    }
  }

  @keyframes float {
    from {
      transform: translateY(0) translateX(0);
    }
    to {
      transform: translateY(-20px) translateX(5px);
    }
  }

  @media (max-width: 680px) {
    .hero {
      padding: 2rem 1.5rem 3rem;
    }
    .hero-inner {
      flex-direction: column;
      align-items: flex-start;
      gap: 3rem;
    }
    .depth {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }
    .uses-section {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }
    .uses-list li {
      flex-direction: column;
      gap: 0.1rem;
    }
  }
</style>
