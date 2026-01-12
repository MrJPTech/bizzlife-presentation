# Product Context

**Project**: BizzLife Entertainment
**Last Updated**: January 11, 2026
**Status**: Pre-Development (Proposal Phase)

## Overview

Two interconnected music industry platforms:

1. **BizzLife.com** - Premium record label website showcasing signed artists, studio facilities, venue partnerships, and creator network
2. **PleaseListenToMyMusic.com** - Paid music submission platform ($5/track) enabling aspiring artists to submit tracks for professional A&R review

## Tech Stack

### Frontend
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion (animations)

### Backend
- Supabase (PostgreSQL)
- Supabase Auth (OAuth, magic links)
- Supabase Storage (audio files, images)
- Supabase Realtime (live updates)

### Payments
- Stripe (submissions)
- Stripe Connect (creator payouts)

### Infrastructure
- Vercel (hosting)
- Vercel Edge (CDN)

## Architecture

### BizzLife.com Structure
```
app/
├── page.tsx              # Home (video hero, stats, featured artists)
├── artists/
│   ├── page.tsx          # Artist roster grid
│   └── [slug]/page.tsx   # Individual artist profiles
├── studios/page.tsx      # Studio showcase
├── venues/page.tsx       # Partner venues
├── creators/page.tsx     # Influencer network
├── news/page.tsx         # Press & announcements
├── about/page.tsx        # Label history
└── contact/page.tsx      # Business inquiries
```

### PleaseListenToMyMusic.com Structure
```
app/
├── page.tsx              # Landing page
├── submit/page.tsx       # Upload flow + payment
├── pricing/page.tsx      # Submission tiers
├── how-it-works/page.tsx # Process explanation
├── success-stories/      # Featured discoveries
├── dashboard/            # Artist submission portal
└── admin/                # A&R review panel
```

## Key Features

### BizzLife.com
1. Video background hero with mobile fallbacks
2. Artist roster with grayscale-to-color hover effects
3. Animated statistics counters (streams, followers)
4. Studio booking system
5. Venue event calendars
6. Creator network directory
7. News/press section
8. Contact portal with categorized routing

### PleaseListenToMyMusic.com
1. $5 per track submission via Stripe
2. Drag-and-drop audio upload with progress
3. Genre-specific A&R review teams
4. Artist dashboard with submission status
5. Admin review panel with rating system
6. Professional feedback delivery
7. Success stories showcase

## User Roles
- **public** - Anonymous visitors
- **user** - Registered users
- **artist** - Signed artists (BizzLife)
- **a&r_team** - Genre-specific reviewers (PleaseListenToMyMusic)
- **admin** - Full system access

## External Integrations
- Spotify API (streaming stats display)
- YouTube API (video embeds, stats)
- Instagram API (social feeds)
- TikTok API (social stats)
- SoundCloud API (audio embeds)
- Stripe API (payments)
- SendGrid/Resend (transactional email)

## Environment Variables
```env
# See .env.local for actual values
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
```

## Design System

### Colors
- Background: #000000 (primary), #0A0A0A (secondary), #111111 (elevated)
- Accent: #FF0040 (neon red), #FFD700 (gold premium)
- Text: #FFFFFF (primary), #808080 (secondary)

### Typography
- Display: Bebas Neue
- Body: Inter

### Effects
- Glassmorphism cards
- Neon glow CTAs
- Grayscale-to-color image transitions
- Framer Motion animations

---
**Usage**: Update when architecture or major features change
