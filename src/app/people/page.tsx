import React, { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PeopleDirectoryView } from "@/components/content/PeopleDirectoryView";
import { getDynamicPeople } from "@/lib/api";
import Link from "@/components/ui/AppLink";
import { FiClock, FiArrowRight } from "react-icons/fi";

export const metadata = {
  title: "People & Leadership Directory | IEEE MAIT Student Branch",
  description:
    "Meet the executive committee, branch counselors, technical chapter chairs, and student volunteers leading IEEE MAIT, WIE MAIT, and EDS MAIT.",
};

export const revalidate = 60; // ISR Cache for 60 seconds

export default async function PeoplePage() {
  const allPeople = await getDynamicPeople();

  // 1. Faculty Counsellors
  const counsellors = allPeople.filter((p: any) => {
    const roleLower = (p.role || "").toLowerCase();
    const catLower = (p.category || "").toLowerCase();
    return (
      p.isFacultyAdvisor === true ||
      catLower.includes("counsellor") ||
      catLower.includes("counselor") ||
      roleLower.includes("counsellor") ||
      roleLower.includes("counselor") ||
      roleLower.includes("faculty advisor") ||
      p.id === "p-1"
    );
  });

  // 2. Branch Mentors & Senior Advisory Board
  const mentors = allPeople
    .filter((p: any) => {
      if (counsellors.some((c: any) => c.id === p.id)) return false;
      const catLower = (p.category || "").toLowerCase();
      const roleLower = (p.role || "").toLowerCase();
      return (
        p.id.startsWith("p-m") ||
        catLower === "mentor" ||
        catLower.includes("mentor") ||
        roleLower === "mentor" ||
        roleLower.includes("mentor") ||
        (roleLower.includes("advisor") && !p.isFacultyAdvisor)
      );
    })
    .sort((a: any, b: any) => (a.hierarchy ?? 99) - (b.hierarchy ?? 99));

  // 3. Main Student Branch ExeCom
  const sbExecom = allPeople
    .filter((p: any) => {
      if (
        counsellors.some((c: any) => c.id === p.id) ||
        mentors.some((m: any) => m.id === p.id)
      )
        return false;
      const catLower = (p.category || "").toLowerCase();
      const roleLower = (p.role || "").toLowerCase();
      const isEds =
        p.id.startsWith("p-eds") ||
        p.chapterId === "eds" ||
        roleLower.includes("eds");
      const isWie =
        p.id.startsWith("p-wie") ||
        p.chapterId === "wie" ||
        roleLower.includes("wie");
      const isOp = p.id.startsWith("p-op") || catLower.includes("operational");
      if (isEds || isWie || isOp) return false;
      return (
        p.id.startsWith("p-sec") ||
        catLower.includes("senior executive committee") ||
        catLower.includes("execom") ||
        catLower.includes("sec")
      );
    })
    .sort((a: any, b: any) => (a.hierarchy ?? 99) - (b.hierarchy ?? 99));

  // 4. WIE MAIT ExeCom
  const wieExecom = allPeople
    .filter((p: any) => {
      const cId = (p.chapterId || p.chapterSlug || "").toLowerCase();
      const roleLower = (p.role || "").toLowerCase();
      const catLower = (p.category || "").toLowerCase();
      return (
        p.id.startsWith("p-wie") ||
        cId === "wie" ||
        roleLower.includes("wie") ||
        catLower.includes("wie")
      );
    })
    .sort((a: any, b: any) => (a.hierarchy ?? 99) - (b.hierarchy ?? 99));

  // 5. EDS MAIT ExeCom
  const edsExecom = allPeople
    .filter((p: any) => {
      const cId = (p.chapterId || p.chapterSlug || "").toLowerCase();
      const roleLower = (p.role || "").toLowerCase();
      const catLower = (p.category || "").toLowerCase();
      return (
        p.id.startsWith("p-eds") ||
        cId === "eds" ||
        roleLower.includes("eds") ||
        catLower.includes("eds")
      );
    })
    .sort((a: any, b: any) => (a.hierarchy ?? 99) - (b.hierarchy ?? 99));

  // 6. Operational & Technical Leads
  const operationalLeads = allPeople
    .filter((p: any) => {
      if (
        counsellors.some((c: any) => c.id === p.id) ||
        mentors.some((m: any) => m.id === p.id) ||
        sbExecom.some((s: any) => s.id === p.id) ||
        wieExecom.some((w: any) => w.id === p.id) ||
        edsExecom.some((e: any) => e.id === p.id)
      ) {
        return false;
      }
      return true;
    })
    .sort((a: any, b: any) => (a.hierarchy ?? 99) - (b.hierarchy ?? 99));

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white dark:bg-gray-950 transition-colors duration-200 page-enter">
        <Container size="wide">
          {/* Breadcrumbs */}
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "People & Leadership" },
            ]}
          />

          {/* Header Banner with Direct Link to Leadership Archive */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-warm-200 dark:border-gray-800 pb-6">
            <SectionHeading
              category="Organization Map"
              title="People & Leadership"
              subtitle="The Branch Counsellor, Advisory Mentors, Executive Committees, and Operational Leads guiding IEEE MAIT, WIE, and EDS."
              className="mb-0 max-w-2xl"
            />

            <Link
              href="/people/archive"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-warm-100/90 dark:bg-gray-900 hover:bg-ieee-subtle dark:hover:bg-sky-950 text-ink dark:text-gray-200 hover:text-ieee-blue dark:hover:text-sky-400 border border-warm-200/90 dark:border-gray-800 rounded-xl font-mono text-xs font-semibold transition-all shrink-0 self-start md:self-center shadow-xs hover:border-ieee-blue/30"
            >
              <FiClock className="w-4 h-4 text-ieee-blue dark:text-sky-400" />
              <span>Leadership Archive (2005–Present)</span>
              <FiArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>

          {/* Interactive Team Segmented Directory */}
          <Suspense
            fallback={
              <div className="p-12 text-center font-mono text-sm text-warm-400">
                Loading leadership directory...
              </div>
            }
          >
            <PeopleDirectoryView
              counsellors={counsellors}
              mentors={mentors}
              sbExecom={sbExecom}
              wieExecom={wieExecom}
              edsExecom={edsExecom}
              operationalLeads={operationalLeads}
            />
          </Suspense>

          {/* Leadership Archive Transition Banner */}
          <div className="mt-20 p-8 border border-warm-200 dark:border-gray-800 bg-warm-50/60 dark:bg-gray-900/60 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-ieee-blue dark:text-sky-400 uppercase tracking-wider">
                  Historical Record
                </span>
                <span className="font-mono text-[10px] bg-warm-200 dark:bg-gray-800 text-warm-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
                  Since 2005
                </span>
              </div>
              <h4 className="font-serif text-2xl text-ink dark:text-gray-100 font-normal">
                Past Leadership & Historical ExeCom Archive
              </h4>
              <p className="text-xs text-warm-500 dark:text-gray-300 font-sans max-w-xl leading-relaxed">
                Explore executive committee rosters, leadership tenures, and
                student contributions across every academic year since our
                founding in 2005.
              </p>
            </div>

            <Link
              href="/people/archive"
              className="inline-flex items-center gap-2 px-6 py-3 bg-ieee-blue hover:bg-ieee-dark dark:bg-sky-600 dark:hover:bg-sky-700 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm shrink-0"
            >
              <span>Explore All Archive Years</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
