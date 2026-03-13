<script lang="ts">
  import Presence from "$lib/components/Presence.svelte";
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";
  import { SiGithub, SiDiscord, SiInstagram } from "@icons-pack/svelte-simple-icons";

  let { data } = $props();

  const projects = [
    {
      name: "nix",
      description: "nixos configs for ~5 hosts + homelab",
      repo: "https://github.com/xhos/nix",
      lang: "nix",
      details: "declarative configs for my desktop, laptop, server and a few other hosts. managed with flakes, home-manager for user env, and a bunch of custom modules.",
      screenshots: [] as string[],
    },
    {
      name: "null",
      description: "way too complex of a finance tracker im making for my personal use",
      repo: "https://github.com/xhos/null-core",
      lang: "go",
      details: "a personal finance tracker with transaction ingestion, category rules, and a tui. probably overkill but that's the point.",
      screenshots: [] as string[],
    },
    {
      name: "yawn",
      description: "a minimalistic yet good-looking TUI greeter",
      repo: "https://github.com/xhos/yawn",
      lang: "go",
      details: "a login greeter for wayland/tty that stays out of your way. just a username, password, and session picker.",
      screenshots: [] as string[],
    },
  ];

  let expandedProject = $state<string | null>(null);
  function toggleProject(name: string) {
    expandedProject = expandedProject === name ? null : name;
  }

  const langColor: Record<string, string> = {
    nix: "#7ebae4",
    go: "#00add8",
    typescript: "#3178c6",
    python: "#3572a5",
  };

  const uses = [
    {
      label: "hardware",
      items: [
        { name: "desktop", detail: "rtx3060/i9 9900k/32gb ram" },
        { name: "laptop", detail: "samsung galaxy book2 pro 360 (i7 1260p/16gb ram)" },
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

  // scroll reveal
  onMount(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    for (const el of els) io.observe(el);
    return () => io.disconnect();
  });
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
        <h1 class="title">xhos</h1>
        <div class="socials">
          <a href="https://github.com/xhos" target="_blank" rel="noopener" aria-label="GitHub">
            <SiGithub size={20} />
          </a>
          <a href="https://discord.com/users/383623763360481282" target="_blank" rel="noopener" aria-label="Discord">
            <SiDiscord size={20} />
          </a>
          <a href="https://www.instagram.com/mark.kdrv/" target="_blank" rel="noopener" aria-label="Instagram">
            <SiInstagram size={20} />
          </a>
        </div>
      </div>
      <div class="hero-right">
        <Presence status={data.status} />
      </div>
    </div>
  </section>

  <!-- about -->
  <section class="about reveal">
    <p>test test test test text test test test test text test test test test text test test test test text test test test test text test test test test text test test test test text.</p>
  </section>

  <!-- posts -->
  {#if data.posts.length > 0}
    <section class="band right reveal">
      <h2 class="ghost">posts</h2>
      <div class="band-content">
        <ul class="card-list">
          {#each data.posts as post}
            <li>
              <a href="/blog/{post.slug}" class="card">
                <div class="card-row">
                  <span class="card-title">{post.title}</span>
                  <span class="card-meta">{new Date(post.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                </div>
                {#if post.description}
                  <span class="card-desc">{post.description}</span>
                {/if}
              </a>
            </li>
          {/each}
        </ul>
        <a href="/blog" class="link-arrow">all posts →</a>
      </div>
    </section>
  {/if}

  <!-- projects -->
  <section class="band left overlap reveal">
    <h2 class="ghost">projects</h2>
    <div class="band-content">
      <ul class="card-list">
        {#each projects as project}
          {@const open = expandedProject === project.name}
          <li>
            <div class="card" class:open role="button" tabindex="0"
              onclick={() => toggleProject(project.name)}
              onkeydown={(e) => e.key === 'Enter' && toggleProject(project.name)}>
              <div class="card-row">
                <span class="card-title mono">{project.name}</span>
                <div class="card-row-right">
                  <span class="card-lang"><span class="lang-dot" style="background: {langColor[project.lang] ?? 'var(--accent)'}"></span>{project.lang}</span>
                  <span class="chevron" class:rotated={open}>›</span>
                </div>
              </div>
              <span class="card-desc">{project.description}</span>

              {#if open}
                <div class="card-expanded" transition:slide={{ duration: 220 }}>
                  {#if project.screenshots.length > 0}
                    <div class="screenshots">
                      {#each project.screenshots as src}
                        <img {src} alt="{project.name} screenshot" />
                      {/each}
                    </div>
                  {/if}
                  <p class="card-details">{project.details}</p>
                  <a href={project.repo} target="_blank" rel="noopener" class="repo-link" onclick={(e) => e.stopPropagation()}>
                    <SiGithub size={13} /> view on github
                  </a>
                </div>
              {/if}
            </div>
          </li>
        {/each}
      </ul>
    </div>
  </section>

  <!-- uses -->
  <section class="band right overlap reveal">
    <h2 class="ghost">uses</h2>
    <div class="band-content">
      {#each uses as section}
        <div class="uses-group">
          <span class="uses-label">{section.label}</span>
          <dl class="uses-dl">
            {#each section.items as item}
              <div class="uses-row">
                <dt>{item.name}</dt>
                <dd>{item.detail}</dd>
              </div>
            {/each}
          </dl>
        </div>
      {/each}
    </div>
  </section>

  <footer class="footer">
    <p>this is my personal website. you can see my professional one at <a href="https://kdrv.me" target="_blank" rel="noopener">kdrv.me</a></p>
  </footer>
</div>

<style>
  .ocean {
    --pad: clamp(1.5rem, 5vw, 4rem);
    background:
      radial-gradient(ellipse 120% 28% at 50% 0%, #0b2d5a 0%, transparent 100%),
      radial-gradient(ellipse 50% 18% at 12% 42%, #051830 0%, transparent 100%),
      radial-gradient(ellipse 35% 14% at 90% 38%, #040f20 0%, transparent 100%),
      linear-gradient(180deg, #030e1d 0%, #020a16 25%, #010810 50%, #000406 100%);
  }

  /* ━━━ scroll reveal ━━━ */
  :global(.reveal) {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1);
  }
  :global(.reveal.visible) {
    opacity: 1;
    transform: translateY(0);
  }

  /* ━━━ hero ━━━ */
  .hero {
    min-height: 100svh;
    padding: 2.5rem var(--pad) 4rem;
    display: flex; flex-direction: column; justify-content: flex-end;
    position: relative; overflow: hidden;
  }
  .rays { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
  .ray { position: absolute; top: -25%; transform-origin: top center; }
  .ray:nth-child(1) {
    left: 22%; width: 140px; height: 75%;
    background: linear-gradient(180deg, rgba(62,173,213,0.07) 0%, transparent 80%);
    transform: rotate(6deg); animation: ray 14s ease-in-out infinite alternate;
  }
  .ray:nth-child(2) {
    left: 52%; width: 90px; height: 65%;
    background: linear-gradient(180deg, rgba(62,173,213,0.05) 0%, transparent 70%);
    transform: rotate(-4deg); animation: ray 18s ease-in-out infinite alternate-reverse;
  }
  .ray:nth-child(3) {
    left: 72%; width: 110px; height: 70%;
    background: linear-gradient(180deg, rgba(62,173,213,0.06) 0%, transparent 75%);
    transform: rotate(9deg); animation: ray 16s 2s ease-in-out infinite alternate;
  }
  .particles { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
  .p {
    position: absolute; width: 2px; height: 2px; border-radius: 50%;
    background: rgba(62,173,213,0.3);
    left: calc(5% + var(--i) * 6.8%); top: calc(15% + var(--i) * 4.8%);
    animation: float calc(5s + var(--i) * 1s) ease-in-out infinite alternate;
    animation-delay: calc(var(--i) * -0.7s); opacity: calc(0.15 + var(--i) * 0.03);
  }
  .p:nth-child(even) { width: 3px; height: 3px; background: rgba(62,173,213,0.15); }
  .hero-inner {
    position: relative; z-index: 2;
    display: flex; justify-content: space-between; align-items: flex-end; gap: 3rem;
  }
  .hero-left {
    display: flex; flex-direction: column; gap: 1.25rem;
    animation: fadeUp 1s cubic-bezier(0.16,1,0.3,1) both;
  }
  .title {
    font-family: var(--display);
    font-size: clamp(5.5rem, 15vw, 11rem);
    font-weight: 800; line-height: 0.88; letter-spacing: -0.03em; color: var(--text);
  }
  .socials { display: flex; gap: 0.85rem; }
  .socials a { color: var(--text-dim); transition: color 0.25s, transform 0.25s; display: flex; }
  .socials a:hover { color: var(--accent); transform: translateY(-2px); }
  .hero-right {
    animation: fadeUp 1s 0.15s cubic-bezier(0.16,1,0.3,1) both;
    flex-shrink: 0; padding-bottom: 0.15rem;
  }

  /* ━━━ about ━━━ */
  .about {
    padding: 5rem var(--pad) 2rem;
    max-width: 500px;
    margin-left: calc(var(--pad) + 8%);
  }
  .about p {
    font-family: var(--body);
    font-size: 1.05rem;
    font-weight: 300;
    color: var(--text-dim);
    line-height: 1.7;
  }

  /* ━━━ bands ━━━ */
  .band {
    position: relative;
    padding: 5rem var(--pad) 2rem;
    z-index: 1;
  }
  .band.overlap { margin-top: -4rem; z-index: 0; }

  .band-content {
    position: relative; z-index: 1;
    max-width: 500px;
    display: flex; flex-direction: column; gap: 1rem;
  }

  .band.right .band-content { margin-left: auto; margin-right: 8%; }
  .band.left  .band-content { margin-left: 8%; }

  /* ━━━ ghost headings ━━━ */
  .ghost {
    font-family: var(--display);
    font-size: clamp(3rem, 8vw, 5.5rem);
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1;
    color: var(--text);
    opacity: 0.08;
    position: absolute;
    top: 1.5rem;
    z-index: 0;
    pointer-events: none;
    white-space: nowrap;
  }
  .band.right .ghost { right: calc(var(--pad) + 8%); }
  .band.left  .ghost { left: calc(var(--pad) + 8%); }

  /* ━━━ cards ━━━ */
  .card-list {
    list-style: none;
    display: flex; flex-direction: column; gap: 0.25rem;
  }

  .card {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    padding: 0.75rem 1rem;
    border-radius: 10px;
    background: rgba(3, 10, 20, 0.45);
    border: 1px solid transparent;
    transition: background 0.3s, border-color 0.3s, transform 0.2s;
  }
  .card:hover, .card.open {
    background: rgba(5, 15, 28, 0.6);
    border-color: rgba(62,173,213,0.12);
  }
  .card:hover { transform: translateY(-2px); }
  .card.open  { transform: none; cursor: default; }

  .card { cursor: pointer; user-select: none; }

  .card-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;
  }

  .card-row-right {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    flex-shrink: 0;
  }

  .chevron {
    font-size: 1rem;
    color: var(--text-dim);
    line-height: 1;
    display: inline-block;
    transition: transform 0.2s;
    transform: rotate(0deg);
  }
  .chevron.rotated { transform: rotate(90deg); }

  .card-expanded {
    margin-top: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    overflow: hidden;
  }

  .screenshots {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    border-radius: 6px;
  }
  .screenshots img {
    height: 120px;
    width: auto;
    border-radius: 6px;
    object-fit: cover;
    flex-shrink: 0;
  }

  .card-details {
    font-size: 0.88rem;
    font-weight: 300;
    color: var(--text-dim);
    line-height: 1.6;
    border-top: 1px solid rgba(62,173,213,0.08);
    padding-top: 0.6rem;
  }

  .repo-link {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-family: var(--mono);
    font-size: 0.75rem;
    color: var(--text-dim);
    transition: color 0.2s;
    width: fit-content;
  }
  .repo-link:hover { color: var(--accent); }

  .card-title {
    font-size: 1rem; font-weight: 500; color: var(--text);
    transition: color 0.2s;
  }
  .card-title.mono { font-family: var(--mono); }
  .card:hover .card-title { color: var(--accent); }

  .card-meta {
    font-family: var(--mono); font-size: 0.75rem; color: var(--text-dim);
    flex-shrink: 0;
  }

  .card-lang {
    display: flex; align-items: center; gap: 0.4rem;
    font-family: var(--mono); font-size: 0.75rem; color: var(--text-dim);
    flex-shrink: 0;
  }

  .lang-dot {
    width: 0.5rem; height: 0.5rem;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .card-desc {
    font-size: 0.9rem; font-weight: 300; color: var(--text-dim);
    line-height: 1.5;
  }

  .link-arrow {
    font-family: var(--mono); font-size: 0.8rem; color: var(--text-dim);
    letter-spacing: 0.04em; transition: color 0.2s;
    padding-left: 1rem;
  }
  .link-arrow:hover { color: var(--accent); }

  /* ━━━ uses ━━━ */
  .uses-group + .uses-group { margin-top: 1.75rem; }

  .uses-label {
    display: block;
    font-family: var(--mono); font-size: 0.7rem; color: var(--accent);
    text-transform: uppercase; letter-spacing: 0.12em;
    margin-bottom: 0.65rem;
  }

  .uses-dl { display: flex; flex-direction: column; gap: 0.35rem; }

  .uses-row {
    display: flex; align-items: baseline; gap: 1rem;
    font-size: 0.95rem; line-height: 1.5;
  }
  .uses-row dt { font-weight: 500; color: var(--text); min-width: 7rem; flex-shrink: 0; }
  .uses-row dd { font-weight: 300; color: var(--text-dim); }

  /* ━━━ footer ━━━ */
  .footer { padding: 3rem var(--pad) 3rem; text-align: center; }
  .footer p { font-family: var(--mono); font-size: 0.75rem; color: var(--text-dim); opacity: 0.65; }
  .footer a { color: var(--accent); transition: color 0.2s; }
  .footer a:hover { color: var(--text); }

  /* ━━━ animations ━━━ */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes ray {
    0%   { opacity: 0.7; transform: rotate(var(--r, 6deg)) translateX(0); }
    50%  { opacity: 0.3; }
    100% { opacity: 0.7; transform: rotate(calc(var(--r, 6deg) + 4deg)) translateX(25px); }
  }
  @keyframes float {
    from { transform: translateY(0) translateX(0); }
    to   { transform: translateY(-20px) translateX(5px); }
  }

  /* ━━━ mobile ━━━ */
  @media (max-width: 768px) {
    .hero { padding: 2rem 1.5rem 3rem; }
    .hero-inner { flex-direction: column; align-items: flex-start; gap: 3rem; }
    .about { margin-left: 0; padding: 3rem 1.5rem 1rem; max-width: none; }
    .band { padding: 3rem 1.5rem 1.5rem; }
    .band.overlap { margin-top: 0; }
    .band-content { max-width: none; margin-left: 0 !important; margin-right: 0 !important; }
    .ghost { position: relative; top: auto; left: auto !important; right: auto !important; margin-bottom: 0.5rem; white-space: normal; font-size: clamp(2rem, 12vw, 3rem); }
    .uses-row { flex-direction: column; gap: 0.1rem; }
    .uses-row dt { min-width: 0; }
  }
</style>
