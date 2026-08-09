# IEEE MAIT Student Branch — Digital Platform & Institutional Archive

Official digital platform, institutional identity, and archive for **IEEE MAIT Student Branch** at **Maharaja Agrasen Institute of Technology**, Rohini, Delhi. Established in 2005.

---

## 🏛️ Identity & Architecture

- **Visual Direction**: "Structured Editorial" — Instrument Serif headlines, Inter body, JetBrains Mono statistics, engineering grid structural motif.
- **Brand Identity**: Primary IEEE Blue (`#00629B`), Ink (`#1A1A2E`), MAIT Warm Maroon (`#8B2332`), Warm Neutral Grays (`#F5F5F0`, `#E8E8E3`, `#9B9B8F`).
- **Core Platform**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4.
- **Edge Deployment**: Cloudflare Pages via `@opennextjs/cloudflare`.

---

## 📁 Repository Structure

```
student-branch-website/
├── public/                     # Static assets (logos, favicon)
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── about/              # About IEEE MAIT, Global IEEE, History, Impact
│   │   ├── people/             # Faculty Mentors, SEC, Operational Leads
│   │   ├── chapters/           # WIE Affinity Group & EDS Chapter
│   │   ├── events/             # Upcoming & Past Events
│   │   ├── achievements/       # Achievements Ledger
│   │   ├── stories/            # Technical articles & post-event reports
│   │   ├── gallery/            # Photo gallery & event albums
│   │   ├── join/               # Membership registration steps & FAQ
│   │   ├── contact/            # Official contact form & email
│   │   ├── globals.css         # Tailwind v4 theme & engineering grid motif
│   │   ├── layout.tsx          # Root layout with Google Fonts preloading
│   │   ├── not-found.tsx       # 404 page
│   │   └── page.tsx            # Editorial Homepage
│   └── components/
│       ├── layout/             # Navbar, Footer, Container
│       ├── ui/                 # Button, Badge, SectionHeading
│       └── content/            # PersonCard, EventPreview, AchievementRow, ChapterPanel, StatMetric
├── open-next.config.ts         # OpenNext Cloudflare deployment config
├── wrangler.jsonc              # Cloudflare Wrangler configuration
└── CONTRIBUTING.md             # Student contributor guidelines
```

---

## 💻 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start Next.js development server
npm run dev

# 3. Build for production Cloudflare Pages
npm run build
```

---

## 🌐 Contact

- **Official Email**: `mait.ieee.sb@gmail.com`
- **Location**: Maharaja Agrasen Institute of Technology, PSP Area, Plot No-1, Sector-22, Rohini, Delhi-110086
- **GitHub Organization**: [IEEE-MAIT](https://github.com/IEEE-MAIT)
