'use client';

/**
 * @file src/components/content/PeopleDirectoryView.tsx
 * @description Interactive Team Switcher for People & Leadership Directory.
 * 
 * Features:
 * - Clean, balanced top Team Switcher card with refined spacing and typography.
 * - Dynamic Executive Committee (ExeCom) updates based on selected team.
 * - Preserves Branch Counsellor, Mentors, and Operational Leads.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PersonCard } from '@/components/content/PersonCard';
import {
  FiBookOpen,
  FiCompass,
  FiAward,
  FiCpu,
  FiZap,
  FiUsers,
  FiCheckCircle,
} from 'react-icons/fi';

export interface PersonItem {
  id: string;
  name: string;
  role: string;
  category: string;
  department?: string | null;
  academicYear?: string | null;
  imageUrl?: string | null;
  imageSrc?: string | null;
  linkedIn?: string | null;
  github?: string | null;
  email?: string | null;
  bio?: string | null;
  hierarchy?: number;
  isFacultyAdvisor?: boolean;
}

export interface PeopleDirectoryViewProps {
  counsellors: PersonItem[];
  mentors: PersonItem[];
  sbExecom: PersonItem[];
  wieExecom: PersonItem[];
  edsExecom: PersonItem[];
  operationalLeads: PersonItem[];
}

type TeamKey = 'sb' | 'wie' | 'eds';

const TEAMS_META: Record<
  TeamKey,
  {
    name: string;
    shortLabel: string;
    badge: string;
    badgeColor: string;
    description: string;
    execomTitle: string;
    icon: React.ReactNode;
  }
> = {
  sb: {
    name: 'IEEE MAIT Student Branch',
    shortLabel: 'Student Branch (Main)',
    badge: 'STUDENT BRANCH',
    badgeColor: 'bg-ieee-blue/10 dark:bg-sky-500/10 text-ieee-blue dark:text-sky-400 border-ieee-blue/30 dark:border-sky-500/30',
    description: 'Governing executive committee managing overall branch operations, flagship symposiums, finances, and Delhi Section collaborations.',
    execomTitle: 'Student Branch Executive Committee (ExeCom)',
    icon: <FiUsers className="w-4 h-4" />,
  },
  wie: {
    name: 'IEEE WIE Affinity Group MAIT',
    shortLabel: 'WIE MAIT Team',
    badge: 'AFFINITY GROUP',
    badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
    description: 'Dedicated affinity group empowering women in STEM, organizing leadership roundtables, research grant advisories, and technical mentorship circles.',
    execomTitle: 'WIE Affinity Group Executive Committee (ExeCom)',
    icon: <FiZap className="w-4 h-4" />,
  },
  eds: {
    name: 'IEEE EDS Chapter MAIT',
    shortLabel: 'EDS MAIT Team',
    badge: 'TECHNICAL CHAPTER',
    badgeColor: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
    description: 'Technical chapter advancing solid-state devices, semiconductor physics, KiCad 4-layer PCB design, VLSI tapeout, and embedded hardware workshops.',
    execomTitle: 'EDS Chapter Executive Committee (ExeCom)',
    icon: <FiCpu className="w-4 h-4" />,
  },
};

export const PeopleDirectoryView: React.FC<PeopleDirectoryViewProps> = ({
  counsellors,
  mentors,
  sbExecom,
  wieExecom,
  edsExecom,
  operationalLeads,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeTeam, setActiveTeam] = useState<TeamKey>('sb');

  useEffect(() => {
    const teamParam = searchParams.get('team')?.toLowerCase();
    if (teamParam === 'wie' || teamParam === 'eds' || teamParam === 'sb') {
      setActiveTeam(teamParam);
    }
  }, [searchParams]);

  const handleTeamChange = (team: TeamKey) => {
    setActiveTeam(team);
    const params = new URLSearchParams(window.location.search);
    if (team === 'sb') {
      params.delete('team');
    } else {
      params.set('team', team);
    }
    const newQuery = params.toString();
    router.replace(newQuery ? `/people?${newQuery}` : '/people', { scroll: false });
  };

  // Select the active ExeCom based on tab
  const currentExecom =
    activeTeam === 'wie'
      ? wieExecom
      : activeTeam === 'eds'
      ? edsExecom
      : sbExecom;

  const currentMeta = TEAMS_META[activeTeam];

  return (
    <div className="space-y-16">
      {/* ---------------------------------------------------- */}
      {/* REFINED TEAM SWITCHER BAR */}
      {/* ---------------------------------------------------- */}
      <div className="border border-warm-200/90 dark:border-gray-800 bg-warm-50/60 dark:bg-gray-900/50 p-5 rounded-2xl shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Left: Active Team Identity & Description */}
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-serif text-xl sm:text-2xl font-normal text-ink dark:text-gray-100">
                {currentMeta.name}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider border ${currentMeta.badgeColor}`}
              >
                {currentMeta.badge}
              </span>
            </div>
            <p className="text-xs text-warm-500 dark:text-gray-400 font-sans max-w-2xl leading-relaxed">
              {currentMeta.description}
            </p>
          </div>

          {/* Right: Clean Segmented Unit Switcher Pills */}
          <div className="inline-flex p-1 bg-warm-200/60 dark:bg-gray-800/80 rounded-xl border border-warm-200/80 dark:border-gray-700/60 gap-1 shrink-0 self-start lg:self-center shadow-2xs">
            {(Object.keys(TEAMS_META) as TeamKey[]).map((key) => {
              const team = TEAMS_META[key];
              const isActive = activeTeam === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleTeamChange(key)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-mono text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-gray-900 text-ieee-blue dark:text-sky-400 shadow-xs border border-warm-200 dark:border-gray-700'
                      : 'text-warm-500 dark:text-gray-400 hover:text-ink dark:hover:text-gray-200 hover:bg-white/40 dark:hover:bg-gray-800/40'
                  }`}
                >
                  {team.icon}
                  <span>{team.shortLabel}</span>
                  {isActive && <FiCheckCircle className="w-3.5 h-3.5 ml-0.5 text-ieee-blue dark:text-sky-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Clean Metadata Info Strip */}
        <div className="mt-4 pt-3 border-t border-warm-200/70 dark:border-gray-800/70 flex items-center justify-between gap-4 text-[11px] font-mono text-warm-400 dark:text-gray-400">
          <span>Active Session: <strong className="text-ink dark:text-gray-200 font-medium">2025–26</strong></span>
          <span>Showing <strong className="text-ink dark:text-gray-200 font-semibold">{currentExecom.length}</strong> ExeCom Officers</span>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 1. BRANCH FACULTY COUNSELLOR (Universal) */}
      {/* ---------------------------------------------------- */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-warm-200 dark:border-gray-800 pb-3">
          <div className="w-9 h-9 rounded-lg bg-ieee-subtle dark:bg-sky-950 flex items-center justify-center text-ieee-blue dark:text-sky-400 shrink-0">
            <FiBookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-ieee-blue dark:text-sky-400">
              Branch Faculty Counsellor & Governance
            </h2>
            <p className="text-xs text-warm-500 dark:text-gray-400 font-sans mt-0.5">
              Institutional mentorship and academic governance across all IEEE MAIT student units.
            </p>
          </div>
        </div>

        {counsellors.length > 0 && (
          <div className="grid grid-cols-1 gap-8">
            {counsellors.map((person) => (
              <PersonCard
                key={person.id}
                name={person.name}
                role={person.role}
                category={person.category}
                department={
                  person.department ||
                  'Department of Electrical & Electronics Engineering (EEE)'
                }
                academicYear={person.academicYear || '2025–26'}
                imageUrl={person.imageUrl}
                imageSrc={person.imageSrc}
                linkedIn={person.linkedIn}
                github={person.github}
                email={person.email}
                bio={person.bio}
                hierarchy="mentor"
                size="mentor"
                priority={true}
              />
            ))}
          </div>
        )}
      </section>

      {/* ---------------------------------------------------- */}
      {/* 2. BRANCH MENTORS & SENIOR ADVISORY (Universal) */}
      {/* ---------------------------------------------------- */}
      {mentors.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-warm-200 dark:border-gray-800 pb-3">
            <div className="w-9 h-9 rounded-lg bg-warm-100 dark:bg-gray-800 flex items-center justify-center text-ink dark:text-gray-200 shrink-0">
              <FiCompass className="w-5 h-5 text-ieee-blue dark:text-sky-400" />
            </div>
            <div>
              <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-ink dark:text-gray-200">
                Branch Mentors & Senior Advisory Board
              </h2>
              <p className="text-xs text-warm-500 dark:text-gray-400 font-sans mt-0.5">
                Experienced branch seniors providing strategic guidance and institutional continuity.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mentors.map((person) => (
              <PersonCard
                key={person.id}
                name={person.name}
                role={person.role}
                category={person.category}
                department={
                  person.department ||
                  'Department of Electrical & Electronics Engineering (EEE)'
                }
                academicYear={person.academicYear || '2025–26'}
                imageUrl={person.imageUrl}
                imageSrc={person.imageSrc}
                linkedIn={person.linkedIn}
                github={person.github}
                email={person.email}
                bio={person.bio}
                hierarchy="advisory"
                size="advisory"
                priority={true}
              />
            ))}
          </div>
        </section>
      )}

      {/* ---------------------------------------------------- */}
      {/* 3. DYNAMIC EXECUTIVE COMMITTEE (ExeCom) */}
      {/* ---------------------------------------------------- */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-warm-200 dark:border-gray-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-warm-100 dark:bg-gray-800 flex items-center justify-center text-ink dark:text-gray-200 shrink-0">
              <FiAward className="w-5 h-5 text-ieee-blue dark:text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-ink dark:text-gray-200">
                  {currentMeta.execomTitle}
                </h2>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${currentMeta.badgeColor}`}
                >
                  {currentMeta.name}
                </span>
              </div>
              <p className="text-xs text-warm-500 dark:text-gray-400 font-sans mt-0.5">
                Elected student officers leading operations, technical initiatives, and community programs for term 2025–26.
              </p>
            </div>
          </div>
        </div>

        {currentExecom.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fadeIn">
            {currentExecom.map((person) => (
              <PersonCard
                key={person.id}
                name={person.name}
                role={person.role}
                category={person.category}
                department={person.department || undefined}
                academicYear={person.academicYear || '2025–26'}
                imageUrl={person.imageUrl}
                imageSrc={person.imageSrc}
                linkedIn={person.linkedIn}
                github={person.github}
                email={person.email}
                bio={person.bio}
                hierarchy="featured"
                size="featured"
              />
            ))}
          </div>
        ) : (
          <p className="text-sm font-mono text-warm-400 dark:text-gray-500 bg-warm-50 dark:bg-gray-900 p-6 rounded-xl border border-warm-200 dark:border-gray-800">
            No Executive Committee records found for this team.
          </p>
        )}
      </section>

      {/* ---------------------------------------------------- */}
      {/* 4. OPERATIONAL & TECHNICAL LEADS (Universal) */}
      {/* ---------------------------------------------------- */}
      {operationalLeads.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-warm-200 dark:border-gray-800 pb-3">
            <div className="w-9 h-9 rounded-lg bg-warm-100 dark:bg-gray-800 flex items-center justify-center text-ink dark:text-gray-200 shrink-0">
              <FiCpu className="w-5 h-5 text-ieee-blue dark:text-sky-400" />
            </div>
            <div>
              <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-ink dark:text-gray-200">
                Operational & Technical Domain Leads
              </h2>
              <p className="text-xs text-warm-500 dark:text-gray-400 font-sans mt-0.5">
                Specialized domain leads driving creative design, public relations, technical workshops, and logistics across all units.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {operationalLeads.map((person) => (
              <PersonCard
                key={person.id}
                name={person.name}
                role={person.role}
                category={person.category}
                department={person.department || undefined}
                academicYear={person.academicYear || '2025–26'}
                imageUrl={person.imageUrl}
                imageSrc={person.imageSrc}
                linkedIn={person.linkedIn}
                github={person.github}
                email={person.email}
                bio={person.bio}
                hierarchy="operational"
                size="operational"
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
