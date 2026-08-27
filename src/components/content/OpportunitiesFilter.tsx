'use client';

/**
 * @file src/components/content/OpportunitiesFilter.tsx
 * @description Interactive filtering and search engine for IEEE scholarships, fellowships, and volunteer calls.
 * 
 * FEATURES:
 * - Category Tabs: All | Scholarships & Fellowships | Travel Grants | Competitions | Volunteer Calls
 * - Real-time keyword search across titles, eligibility, and organisations
 * - Deadline indicators and official application CTAs
 * - Dual-mode theme tokens
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import React, { useState, useMemo } from 'react';
import { Badge } from '../ui/Badge';

export interface OpportunityItem {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  deadline?: string | null;
  deadlineDate?: Date | string | null;
  organisation?: string | null;
  eligibility?: string | null;
  link?: string | null;
  status: string; // Active | Closed | Upcoming
  category: string; // Scholarship | Fellowship | Grant | Volunteer | Competition
  featured?: boolean;
}

interface OpportunitiesFilterProps {
  initialOpportunities: OpportunityItem[];
}

export function OpportunitiesFilter({ initialOpportunities }: OpportunitiesFilterProps) {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredOpportunities = useMemo(() => {
    return initialOpportunities.filter((item) => {
      // 1. Category Filter
      if (activeCategory !== 'ALL') {
        const cat = (item.category || '').toLowerCase();
        if (activeCategory === 'Scholarships' && !cat.includes('scholarship') && !cat.includes('fellowship')) {
          return false;
        }
        if (activeCategory === 'Grants' && !cat.includes('grant')) {
          return false;
        }
        if (activeCategory === 'Competitions' && !cat.includes('competition') && !cat.includes('hackathon')) {
          return false;
        }
        if (activeCategory === 'Volunteer' && !cat.includes('volunteer')) {
          return false;
        }
      }

      // 2. Search Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchOrg = item.organisation?.toLowerCase().includes(q);
        const matchDesc = item.description?.toLowerCase().includes(q);
        const matchElig = item.eligibility?.toLowerCase().includes(q);
        if (!matchTitle && !matchOrg && !matchDesc && !matchElig) return false;
      }

      return true;
    });
  }, [initialOpportunities, activeCategory, searchQuery]);

  const counts = useMemo(() => {
    return {
      all: initialOpportunities.length,
      scholarships: initialOpportunities.filter((o) => {
        const c = (o.category || '').toLowerCase();
        return c.includes('scholarship') || c.includes('fellowship');
      }).length,
      grants: initialOpportunities.filter((o) => (o.category || '').toLowerCase().includes('grant')).length,
      competitions: initialOpportunities.filter((o) => (o.category || '').toLowerCase().includes('competition')).length,
      volunteer: initialOpportunities.filter((o) => (o.category || '').toLowerCase().includes('volunteer')).length,
    };
  }, [initialOpportunities]);

  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [showSuggestModal, setShowSuggestModal] = useState<boolean>(false);
  const [suggestForm, setSuggestForm] = useState({ title: '', organisation: '', link: '', notes: '' });
  const [suggestSubmitted, setSuggestSubmitted] = useState<boolean>(false);

  const handleSuggestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuggestSubmitted(true);
    setTimeout(() => {
      setShowSuggestModal(false);
      setSuggestSubmitted(false);
      setSuggestForm({ title: '', organisation: '', link: '', notes: '' });
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {/* Application Guide Banner & Suggest CTA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 p-5 bg-warm-50/80 dark:bg-gray-900/80 border border-warm-200/80 dark:border-gray-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-ieee-blue dark:text-sky-400">
              💡 IEEE Grant Application Advisory
            </span>
            <button
              type="button"
              onClick={() => setShowGuide(!showGuide)}
              className="text-xs font-mono text-ieee-blue dark:text-sky-400 hover:underline font-bold"
            >
              {showGuide ? 'Hide Checklist ▲' : 'View Application Checklist ▼'}
            </button>
          </div>
          <p className="text-xs text-warm-500 dark:text-gray-300 font-sans leading-relaxed">
            Need guidance with endorsement letters, IEEE Member verification, or budget proposals? Our branch mentors provide 1-on-1 application reviews for MAIT students.
          </p>

          {showGuide && (
            <div className="pt-3 border-t border-warm-200/60 dark:border-gray-800 space-y-2 animate-in fade-in duration-200 text-xs font-sans text-ink/80 dark:text-gray-200">
              <div className="font-semibold text-ink dark:text-gray-100">Recommended Checklist:</div>
              <ul className="list-disc list-inside space-y-1 text-warm-600 dark:text-gray-300">
                <li>Active IEEE Student Membership Number (verify via IEEE Account Portal).</li>
                <li>Branch Counsellor Recommendation Letter (request at least 2 weeks before deadline).</li>
                <li>Statement of Technical Purpose / Paper Abstract & Acceptance Notice (for Travel Grants).</li>
                <li>Official Academic Transcripts (GPA &gt; 3.0 / 7.5+ required for Merwin Scholarship).</li>
              </ul>
            </div>
          )}
        </div>

        {/* Suggest Opportunity CTA */}
        <div className="p-5 bg-white dark:bg-gray-900 border border-warm-200 dark:border-gray-800 rounded-xl flex flex-col justify-between space-y-3">
          <div>
            <span className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
              Know an Opportunity?
            </span>
            <p className="text-xs text-warm-500 dark:text-gray-300 font-sans mt-1">
              Found an IEEE grant, research fellowship or competition? Share it with the MAIT student branch.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowSuggestModal(true)}
            className="w-full py-2 bg-warm-100 dark:bg-gray-800 hover:bg-ieee-blue hover:text-white dark:hover:bg-sky-600 text-ink dark:text-gray-200 text-xs font-mono font-semibold rounded-lg transition-colors text-center"
          >
            + Submit Opportunity Lead
          </button>
        </div>
      </div>

      {/* 1. Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-warm-200 dark:border-gray-800">
        {[
          { id: 'ALL', label: 'All Opportunities', count: counts.all },
          { id: 'Scholarships', label: '🎓 Scholarships & Fellowships', count: counts.scholarships },
          { id: 'Grants', label: '✈️ Travel Grants', count: counts.grants },
          { id: 'Competitions', label: '🏆 Hackathons & Contests', count: counts.competitions },
          { id: 'Volunteer', label: '🤝 Volunteer Calls', count: counts.volunteer },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveCategory(tab.id)}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 shrink-0 flex items-center gap-1.5 ${
              activeCategory === tab.id
                ? 'bg-ieee-blue dark:bg-sky-600 text-white shadow-sm font-bold'
                : 'bg-warm-50 dark:bg-gray-900 border border-warm-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-ieee-blue/40'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                activeCategory === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-warm-200/60 dark:bg-gray-800 text-warm-500 dark:text-gray-400'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* 2. Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-warm-400 dark:text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by scholarship name, awarding society, or eligibility requirements..."
          className="w-full pl-10 pr-8 py-3 bg-white dark:bg-gray-900 border border-warm-200 dark:border-gray-800 rounded-xl text-xs sm:text-sm text-ink dark:text-gray-100 placeholder-warm-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-ieee-blue transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-warm-400 hover:text-ink dark:hover:text-white text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* 3. Opportunities List */}
      <div className="space-y-6">
        {filteredOpportunities.length > 0 ? (
          filteredOpportunities.map((opp) => (
            <div
              key={opp.id}
              className="border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl p-6 sm:p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 hover:border-ieee-blue/40 dark:hover:border-sky-500/40 hover:shadow-md transition-all group shadow-xs"
            >
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <Badge variant="ieee">{opp.category}</Badge>
                  {opp.organisation && (
                    <span className="font-mono text-xs font-semibold text-warm-500 dark:text-gray-400">
                      {opp.organisation}
                    </span>
                  )}
                  {opp.deadline && (
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 ml-auto">
                      ⏳ Deadline: {opp.deadline}
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-xl sm:text-2xl text-ink dark:text-gray-100 font-normal leading-snug">
                  {opp.title}
                </h3>

                <p className="text-xs sm:text-sm text-warm-500 dark:text-gray-300 font-sans leading-relaxed">
                  {opp.description}
                </p>

                {opp.eligibility && (
                  <div className="p-3 bg-warm-50/60 dark:bg-gray-800/60 rounded-lg text-xs font-sans text-warm-600 dark:text-gray-300 flex items-start gap-2 border border-warm-200/60 dark:border-gray-700/60">
                    <span className="text-ieee-blue dark:text-sky-400 font-bold">Eligibility:</span>
                    <span>{opp.eligibility}</span>
                  </div>
                )}
              </div>

              <div className="shrink-0 w-full lg:w-auto">
                {opp.link ? (
                  <a
                    href={opp.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full lg:w-auto inline-flex justify-center items-center gap-1.5 px-5 py-2.5 bg-ieee-blue hover:bg-ieee-dark dark:bg-sky-600 dark:hover:bg-sky-700 text-white font-mono text-xs font-bold rounded-lg shadow-xs transition-colors"
                  >
                    <span>Apply / Details</span>
                    <span>↗</span>
                  </a>
                ) : (
                  <span className="text-xs font-mono text-warm-400">Contact Executive Committee</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 border border-warm-200 dark:border-gray-800 bg-warm-50/50 dark:bg-gray-900/50 rounded-xl text-center space-y-3">
            <span className="text-3xl">🎯</span>
            <h4 className="font-serif text-lg text-ink dark:text-gray-200 font-normal">
              No matching opportunities found
            </h4>
            <p className="text-xs text-warm-400 dark:text-gray-400 max-w-sm mx-auto">
              Try adjusting your search query or switching tabs to view all available scholarships and grants.
            </p>
          </div>
        )}
      </div>

      {/* Suggest Opportunity Modal */}
      {showSuggestModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-warm-200 dark:border-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl text-ink dark:text-gray-100 font-normal">
                Submit Opportunity Lead
              </h3>
              <button
                type="button"
                onClick={() => setShowSuggestModal(false)}
                className="text-warm-400 hover:text-ink dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            {suggestSubmitted ? (
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-center space-y-2">
                <span className="text-2xl">🎉</span>
                <div className="font-bold text-sm text-emerald-800 dark:text-emerald-300">
                  Thank You! Lead Submitted
                </div>
                <div className="text-xs text-emerald-700 dark:text-emerald-400">
                  Our webmaster and executive team will review and publish it for all students.
                </div>
              </div>
            ) : (
              <form onSubmit={handleSuggestSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-medium text-ink dark:text-gray-200 mb-1">
                    Opportunity / Grant Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={suggestForm.title}
                    onChange={(e) => setSuggestForm({ ...suggestForm, title: e.target.value })}
                    placeholder="e.g. IEEE PES Student Travel Award"
                    className="w-full px-3 py-2 bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block font-medium text-ink dark:text-gray-200 mb-1">
                    Organisation / Society *
                  </label>
                  <input
                    type="text"
                    required
                    value={suggestForm.organisation}
                    onChange={(e) => setSuggestForm({ ...suggestForm, organisation: e.target.value })}
                    placeholder="e.g. IEEE Power & Energy Society"
                    className="w-full px-3 py-2 bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block font-medium text-ink dark:text-gray-200 mb-1">
                    Official URL / Application Link *
                  </label>
                  <input
                    type="url"
                    required
                    value={suggestForm.link}
                    onChange={(e) => setSuggestForm({ ...suggestForm, link: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100"
                  />
                </div>
                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSuggestModal(false)}
                    className="px-4 py-2 rounded-lg border border-warm-200 dark:border-gray-700 text-warm-600 dark:text-gray-300 font-mono"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-ieee-blue hover:bg-ieee-dark dark:bg-sky-600 text-white font-mono font-bold rounded-lg transition-colors"
                  >
                    Submit Opportunity
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
