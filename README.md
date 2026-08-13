# IEEE MAIT Student Branch — Digital Platform & Institutional Archive

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](file:///home/rishab/Personal/WebDev/student-branch-website/LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](file:///home/rishab/Personal/WebDev/student-branch-website/CONTRIBUTING.md)

Official open-source digital platform, institutional identity, and archive for **IEEE MAIT Student Branch** at **Maharaja Agrasen Institute of Technology**, Rohini, Delhi. Established in 2005.

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
├── .github/                    # CI/CD Workflows, PR/Issue Templates, Governance
│   ├── ISSUE_TEMPLATE/         # Bug report & Feature request templates
│   ├── workflows/              # GitHub Actions CI workflow (ci.yml)
│   ├── CODE_OF_CONDUCT.md      # Contributor Covenant v2.1
│   ├── CODEOWNERS              # Mandatory code reviewers
│   ├── PULL_REQUEST_TEMPLATE.md# PR Checklist
│   └── SECURITY.md             # Security vulnerability reporting policy
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
├── .env.example                # Environment variables template
├── .dev.vars.example           # Cloudflare Wrangler dev variables template
├── open-next.config.ts         # OpenNext Cloudflare deployment config
├── wrangler.jsonc              # Cloudflare Wrangler configuration
├── CONTRIBUTING.md             # Student contributor guidelines
└── LICENSE                     # MIT Open Source License
```

---

## 💻 Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/IEEE-MAIT/student-branch-website.git
   cd student-branch-website
   ```

2. **Setup Environment Variables**:
   Copy template files to `.env` and `.dev.vars`:
   ```bash
   cp .env.example .env
   cp .dev.vars.example .dev.vars
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build and test for Cloudflare Pages**:
   ```bash
   npm run build
   ```

---

## 📜 Open Source & Community Governance

- **License**: [MIT License](file:///home/rishab/Personal/WebDev/student-branch-website/LICENSE)
- **Contributing Guidelines**: [CONTRIBUTING.md](file:///home/rishab/Personal/WebDev/student-branch-website/CONTRIBUTING.md)
- **Code of Conduct**: [CODE_OF_CONDUCT.md](file:///home/rishab/Personal/WebDev/student-branch-website/.github/CODE_OF_CONDUCT.md)
- **Security Policy**: [SECURITY.md](file:///home/rishab/Personal/WebDev/student-branch-website/.github/SECURITY.md)

---

## 🌐 Contact

- **Official Email**: `mait.ieee.sb@gmail.com`
- **Location**: Maharaja Agrasen Institute of Technology, PSP Area, Plot No-1, Sector-22, Rohini, Delhi-110086
- **GitHub Organization**: [IEEE-MAIT](https://github.com/IEEE-MAIT)

