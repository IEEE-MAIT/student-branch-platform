'use client';

import React, { useState } from 'react';

export interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

const DEFAULT_FAQS: FaqItem[] = [
  {
    question: 'Who is eligible to join IEEE MAIT?',
    answer: 'Any student currently enrolled at Maharaja Agrasen Institute of Technology (MAIT) across any engineering branch (CSE, IT, ECE, EEE, MAE, AI/ML, CST, etc.) and any academic year (1st, 2nd, 3rd, or 4th year) is eligible to join.',
    category: 'Eligibility',
  },
  {
    question: 'Can first-year students join immediately?',
    answer: 'Yes, absolutely! First-year students are strongly encouraged to join during the annual orientation drive. Joining early allows you to participate in hands-on hardware/software workshops, join project teams, and apply for executive committee leadership roles.',
    category: 'Eligibility',
  },
  {
    question: 'What is the difference between Global IEEE and Student Branch membership?',
    answer: 'Global IEEE Membership is obtained through ieee.org and gives you international credentials, IEEE Xplore digital library access, IEEE email alias (@ieee.org), and conference discounts. IEEE MAIT Student Branch membership integrates you into the local campus ecosystem, giving you lab access, workshop bench seats, project mentorship, and team recruitment eligibility.',
    category: 'Membership',
  },
  {
    question: 'How do I join specialized technical chapters like EDS or WIE?',
    answer: 'When registering on ieee.org, you can add society memberships such as the IEEE Electron Devices Society (EDS) or IEEE Women in Engineering (WIE) Affinity Group (which is free for student members). Once registered, notify our branch officers to be added to dedicated chapter technical tracks.',
    category: 'Chapters',
  },
  {
    question: 'Are there discounts available for student memberships?',
    answer: 'Yes! IEEE provides a 50% discount on student memberships for developing nations including India (Future50 promotion). Additionally, special promotional codes are released during IEEE Day and annual membership drives.',
    category: 'Fees',
  },
  {
    question: 'How do I apply for the Student Branch Executive Committee or volunteer teams?',
    answer: 'The branch conducts recruitment drives at the beginning of each academic semester for volunteer teams across Technical (Hardware, Web, AI), PR & Sponsorships, Creative & Media, Content & Editorial, and Event Logistics. Active members with strong project or organizational contributions are selected for officer positions.',
    category: 'Leadership',
  },
];

export const JoinFaqAccordion: React.FC<{ items?: FaqItem[] }> = ({ items = DEFAULT_FAQS }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="border border-warm-200 bg-white rounded-[2px] divide-y divide-warm-200">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={idx} className="transition-colors">
            <button
              onClick={() => toggle(idx)}
              className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 group cursor-pointer"
              aria-expanded={isOpen}
            >
              <span className="font-serif text-lg sm:text-xl text-ink group-hover:text-ieee-blue transition-colors leading-snug">
                {item.question}
              </span>
              <span
                className={`font-mono text-xs w-6 h-6 flex items-center justify-center rounded-full border transition-all shrink-0 ${
                  isOpen
                    ? 'bg-ieee-blue text-white border-ieee-blue rotate-180'
                    : 'bg-warm-100 text-warm-400 border-warm-200 group-hover:border-ieee-blue group-hover:text-ieee-blue'
                }`}
              >
                ▼
              </span>
            </button>

            {isOpen && (
              <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-warm-400 font-sans leading-relaxed border-t border-warm-100/60 bg-warm-50/30">
                <p>{item.answer}</p>
                {item.category && (
                  <span className="inline-block mt-3 font-mono text-[10px] uppercase tracking-wider text-ieee-blue bg-ieee-subtle px-2 py-0.5 rounded-[2px]">
                    Category: {item.category}
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
