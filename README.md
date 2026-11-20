# VoiceForUnheard

A comprehensive React website for speech education designed for hearing impaired learners. Built for Speech Education Teachers, families, and clinicians.

## Features

- **12 specialized program categories** covering auditory verbal therapy, articulation, sign language, literacy, and more
- **Research backed statistics** from WHO and Global Burden of Disease Study
- **Age adaptive learning paths** from infants to adults
- **Educator designed methodology** with five pillar framework
- **Responsive, accessible design** with modern UI

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build for Production

```bash
npm run build
npm run preview
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home with hero, stats, advantages, programs |
| `/statistics` | Global hearing impairment data and impact |
| `/why-therapy` | Why speech therapy matters |
| `/programs` | All 12 program categories |
| `/programs/:id` | Individual program details |
| `/age-groups` | Developmental pathways by age |
| `/methodology` | VoiceForUnheard five pillar approach |
| `/educator` | Meet the Speech Education Teacher |
| `/resources` | Organizations, research, tools |
| `/practice` | Free tools: Ling Six Sound check, milestone checklist |
| `/faq` | Frequently asked questions |
| `/contact` | Contact form (delivered via the visitor's email / WhatsApp) |
| `/consultation` | Request a consultation (no account needed) |
| `/privacy`, `/terms` | Privacy policy and terms of use (English + Urdu) |

## Configuration and safety switches

Copy `.env.example` to `.env.local`. Important flags:

- `VITE_PORTAL_ENABLED` (default **off**): the parent/educator/admin portals store data in the
  visitor's browser and cannot verify sign-in securely. They are excluded from the production
  bundle until a real backend (server-side auth + database, e.g. Supabase) replaces them.
  Staff sign-in is disabled in code, and no credentials are stored in the front end.
- `PAYMENTS_ENABLED` (default **off**): every `/api/payments/*` endpoint returns 503 until this is
  `true` on the server. Refunds additionally require `REFUND_ADMIN_TOKEN` as a Bearer token.
- `VITE_WHATSAPP_NUMBER`: when set, consultation and contact forms offer "Send on WhatsApp".

`npm run build` also writes one HTML file per public route with its own title, description and
Open Graph tags, plus `404.html`, `sitemap.xml` and `robots.txt` (see `server/prerenderMetaPlugin.js`).

## Tech Stack

- React 19
- React Router
- React Icons
- Vite
