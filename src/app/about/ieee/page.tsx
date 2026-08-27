import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/Button';
import { FiExternalLink } from 'react-icons/fi';

export default function AboutIEEEGlobalPage() {
  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white dark:bg-gray-950 transition-colors duration-200 page-enter">
        <Container size="default">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'About', href: '/about' },
              { label: 'About IEEE Global' },
            ]}
          />

          <SectionHeading
            category="Global Organization"
            title="About the IEEE"
            subtitle="The Institute of Electrical and Electronics Engineers — The world's largest technical professional organization dedicated to advancing technology for the benefit of humanity."
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8">
            <div className="lg:col-span-8 space-y-6 text-sm text-warm-500 dark:text-gray-300 font-sans leading-relaxed">
              <div className="space-y-4">
                <h3 className="font-serif text-2xl text-ink dark:text-gray-100 font-normal border-b border-warm-200 dark:border-gray-800 pb-2">
                  Advancing Technology for Humanity
                </h3>
                <p>
                  Tracing its origins to 1884 (with the founding of the American Institute of Electrical Engineers, AIEE) and formally formed as IEEE in 1963, IEEE is a globally recognized professional organization with over 460,000 members in more than 160 countries.
                </p>
                <p>
                  IEEE is the trusted voice for engineering, computing, and technology information around the globe. Through its highly cited publications, conferences, technology standards, and educational and professional activities, IEEE inspires a global community.
                </p>
              </div>

              <div className="space-y-4 border-t border-warm-200 dark:border-gray-800 pt-6">
                <h3 className="font-serif text-2xl text-ink dark:text-gray-100 font-normal border-b border-warm-200 dark:border-gray-800 pb-2">
                  IEEE Region 10 & Delhi Section
                </h3>
                <p>
                  IEEE is geographically divided into 10 regions worldwide. IEEE MAIT Student Branch operates under <strong>Region 10 (Asia-Pacific)</strong> and the <strong>IEEE Delhi Section</strong>, connecting students directly with regional congresses, awards, and industry mentorship.
                </p>
              </div>

              <div className="pt-4">
                <Button href="https://ieee.org" external variant="primary" size="md" className="flex items-center gap-1.5">
                  <span>Visit Global ieee.org</span>
                  <FiExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="lg:col-span-4 border border-warm-200 dark:border-gray-800 bg-warm-100/40 dark:bg-gray-900/50 p-6 rounded-xl space-y-6 h-fit shadow-xs">
              <h4 className="font-serif text-xl text-ink dark:text-gray-100 font-normal border-b border-warm-200 dark:border-gray-800 pb-3">
                IEEE at a Glance
              </h4>
              <div className="space-y-4 text-xs font-mono">
                <div>
                  <span className="text-warm-400 dark:text-gray-400 block uppercase">Global Membership</span>
                  <span className="text-ieee-blue dark:text-sky-400 font-semibold text-sm">460,000+ Members</span>
                </div>
                <div>
                  <span className="text-warm-400 dark:text-gray-400 block uppercase">Student Members</span>
                  <span className="text-ink dark:text-gray-100 font-semibold text-sm">120,000+ Students</span>
                </div>
                <div>
                  <span className="text-warm-400 dark:text-gray-400 block uppercase">Geographic Scope</span>
                  <span className="text-ink dark:text-gray-100 font-semibold text-sm">160+ Countries</span>
                </div>
                <div>
                  <span className="text-warm-400 dark:text-gray-400 block uppercase">Technical Societies</span>
                  <span className="text-ink dark:text-gray-100 font-semibold text-sm">39 Societies & Councils</span>
                </div>
                <div>
                  <span className="text-warm-400 dark:text-gray-400 block uppercase">Digital Library</span>
                  <span className="text-ink dark:text-gray-100 font-semibold text-sm">IEEE Xplore (5M+ Documents)</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
