# Contributing to IEEE MAIT Student Branch Website

Thank you for your interest in contributing to the official **IEEE MAIT Student Branch website** (`IEEE-MAIT/student-branch-website`).

This website is an **open-source institutional project** developed and maintained by students at Maharaja Agrasen Institute of Technology, Delhi.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Runtime / Hosting**: Cloudflare Pages (`@opennextjs/cloudflare`)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS v4 (`@theme` definitions in `src/app/globals.css`)
- **Fonts**: Google Fonts (`Instrument Serif`, `Inter`, `JetBrains Mono`)
- **Icons**: Lucide React / Inline SVG

---

## 🎨 Design System Principles

Before opening a pull request, please adhere to our strict design system principles:

1. **Structured Editorial Aesthetics**:
   - Primary Brand Color: IEEE Blue (`#00629B`)
   - Text & Dark Elements: Ink (`#1A1A2E`)
   - Accent Color: Restrained MAIT Warm Maroon (`#8B2332`)
   - Font Pairing: `Instrument Serif` for headings, `Inter` for body text, `JetBrains Mono` for metadata & statistics.
2. **Precision & Shape Rules**:
   - `2px` border radius for buttons/inputs (`rounded-[2px]`).
   - Sharp `0px` borders for structural panels and image frames. No heavy drop shadows.
   - Use thin 1px rules (`border-warm-200`) and the 40px engineering grid pattern (`bg-grid-pattern`).
3. **Real Photography & Authenticity**:
   - Only real photographs from actual IEEE MAIT events and MAIT campus activities. No stock photos or AI-generated people.

---

## 🚀 Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/IEEE-MAIT/student-branch-website.git
   cd student-branch-website
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Build and test for Cloudflare Pages**:
   ```bash
   npm run build
   ```

---

## 🌿 Git Branch & PR Workflow

1. Fork the repo and create your feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Commit your changes with clear messages:
   ```bash
   git commit -m "feat(events): add past events filtering by academic year"
   ```
3. Push to your branch and open a Pull Request against `main`.

---

## 📬 Contact & Governance

For questions regarding website architecture or leadership roles, contact the **IEEE MAIT Webmaster / Executive Committee** at `mait.ieee.sb@gmail.com`.
