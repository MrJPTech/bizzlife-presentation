<p align="center">
  <img src="https://img.shields.io/badge/PRSMTECH-Client_Project-FF0040?style=for-the-badge&labelColor=000000" alt="PRSMTECH Client Project"/>
</p>

<h1 align="center">
  <br>
  BizzLife Entertainment
  <br>
  <sub>Client Presentation & Project Overview</sub>
</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Pending_Approval-FFD700?style=flat-square&labelColor=1a1a2e" alt="Status"/>
  <img src="https://img.shields.io/badge/Investment-$50,000-00D4AA?style=flat-square&labelColor=1a1a2e" alt="Investment"/>
  <img src="https://img.shields.io/badge/Timeline-14_Weeks-FF0040?style=flat-square&labelColor=1a1a2e" alt="Timeline"/>
  <img src="https://img.shields.io/badge/Stack-Next.js_15-black?style=flat-square&logo=next.js" alt="Next.js"/>
</p>

---

## Overview

Interactive client presentation for **BizzLife Entertainment** - a revolutionary music industry platform connecting independent artists with record label opportunities.

### Two Interconnected Platforms

| Platform | Purpose | Revenue Model |
|----------|---------|---------------|
| **BizzLife.com** | Record label hub showcasing signed artists | Streaming, merchandise, sync licensing |
| **PleaseListenToMyMusic.com** | Artist submission portal | $5/track submission fee |

---

## Live Presentation

**Production URL:** [bizz.prsmtechdemos.com](https://bizz.prsmtechdemos.com)

### Navigation

| Key | Action |
|-----|--------|
| `→` / `Space` | Next slide |
| `←` | Previous slide |
| `Esc` | Overview mode |
| `F` | Fullscreen |
| `S` | Speaker notes |

### PDF Export

1. Add `?print-pdf` to URL
2. Open browser print dialog (`Ctrl/Cmd + P`)
3. Select "Save as PDF"

---

## Tech Stack

```
Frontend     Next.js 15 + React 19 + TypeScript
Styling      Tailwind CSS 4 + Framer Motion
Backend      Supabase (PostgreSQL + Auth + Storage)
Payments     Stripe Connect + Webhooks
Deployment   Vercel (Edge Functions)
```

---

## Project Structure

```
bizzlife-project/
├── BIZZLIFE-PRESENTATION.html   # Interactive reveal.js presentation
├── PROJECT-PROPOSAL.md          # Full project scope & pricing
├── DATABASE-SCHEMA.sql          # PostgreSQL schema design
├── components/                  # React component library
│   ├── design-tokens.ts         # Design system tokens
│   ├── GlowButton.tsx           # Neon CTA buttons
│   ├── ArtistCard.tsx           # Artist showcase cards
│   ├── VideoHero.tsx            # Full-viewport video hero
│   ├── PricingCard.tsx          # Glassmorphism pricing
│   └── AudioPlayer.tsx          # Custom audio player
└── .memory-bank/                # Project context (Memory Bank)
```

---

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#000000` | Main background |
| `--accent-primary` | `#FF0040` | CTAs, highlights |
| `--accent-gold` | `#FFD700` | Premium features |
| `--text-primary` | `#FFFFFF` | Headings |
| `--text-secondary` | `#B0B0B0` | Body text |

**Typography:** Bebas Neue (display) + Inter (body)

---

## Development

This presentation is a single HTML file with embedded CSS and JavaScript. No build step required.

```bash
# Open locally
start BIZZLIFE-PRESENTATION.html

# Or serve with any HTTP server
npx serve .
```

---

## Deployment

Hosted on **Vercel** with custom domain configuration.

```bash
# Deploy to production
vercel --prod

# Configure domain
vercel domains add bizz.prsmtechdemos.com
```

---

## Timeline

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| **Phase 1** | 3 weeks | Core infrastructure, auth, database |
| **Phase 2** | 4 weeks | BizzLife.com artist pages |
| **Phase 3** | 4 weeks | PleaseListenToMyMusic.com submission system |
| **Phase 4** | 3 weeks | Integration, testing, launch |

---

## Contact

**PRSMTECH Development Team**

- **Jordan Ward** - Project Lead
- Email: admin@prsmtech.com
- Client: BizzLife Entertainment

---

<p align="center">
  <sub>Built with precision by <strong>PRSMTECH</strong> &copy; 2026</sub>
</p>
