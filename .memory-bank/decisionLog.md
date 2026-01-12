# Decision Log

**Project**: BizzLife Entertainment
**Last Updated**: January 11, 2026

## Technical Decisions

### DEC-001: Technology Stack Selection
**Date**: January 11, 2026
**Status**: Approved
**Decision**: Next.js 15 + React 19 + TypeScript + Tailwind CSS 4 + Supabase + Stripe

**Context**: Need modern, scalable stack for two interconnected platforms with real-time features, authentication, file storage, and payment processing.

**Alternatives Considered**:
1. MERN Stack (MongoDB, Express, React, Node) - Less integrated auth/storage
2. Laravel + Vue - PHP ecosystem, different skill requirements
3. Remix + Prisma - Newer, less ecosystem maturity

**Rationale**:
- Next.js 15 provides optimal performance with server components
- Supabase offers integrated auth, database, storage, and realtime
- Stripe is industry standard for payments with Connect for payouts
- TypeScript ensures type safety and better DX
- Tailwind CSS 4 enables rapid dark theme development

**Impact**: Determines development patterns, deployment strategy, and team skills required.

---

### DEC-002: Design System Direction
**Date**: January 11, 2026
**Status**: Approved
**Decision**: Dark theme with #FF0040 neon accent, Bebas Neue + Inter fonts, glassmorphism effects

**Context**: Client wants premium record label aesthetic similar to 300 Entertainment, The Orchard, 10K Projects.

**Alternatives Considered**:
1. Light theme with dark accents - Too corporate
2. Full gradient theme - Too trendy/dated quickly
3. Minimalist black/white - Lacks energy for music industry

**Rationale**:
- Dark theme aligns with music industry aesthetics
- Neon accent (#FF0040) provides energy and call-to-action visibility
- Glassmorphism creates depth and premium feel
- Bebas Neue for bold headlines, Inter for readable body text

**Impact**: All UI components follow this design system consistently.

---

### DEC-003: Database Architecture
**Date**: January 11, 2026
**Status**: Approved
**Decision**: PostgreSQL via Supabase with Row Level Security (RLS)

**Context**: Need secure multi-tenant database supporting both platforms with role-based access.

**Alternatives Considered**:
1. Separate databases per platform - Complexity, data duplication
2. MongoDB - Less suited for relational music/artist data
3. MySQL - Less advanced RLS features

**Rationale**:
- PostgreSQL handles complex relational queries for artist/track/submission data
- RLS provides security at database level
- Supabase offers easy management and realtime subscriptions
- Single database enables cross-platform features

**Impact**: All data access patterns use RLS policies for security.

---

### DEC-004: Submission Pricing Model
**Date**: January 11, 2026
**Status**: Approved
**Decision**: $5 per track submission, flat rate

**Context**: PleaseListenToMyMusic.com needs sustainable revenue model while remaining accessible.

**Alternatives Considered**:
1. $10/track - Higher barrier to entry
2. Subscription model - Recurring commitment deters casual users
3. Free with premium feedback - Harder to monetize
4. Tiered pricing ($5/$15/$25) - Added complexity

**Rationale**:
- $5 is accessible for aspiring artists
- Covers Stripe fees (~$0.45) with healthy margin
- Simple pricing reduces friction
- Volume-based revenue scales with platform growth

**Impact**: Payment flow, revenue projections, and pricing UI.

---

### DEC-005: Component Architecture
**Date**: January 11, 2026
**Status**: Approved
**Decision**: Client-side components with Framer Motion, using 'use client' directive

**Context**: Components need rich interactivity (animations, hover states, form handling).

**Alternatives Considered**:
1. Server components only - Limited interactivity
2. CSS-only animations - Less control and capabilities
3. GSAP - Heavier library, steeper learning curve

**Rationale**:
- Framer Motion provides declarative animation API
- 'use client' components handle interactive features
- Server components used for data fetching and layout
- Balance between interactivity and performance

**Impact**: Component structure and animation patterns.

---

## Pending Decisions

### DEC-006: Hosting Infrastructure
**Status**: Pending
**Options**:
1. Vercel (recommended) - Optimal for Next.js
2. AWS Amplify - More control, more complexity
3. Railway - Good DX, newer platform

**Needs**: Client input on infrastructure preferences and budget.

---

### DEC-007: Email Service Provider
**Status**: Pending
**Options**:
1. SendGrid - Established, good deliverability
2. Resend - Modern, developer-friendly
3. Postmark - Transactional email specialist

**Needs**: Volume estimates and email requirements.

---

## Decision Template

```markdown
### DEC-XXX: [Title]
**Date**: [Date]
**Status**: Proposed | Approved | Superseded
**Decision**: [Brief statement]

**Context**: [Why this decision is needed]

**Alternatives Considered**:
1. [Option 1] - [Pros/Cons]
2. [Option 2] - [Pros/Cons]

**Rationale**: [Why this option was chosen]

**Impact**: [Effects on project]
```

---
**Usage**: Document all significant technical and architectural decisions
