---
title: how i have my homelab network set up
date: 2025-02-15
description: VLANs, DNS, and why I stopped using my ISP's router.
---

This post is a placeholder. Here's roughly what it'll cover:

- Ditching the ISP router for something I actually control
- VLAN segmentation: trusted, IoT, guests, servers
- AdGuard Home for DNS + ad blocking
- Caddy as a reverse proxy for internal services
- Tailscale for remote access without port forwarding

The actual write-up is still in my notes. Coming soon.

## Current topology

```
ISP modem (bridge mode)
  └── router (OPNsense)
        ├── VLAN 10 — trusted
        ├── VLAN 20 — servers
        ├── VLAN 30 — IoT
        └── VLAN 40 — guest
```

More detail on each segment when I write this up properly.
