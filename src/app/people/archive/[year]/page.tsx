/**
 * @file src/app/people/archive/[year]/page.tsx
 * @description Dynamic Leadership Archive Roster for a specific Academic Year (e.g. 2024-25).
 *
 * BRAND & UX SPECIFICATIONS:
 * - Decodes academic year URL parameters (e.g. 2024-25 -> 2024–25).
 * - Interactive academic year tabs to quickly navigate between archive terms.
 * - Displays counsellors, advisory mentors, SEC officers, leads, and chapter executives for that term.
 * - Features Annual Dossier Statistics Summary and Annual Activity Report access.
 * - Dual-mode theme tokens for light and dark backgrounds.
 *
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PersonCard } from "@/components/content/PersonCard";
import { StatMetric } from "@/components/content/StatMetric";
import { Button } from "@/components/ui/Button";
import { getDynamicPeopleByAcademicYear } from "@/lib/api";
import { PEOPLE_DATA } from "@/lib/data";
import Link from "@/components/ui/AppLink";
import {
  FiArrowRight,
  FiArrowLeft,
  FiCompass,
  FiAward,
  FiBookOpen,
  FiZap,
  FiCpu,
} from "react-icons/fi";

interface LeadershipArchiveYearPageProps {
  params: Promise<{ year: string }>;
}

const KNOWN_ARCHIVE_YEARS = Array.from({ length: 21 }, (_, i) => {
  const start = 2025 - i;
  const end = (start + 1).toString().slice(-2);
  return {
    label: `${start}–${end}`,
    slug: `${start}-${end}`,
    isCurrent: i === 0,
  };
});

export const revalidate = 60; // ISR Cache for 60 seconds

export async function generateStaticParams() {
  return KNOWN_ARCHIVE_YEARS.map((y) => ({
    year: y.slug,
  }));
}

export async function generateMetadata({
  params,
}: LeadershipArchiveYearPageProps) {
  const resolvedParams = await params;
  const rawYear = resolvedParams.year;
  const displayYear = rawYear.replace("-", "–");

  return {
    title: `Leadership Roster ${displayYear} | IEEE MAIT Student Branch`,
    description: `Executive committee and operational leadership roster for IEEE MAIT Student Branch during academic year ${displayYear}.`,
    openGraph: {
      title: `Leadership Roster ${displayYear} | IEEE MAIT`,
      description: `Official leadership record of IEEE MAIT Student Branch for ${displayYear}.`,
    },
  };
}

export default async function LeadershipArchiveYearPage({
  params,
}: LeadershipArchiveYearPageProps) {
  const resolvedParams = await params;
  const rawYear = resolvedParams.year;
  const displayYear = rawYear.replace("-", "–");

  let peopleForYear = await getDynamicPeopleByAcademicYear(rawYear);

  // If no DB records yet exist for this specific past year, fallback gracefully to PEOPLE_DATA for current term
  if (
    peopleForYear.length === 0 &&
    (rawYear === "2025-26" || displayYear === "2025–26")
  ) {
    peopleForYear = PEOPLE_DATA;
  }

  // Helper check for executive roles
  const isExecutiveRole = (role: string = "") => {
    const r = role.toLowerCase();
    return (
      r.includes("chair") ||
      r.includes("secretary") ||
      r.includes("treasurer") ||
      r.includes("web master") ||
      r.includes("webmaster") ||
      r.includes("hardware head") ||
      r.includes("head")
    );
  };

  // 1. Faculty Counsellors
  const counsellors = peopleForYear.filter((p: any) => {
    const roleLower = (p.role || "").toLowerCase();
    const catLower = (p.category || "").toLowerCase();
    return (
      p.isFacultyAdvisor ||
      catLower === "counsellor" ||
      (catLower === "counsellor / mentor" &&
        (roleLower.includes("counselor") ||
          roleLower.includes("counsellor") ||
          roleLower.includes("advisor") ||
          p.isFacultyAdvisor)) ||
      roleLower.includes("branch counsellor") ||
      roleLower.includes("branch counselor") ||
      roleLower.includes("faculty advisor")
    );
  });

  // 2. Branch Mentors & Senior Advisory
  const mentors = peopleForYear
    .filter((p: any) => {
      if (counsellors.some((c: any) => c.id === p.id)) return false;
      const catLower = (p.category || "").toLowerCase();
      const roleLower = (p.role || "").toLowerCase();
      return (
        catLower === "mentor" ||
        catLower.includes("mentor") ||
        roleLower === "mentor" ||
        roleLower.includes("mentor") ||
        (roleLower.includes("advisor") && !p.isFacultyAdvisor)
      );
    })
    .sort((a: any, b: any) => (a.hierarchy ?? 99) - (b.hierarchy ?? 99));

  // 3. Senior Executive Committee
  const sec = peopleForYear
    .filter((p: any) => {
      if (
        counsellors.some((c: any) => c.id === p.id) ||
        mentors.some((m: any) => m.id === p.id)
      )
        return false;
      const catLower = (p.category || "").toLowerCase();
      const roleLower = (p.role || "").toLowerCase();
      return (
        catLower === "sec" ||
        catLower === "senior executive committee" ||
        catLower === "execom" ||
        (isExecutiveRole(p.role) && !catLower.includes("operational"))
      );
    })
    .sort((a: any, b: any) => (a.hierarchy ?? 99) - (b.hierarchy ?? 99));

  // 4. Chapter & Affinity Group Leads
  const chapterLeads = peopleForYear
    .filter((p: any) => {
      if (
        counsellors.some((c: any) => c.id === p.id) ||
        mentors.some((m: any) => m.id === p.id) ||
        sec.some((s: any) => s.id === p.id)
      )
        return false;
      const catLower = (p.category || "").toLowerCase();
      const roleLower = (p.role || "").toLowerCase();
      return (
        catLower === "chapter leads" ||
        catLower === "affinity group leads" ||
        catLower === "sig leads" ||
        catLower.includes("eds") ||
        catLower.includes("wie") ||
        roleLower.includes("eds") ||
        roleLower.includes("wie") ||
        roleLower.includes("sig")
      );
    })
    .sort((a: any, b: any) => (a.hierarchy ?? 99) - (b.hierarchy ?? 99));

  // 5. Operational Leads
  const operationalLeads = peopleForYear
    .filter((p: any) => {
      return (
        !counsellors.some((c: any) => c.id === p.id) &&
        !mentors.some((m: any) => m.id === p.id) &&
        !sec.some((s: any) => s.id === p.id) &&
        !chapterLeads.some((cl: any) => cl.id === p.id)
      );
    })
    .sort((a: any, b: any) => (a.hierarchy ?? 99) - (b.hierarchy ?? 99));

  const totalOfficers = peopleForYear.length;

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white dark:bg-gray-950 transition-colors duration-200 page-enter">
        <Container size="default">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "People", href: "/people" },
              { label: "Leadership Archive", href: "/people/archive" },
              { label: displayYear },
            ]}
          />

          <SectionHeading
            category="Annual Institutional Dossier"
            title={`Leadership Roster — ${displayYear}`}
            subtitle={`The Executive Committee, Advisory Mentors, and Operational Leads who served during academic year ${displayYear}.`}
          />

          {/* Academic Year Tab Selector Bar */}
          <div className="flex flex-wrap items-center gap-2 pb-8 mb-8 border-b border-warm-200 dark:border-gray-800">
            <span className="font-mono text-xs font-semibold text-warm-400 dark:text-gray-400 uppercase tracking-wider mr-2">
              Select Term:
            </span>
            {KNOWN_ARCHIVE_YEARS.slice(0, 10).map((y) => {
              const isSelected = y.slug === rawYear || y.label === displayYear;
              return (
                <Link
                  key={y.slug}
                  href={`/people/archive/${y.slug}`}
                  className={`px-3 py-1.5 font-mono text-xs rounded-lg transition-all ${
                    isSelected
                      ? "bg-ieee-blue dark:bg-sky-600 text-white font-bold shadow-xs"
                      : "bg-warm-100/70 dark:bg-gray-800 text-ink dark:text-gray-200 hover:bg-ieee-subtle dark:hover:bg-sky-950 hover:text-ieee-blue dark:hover:text-sky-400 border border-warm-200 dark:border-gray-700"
                  }`}
                >
                  {y.label} {y.isCurrent ? "(Current)" : ""}
                </Link>
              );
            })}
          </div>

          {/* Annual Session Metrics Strip */}
          <div className="border border-warm-200 dark:border-gray-800 bg-warm-50/50 dark:bg-gray-900/50 p-6 rounded-xl mb-12 shadow-xs">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-warm-200 dark:divide-gray-800">
              <StatMetric
                label="Officers on Record"
                value={`${totalOfficers > 0 ? totalOfficers : "Archived"}`}
                description="Serving Executive Team"
              />
              <StatMetric
                label="Parent Unit"
                value="IEEE Delhi"
                description="Section Charter"
              />
              <StatMetric
                label="Academic Session"
                value={displayYear}
                description="Institutional Year"
              />
              <StatMetric
                label="Archive Status"
                value={totalOfficers > 0 ? "Verified" : "Physical Archive"}
                description="MAIT Branch Ledger"
              />
            </div>
          </div>

          {/* 1. Branch Counsellors */}
          <div className="mb-16 space-y-6">
            <div className="flex items-center justify-between border-b border-warm-200 dark:border-gray-800 pb-2">
              <div className="flex items-center gap-2">
                <FiBookOpen className="w-4 h-4 text-ieee-blue dark:text-sky-400" />
                <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-ieee-blue dark:text-sky-400">
                  Branch Counsellor & Advisory ({displayYear})
                </h3>
              </div>
              <span className="font-mono text-xs text-warm-400 dark:text-gray-500">
                {counsellors.length} Faculty
              </span>
            </div>

            {counsellors.length > 0 ? (
              <div className="grid grid-cols-1 gap-8">
                {counsellors.map((person: any) => (
                  <PersonCard
                    key={person.id}
                    name={person.name}
                    role={person.role}
                    category={person.category}
                    department={
                      person.department ||
                      "Department of Electrical & Electronics Engineering (EEE)"
                    }
                    academicYear={person.academicYear || displayYear}
                    imageUrl={person.imageUrl}
                    imageSrc={person.imageSrc}
                    linkedIn={person.linkedIn || person.linkedin}
                    github={person.github}
                    email={person.email}
                    bio={person.bio}
                    hierarchy="mentor"
                    size="mentor"
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm font-mono text-warm-400 dark:text-gray-500 italic bg-warm-50 dark:bg-gray-900 p-4 border border-warm-200 dark:border-gray-800 rounded-xl">
                Faculty mentor records for {displayYear} are recorded in IEEE
                MAIT institutional archives.
              </p>
            )}
          </div>

          {/* 2. Branch Mentors & Senior Advisory */}
          {mentors.length > 0 && (
            <div className="mb-16 space-y-6">
              <div className="flex items-center justify-between border-b border-warm-200 dark:border-gray-800 pb-2">
                <div className="flex items-center gap-2">
                  <FiCompass className="w-4 h-4 text-ieee-blue dark:text-sky-400" />
                  <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-ink dark:text-gray-200">
                    Branch Mentors & Advisory Board ({displayYear})
                  </h3>
                </div>
                <span className="font-mono text-xs text-warm-400 dark:text-gray-500">
                  {mentors.length} Mentors
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {mentors.map((person: any) => (
                  <PersonCard
                    key={person.id}
                    name={person.name}
                    role={person.role}
                    category={person.category}
                    department={
                      person.department ||
                      "Department of Electrical & Electronics Engineering (EEE)"
                    }
                    academicYear={person.academicYear || displayYear}
                    imageUrl={person.imageUrl}
                    imageSrc={person.imageSrc}
                    linkedIn={person.linkedIn || person.linkedin}
                    github={person.github}
                    email={person.email}
                    bio={person.bio}
                    hierarchy="advisory"
                    size="advisory"
                  />
                ))}
              </div>
            </div>
          )}

          {/* 3. Senior Executive Committee */}
          <div className="mb-16 space-y-6">
            <div className="flex items-center justify-between border-b border-warm-200 dark:border-gray-800 pb-2">
              <div className="flex items-center gap-2">
                <FiAward className="w-4 h-4 text-ieee-blue dark:text-sky-400" />
                <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-ink dark:text-gray-200">
                  Senior Executive Committee ({displayYear})
                </h3>
              </div>
              <span className="font-mono text-xs text-warm-400 dark:text-gray-500">
                {sec.length} Officers
              </span>
            </div>

            {sec.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {sec.map((person: any) => (
                  <PersonCard
                    key={person.id}
                    name={person.name}
                    role={person.role}
                    category={person.category}
                    department={person.department || undefined}
                    academicYear={person.academicYear || displayYear}
                    imageUrl={person.imageUrl}
                    imageSrc={person.imageSrc}
                    linkedIn={person.linkedIn || person.linkedin}
                    github={person.github}
                    email={person.email}
                    bio={person.bio}
                    hierarchy="featured"
                    size="featured"
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm font-mono text-warm-400 dark:text-gray-500 italic bg-warm-50 dark:bg-gray-900 p-4 border border-warm-200 dark:border-gray-800 rounded-xl">
                Executive Committee records for {displayYear} are preserved in
                the branch physical ledger.
              </p>
            )}
          </div>

          {/* 4. Society Chapters & Affinity Group Leadership */}
          {chapterLeads.length > 0 && (
            <div className="mb-16 space-y-6">
              <div className="flex items-center justify-between border-b border-warm-200 dark:border-gray-800 pb-2">
                <div className="flex items-center gap-2">
                  <FiZap className="w-4 h-4 text-ieee-blue dark:text-sky-400" />
                  <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-ink dark:text-gray-200">
                    Chapter & Affinity Group Leadership ({displayYear})
                  </h3>
                </div>
                <span className="font-mono text-xs text-warm-400 dark:text-gray-500">
                  {chapterLeads.length} Officers
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {chapterLeads.map((person: any) => (
                  <PersonCard
                    key={person.id}
                    name={person.name}
                    role={person.role}
                    category={person.category}
                    department={person.department || undefined}
                    academicYear={person.academicYear || displayYear}
                    imageUrl={person.imageUrl}
                    imageSrc={person.imageSrc}
                    linkedIn={person.linkedIn || person.linkedin}
                    github={person.github}
                    email={person.email}
                    bio={person.bio}
                    hierarchy="standard"
                    size="standard"
                  />
                ))}
              </div>
            </div>
          )}

          {/* 5. Operational Leads */}
          <div className="mb-16 space-y-6">
            <div className="flex items-center justify-between border-b border-warm-200 dark:border-gray-800 pb-2">
              <div className="flex items-center gap-2">
                <FiCpu className="w-4 h-4 text-ieee-blue dark:text-sky-400" />
                <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-ink dark:text-gray-200">
                  Operational & Technical Leads ({displayYear})
                </h3>
              </div>
              <span className="font-mono text-xs text-warm-400 dark:text-gray-500">
                {operationalLeads.length} Leads
              </span>
            </div>

            {operationalLeads.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {operationalLeads.map((person: any) => (
                  <PersonCard
                    key={person.id}
                    name={person.name}
                    role={person.role}
                    category={person.category}
                    department={person.department || undefined}
                    academicYear={person.academicYear || displayYear}
                    imageUrl={person.imageUrl}
                    imageSrc={person.imageSrc}
                    linkedIn={person.linkedIn || person.linkedin}
                    github={person.github}
                    email={person.email}
                    bio={person.bio}
                    hierarchy="operational"
                    size="operational"
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm font-mono text-warm-400 dark:text-gray-500 italic bg-warm-50 dark:bg-gray-900 p-4 border border-warm-200 dark:border-gray-800 rounded-xl">
                Operational leads for {displayYear} are documented in the branch
                annual reports available in Resources.
              </p>
            )}
          </div>

          {/* Back to main archive link */}
          <div className="pt-8 border-t border-warm-200 dark:border-gray-800 flex justify-between items-center flex-wrap gap-4">
            <Link
              href="/people/archive"
              className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-ieee-blue dark:text-sky-400 hover:underline"
            >
              <FiArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Leadership Archive Years</span>
            </Link>
            <span className="font-mono text-xs text-warm-400 dark:text-gray-500">
              IEEE MAIT Institutional Record · Est. 2005
            </span>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
