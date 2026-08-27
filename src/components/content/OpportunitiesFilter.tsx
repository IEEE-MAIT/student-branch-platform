'use client';

/**
 * @file src/components/content/OpportunitiesFilter.tsx
 * @description Interactive filtering and search engine for IEEE scholarships, fellowships, and volunteer calls with react-icons.
 * 
 * FEATURES:
 * - Category Tabs: All | Scholarships & Fellowships | Travel Grants | Competitions | Volunteer Calls with react-icons.
 * - Real-time keyword search across titles, eligibility, and organisations.
 * - Deadline indicators and official application CTAs.
 * - Dual-mode theme tokens.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import React, { useState, useMemo } from 'react';
import { Badge } from '../ui/Badge';
import {
  FiSearch,
  FiX,
  FiExternalLink,
  FiBookOpen,
  FiCompass,
  FiAward,
  FiUsers,
  FiClock,
  FiCheckCircle,
  FiChevronUp,
  FiChevronDown,
  FiPlus,
} from 'react-icons/fi';

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
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [showSuggestModal, setShowSuggestModal] = useState<boolean>(false);
  const [suggestForm, setSuggestForm] = useState({ title: '', organisation: '', link: '', notes: '' });
  const [suggestSubmitted, setSuggestSubmitted] = useState<boolean>(false);

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

      // 2. Keyword Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesOrg = (item.organisation || '').toLowerCase().includes(q);
        const matchesDesc = (item.description || '').toLowerCase().includes(q);
        const matchesElig = (item.eligibility || '').toLowerCase().includes(q);

        if (!matchesTitle && !matchesOrg && !matchesDesc && !matchesElig) {
          return false;
        }
      }

      return true;
    });
  }, [initialOpportunities, activeCategory, searchQuery]);

  // Compute category counts
  const counts = useMemo(() => {
    return {
      all: initialOpportunities.length,
      scholarships: initialOpportunities.filter((o) => (o.category || '').toLowerCase().includes('scholarship') || (o.category || '').toLowerCase().includes('fellowship')).length,
      grants: initialOpportunities.filter((o) => (o.category || '').toLowerCase().includes('grant')).length,
      competitions: initialOpportunities.filter((o) => (o.category || '').toLowerCase().includes('competition') || (o.category || '').toLowerCase().includes('hackathon')).length,
      volunteer: initialOpportunities.filter((o) => (o.category || '').toLowerCase().includes('volunteer')).length,
    };
  }, [initialOpportunities]);

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
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-ieee-blue dark:text-sky-400 flex items-center gap-1.5">
              <FiAward className="w-4 h-4" />
              <span>IEEE Grant Application Advisory</span>
            </span>
            <button
              type="button"
              onClick={() => setShowGuide(!showGuide)}
              className="text-xs font-mono text-ieee-blue dark:text-sky-400 hover:underline font-bold cursor-pointer flex items-center gap-1"
            >
              <span>{showGuide ? 'Hide Checklist' : 'View Application Checklist'}</span>
              {showGuide ? <FiChevronUp className="w-3.5 h-3.5" /> : <FiChevronDown className="w-3.5 h-3.5" />}
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
            className="w-full py-2 bg-warm-100 dark:bg-gray-800 hover:bg-ieee-blue hover:text-white dark:hover:bg-sky-600 text-ink dark:text-gray-200 text-xs font-mono font-semibold rounded-lg transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5"
          >
            <FiPlus className="w-3.5 h-3.5" />
            <span>Submit Opportunity Lead</span>
          </button>
        </div>
      </div>

      {/* 1. Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-warm-200 dark:border-gray-800">
        {[
          { id: 'ALL', label: 'All Opportunities', count: counts.all, icon: null },
          { id: 'Scholarships', label: 'Scholarships & Fellowships', count: counts.scholarships, icon: FiBookOpen, iconColor: 'text-indigo-500' },
          { id: 'Grants', label: 'Travel Grants', count: counts.grants, icon: FiCompass, iconColor: 'text-sky-500' },
          { id: 'Competitions', label: 'Hackathons & Contests', count: counts.competitions, icon: FiAward, iconColor: 'text-amber-500' },
          { id: 'Volunteer', label: 'Volunteer Calls', count: counts.volunteer, icon: FiUsers, iconColor: 'text-emerald-500' },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCategory(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeCategory === tab.id
                  ? 'bg-ieee-blue dark:bg-sky-600 text-white shadow-sm font-bold'
                  : 'bg-warm-50 dark:bg-gray-900 border border-warm-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-ieee-blue/40'
              }`}
            >
              {Icon && <Icon className={`w-3.5 h-3.5 ${activeCategory === tab.id ? 'text-white' : tab.iconColor}`} />}
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
          );
        })}
      </div>

      {/* 2. Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-warm-400 dark:text-gray-500">
          <FiSearch className="w-4 h-4" />
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
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-warm-400 hover:text-ink dark:hover:text-white text-xs cursor-pointer"
            aria-label="Clear Search"
          >
            <FiX className="w-4 h-4" />
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
                    <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 ml-auto flex items-center gap-1">
                      <FiClock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                      <span>Deadline: {opp.deadline}</span>
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
                    className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-ieee-blue hover:bg-ieee-dark dark:bg-sky-600 dark:hover:bg-sky-700 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-xs"
                  >
                    <span>Apply / Details</span>
                    <FiExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="inline-block px-4 py-2 bg-warm-100 dark:bg-gray-800 text-warm-400 dark:text-gray-400 font-mono text-xs rounded-lg">
                    Applications Closed
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 border border-warm-200 dark:border-gray-800 bg-warm-50/50 dark:bg-gray-900/50 rounded-xl text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-ieee-subtle dark:bg-sky-950 flex items-center justify-center text-ieee-blue dark:text-sky-400 mx-auto">
              <FiCompass className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg text-ink dark:text-gray-200 font-normal">
              No matching opportunities found
            </h4>
            <p className="text-xs text-warm-400 dark:text-gray-400 max-w-sm mx-auto">
              We couldn&apos;t find any scholarships or grants matching your query. Try clearing your search filters or check back next cycle.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('ALL');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-ieee-blue hover:bg-ieee-dark text-white rounded-lg text-xs font-mono font-semibold transition-colors inline-block cursor-pointer shadow-xs"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Suggest Modal */}
      {showSuggestModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-warm-200 dark:border-gray-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl text-ink dark:text-gray-100 font-normal">
                Submit Opportunity Lead
              </h3>
              <button
                type="button"
                onClick={() => setShowSuggestModal(false)}
                className="text-warm-400 hover:text-ink dark:hover:text-white cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {suggestSubmitted ? (
              <div className="py-8 text-center space-y-2">
                <FiCheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
                <h4 className="font-serif text-lg text-ink dark:text-gray-100">Lead Submitted!</h4>
                <p className="text-xs text-warm-400 font-sans">Our editorial team will review and publish it shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSuggestSubmit} className="space-y-3 font-sans text-xs">
                <div>
                  <label className="block text-warm-600 dark:text-gray-400 font-mono mb-1">Opportunity Title *</label>
                  <input
                    type="text"
                    required
                    value={suggestForm.title}
                    onChange={(e) => setSuggestForm({ ...suggestForm, title: e.target.value })}
                    placeholder="e.g. IEEE Richard E. Merwin Scholarship"
                    className="w-full px-3 py-2 bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100 focus:outline-hidden focus:border-ieee-blue"
                  />
                </div>

                <div>
                  <label className="block text-warm-600 dark:text-gray-400 font-mono mb-1">Awarding Society / Org</label>
                  <input
                    type="text"
                    value={suggestForm.organisation}
                    onChange={(e) => setSuggestForm({ ...suggestForm, organisation: e.target.value })}
                    placeholder="e.g. IEEE Computer Society"
                    className="w-full px-3 py-2 bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100 focus:outline-hidden focus:border-ieee-blue"
                  />
                </div>

                <div>
                  <label className="block text-warm-600 dark:text-gray-400 font-mono mb-1">Official URL Link *</label>
                  <input
                    type="url"
                    required
                    value={suggestForm.link}
                    onChange={(e) => setSuggestForm({ ...suggestForm, link: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100 focus:outline-hidden focus:border-ieee-blue"
                  />
                </div>

                <div>
                  <label className="block text-warm-600 dark:text-gray-400 font-mono mb-1">Additional Notes</label>
                  <textarea
                    rows={2}
                    value={suggestForm.notes}
                    onChange={(e) => setSuggestForm({ ...suggestForm, notes: e.target.value })}
                    placeholder="Eligibility criteria, deadlines, stipend amount..."
                    className="w-full px-3 py-2 bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100 focus:outline-hidden focus:border-ieee-blue"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2 font-mono">
                  <button
                    type="button"
                    onClick={() => setShowSuggestModal(false)}
                    className="px-4 py-2 border border-warm-200 dark:border-gray-700 rounded-lg text-warm-500 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-ieee-blue hover:bg-ieee-dark text-white rounded-lg font-bold cursor-pointer"
                  >
                    Submit for Review
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
