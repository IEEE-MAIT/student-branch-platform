"use client";

/**
 * @file src/components/content/HomeLeadershipSection.tsx
 * @description Mobile-Friendly & Proportionate Leadership Spotlight for the Homepage
 * showcasing top executive officers across IEEE MAIT Parent Student Branch, WIE Affinity Group, and EDS Chapter.
 *
 * FEATURES:
 * - Perfectly scaled, compact tab switcher (SB, WIE, EDS) with responsive labels for mobile.
 * - Scaled contextual unit summary banner with compact padding and concise typography.
 * - Compact 2-column mobile card grid scaling to 4-column on desktop.
 * - Maintains all sections and deep links without visual bulk or bloat.
 *
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import React, { useState } from "react";
import Link from "@/components/ui/AppLink";
import { Container } from "@/components/layout/Container";
import { PersonCard } from "@/components/content/PersonCard";
import {
  FiUsers,
  FiZap,
  FiCpu,
  FiArrowRight,
  FiExternalLink,
} from "react-icons/fi";

export interface LeaderPerson {
  id: string;
  name: string;
  role: string;
  category?: string;
  department?: string | null;
  academicYear?: string | null;
  imageUrl?: string | null;
  imageSrc?: string | null;
  linkedIn?: string | null;
  github?: string | null;
  email?: string | null;
  bio?: string | null;
  hierarchy?: number;
}

export interface HomeLeadershipSectionProps {
  sbLeadership: LeaderPerson[];
  wieLeadership: LeaderPerson[];
  edsLeadership: LeaderPerson[];
  totalMembers?: string;
}

type UnitKey = "sb" | "wie" | "eds";

interface UnitMeta {
  key: UnitKey;
  name: string;
  tabLabel: string;
  mobileTabLabel: string;
  badge: string;
  badgeStyle: string;
  activeTabClass: string;
  icon: React.ReactNode;
  description: string;
  portalHref: string;
  portalLabel: string;
}

const UNITS: Record<UnitKey, UnitMeta> = {
  sb: {
    key: "sb",
    name: "IEEE MAIT Student Branch",
    tabLabel: "Parent Student Branch",
    mobileTabLabel: "Parent SB",
    badge: "STUDENT BRANCH",
    badgeStyle:
      "bg-ieee-blue/10 dark:bg-sky-500/10 text-ieee-blue dark:text-sky-400 border-ieee-blue/30 dark:border-sky-500/30",
    activeTabClass: "bg-ieee-blue text-white shadow-xs",
    icon: <FiUsers className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />,
    description:
      "Governing executive committee steering overarching branch operations, flagship conferences, sponsorships, and multidisciplinary projects.",
    portalHref: "/about",
    portalLabel: "Branch Overview",
  },
  wie: {
    key: "wie",
    name: "IEEE Women in Engineering (WIE) MAIT",
    tabLabel: "WIE Affinity Group",
    mobileTabLabel: "WIE AG",
    badge: "AFFINITY GROUP",
    badgeStyle:
      "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
    activeTabClass: "bg-purple-600 text-white shadow-xs",
    icon: <FiZap className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />,
    description:
      "Dedicated affinity group empowering women in STEM, hosting mentorship circles, leadership roundtables, and technical bootcamps.",
    portalHref: "/chapters/wie",
    portalLabel: "Explore WIE Portal",
  },
  eds: {
    key: "eds",
    name: "IEEE Electron Devices Society (EDS) MAIT",
    tabLabel: "EDS Chapter",
    mobileTabLabel: "EDS Chapter",
    badge: "TECHNICAL CHAPTER",
    badgeStyle:
      "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
    activeTabClass: "bg-[#00629B] text-white shadow-xs",
    icon: <FiCpu className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />,
    description:
      "Specialized technical chapter advancing solid-state devices, semiconductor physics, 4-layer PCB design, and microelectronics.",
    portalHref: "/chapters/eds",
    portalLabel: "Explore EDS Portal",
  },
};

export const HomeLeadershipSection: React.FC<HomeLeadershipSectionProps> = ({
  sbLeadership = [],
  wieLeadership = [],
  edsLeadership = [],
  totalMembers = "150+",
}) => {
  const [activeUnit, setActiveUnit] = useState<UnitKey>("sb");
  const [isExpanded, setIsExpanded] = useState(false);

  const unitDataMap: Record<UnitKey, LeaderPerson[]> = {
    sb: sbLeadership,
    wie: wieLeadership,
    eds: edsLeadership,
  };

  const currentLeaders = unitDataMap[activeUnit] || [];
  const currentMeta = UNITS[activeUnit];

  const handleUnitChange = (key: UnitKey) => {
    setActiveUnit(key);
    setIsExpanded(false);
  };

  return (
    <section
      id="leadership-spotlight"
      aria-label="Branch & Chapter Executive Leadership"
      className="py-8 sm:py-14 lg:py-18 bg-warm-100/30 dark:bg-gray-900/40 border-b border-warm-200 dark:border-gray-800 transition-colors duration-200"
    >
      <Container size="default">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2.5 sm:gap-4 pb-1">
          <div className="space-y-1">
            <span className="font-mono text-[10px] sm:text-xs font-semibold text-ieee-blue dark:text-sky-400 uppercase tracking-widest block">
              Leadership Spotlight
            </span>
            <h2 className="font-serif text-xl sm:text-3xl lg:text-4xl text-ink dark:text-gray-100 font-normal leading-tight">
              Branch & Chapter Executive Leadership
            </h2>
            <div className="w-8 sm:w-12 h-0.5 bg-ieee-blue/40 dark:bg-sky-400/40 my-1 sm:my-1.5 rounded-full" />
            <p className="text-[11px] sm:text-sm text-warm-500 dark:text-gray-400 max-w-2xl leading-relaxed font-sans">
              The student chairpersons and executive officers steering IEEE
              MAIT, WIE Affinity Group, and EDS Chapter technical initiatives.
            </p>
          </div>

          {/* Direct Link to Full Directory (Desktop) */}
          <Link
            href="/people"
            className="hidden md:inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-ieee-blue dark:text-sky-400 hover:underline shrink-0 pb-1"
          >
            <span>Complete Directory & Archive</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* ---------------------------------------------------- */}
        {/* SCALED & COMPACT UNIT SELECTOR TABS */}
        {/* ---------------------------------------------------- */}
        <div className="pt-3 sm:pt-5">
          <div className="w-full overflow-x-auto pb-0.5 scrollbar-none">
            <div
              role="tablist"
              aria-label="Select Leadership Unit"
              className="inline-flex items-center gap-1 sm:gap-1.5 p-1 bg-white dark:bg-gray-900 border border-warm-200/90 dark:border-gray-800 rounded-lg sm:rounded-xl shadow-2xs min-w-full sm:min-w-0"
            >
              {(Object.keys(UNITS) as UnitKey[]).map((key) => {
                const item = UNITS[key];
                const isActive = activeUnit === key;
                const count = (unitDataMap[key] || []).length;

                return (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    id={`tab-${key}`}
                    aria-selected={isActive}
                    aria-controls={`panel-${key}`}
                    onClick={() => handleUnitChange(key)}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-[11px] sm:text-xs font-mono font-semibold transition-all duration-150 cursor-pointer min-h-[34px] sm:min-h-[38px] select-none ${
                      isActive
                        ? item.activeTabClass
                        : "text-warm-600 dark:text-gray-400 hover:text-ink dark:hover:text-white hover:bg-warm-100/70 dark:hover:bg-gray-800"
                    }`}
                  >
                    {item.icon}
                    <span className="hidden sm:inline">{item.tabLabel}</span>
                    <span className="sm:hidden truncate">
                      {item.mobileTabLabel}
                    </span>
                    {count > 0 && (
                      <span
                        className={`text-[9px] sm:text-[10px] font-mono px-1 sm:px-1.5 py-0.2 rounded-full ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-warm-100 dark:bg-gray-800 text-warm-500 dark:text-gray-400"
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* COMPACT CONTEXTUAL UNIT SUMMARY BANNER */}
        {/* ---------------------------------------------------- */}
        <div
          role="tabpanel"
          id={`panel-${activeUnit}`}
          aria-labelledby={`tab-${activeUnit}`}
          className="mt-2.5 sm:mt-4 border border-warm-200/90 dark:border-gray-800 bg-white dark:bg-gray-900/90 p-2.5 sm:p-4 rounded-lg sm:rounded-xl shadow-2xs transition-all duration-200"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <div className="space-y-0.5 sm:space-y-1 min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h3 className="font-serif text-xs sm:text-base font-medium text-ink dark:text-gray-100">
                  {currentMeta.name}
                </h3>
                <span
                  className={`inline-flex items-center px-1.5 sm:px-2 py-0.2 sm:py-0.5 rounded-md sm:rounded-full text-[8px] sm:text-[9px] font-mono font-bold tracking-wider border ${currentMeta.badgeStyle}`}
                >
                  {currentMeta.badge}
                </span>
              </div>
              <div className="text-[10px] sm:text-xs text-warm-500 dark:text-gray-400 font-sans max-w-3xl leading-snug sm:leading-relaxed">
                <p
                  className={`${isExpanded ? "" : "line-clamp-2"} sm:line-clamp-none inline`}
                >
                  {currentMeta.description}
                </p>
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="sm:hidden inline-flex items-center gap-0.5 ml-1 text-[10px] font-mono font-semibold text-ieee-blue dark:text-sky-400 hover:underline cursor-pointer"
                  aria-expanded={isExpanded}
                >
                  {isExpanded ? "Show less" : "Show more"}
                </button>
              </div>
            </div>

            <Link
              href={currentMeta.portalHref}
              className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-mono font-semibold text-ieee-blue dark:text-sky-400 hover:text-ieee-dark dark:hover:text-sky-300 hover:underline shrink-0 bg-warm-50 dark:bg-gray-800/80 border border-warm-200/80 dark:border-gray-700/80 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-md sm:rounded-lg transition-colors duration-150 self-start sm:self-center"
            >
              <span>{currentMeta.portalLabel}</span>
              <FiExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </Link>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* LEADERSHIP CARDS GRID (2 col on mobile -> 4 col desktop) */}
        {/* ---------------------------------------------------- */}
        <div className="pt-2.5 sm:pt-5">
          {currentLeaders.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
              {currentLeaders.map((person) => (
                <PersonCard
                  key={person.id}
                  name={person.name}
                  role={person.role}
                  category={person.category}
                  department={person.department}
                  academicYear={person.academicYear || "2025–26"}
                  imageUrl={person.imageUrl}
                  imageSrc={person.imageSrc}
                  linkedIn={person.linkedIn}
                  github={person.github}
                  email={person.email}
                  bio={person.bio}
                  hierarchy={person.hierarchy}
                  size="standard"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-6 sm:py-10 border border-dashed border-warm-200 dark:border-gray-800 rounded-xl bg-white/40 dark:bg-gray-900/40">
              <p className="font-mono text-xs text-warm-400 dark:text-gray-400">
                Leadership roster for this unit is currently being updated for
                the active term.
              </p>
            </div>
          )}
        </div>

        {/* ---------------------------------------------------- */}
        {/* FOOTER ACTIONS STRIP */}
        {/* ---------------------------------------------------- */}
        <div className="pt-3 sm:pt-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5 sm:gap-3 border-t border-warm-200 dark:border-gray-800 mt-3 sm:mt-5">
          <Link
            href="/people"
            className="text-[10px] sm:text-xs font-mono text-ieee-blue dark:text-sky-400 font-semibold hover:underline flex items-center gap-1"
          >
            <span>
              View Full Leadership Directory & Historical Archive (2005–Present)
            </span>
            <FiArrowRight className="w-3 h-3" />
          </Link>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="font-mono text-[9px] sm:text-xs text-warm-400 dark:text-gray-400">
              Active Term 2025–26 · {totalMembers} Members
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
};
