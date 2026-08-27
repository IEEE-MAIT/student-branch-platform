import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/Button';
import { FiArrowRight } from 'react-icons/fi';

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white dark:bg-gray-950 transition-colors duration-200 page-enter">
        <Container size="default">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'About IEEE MAIT' },
            ]}
          />

          <SectionHeading
            category="History & Charter"
            title="About IEEE MAIT Student Branch"
            subtitle="Two decades of technical leadership, student innovation, and community impact at Maharaja Agrasen Institute of Technology."
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8">
            <div className="lg:col-span-8 space-y-6 text-sm text-warm-500 dark:text-gray-300 font-sans leading-relaxed">
              <p className="text-base text-ink dark:text-gray-100 font-normal leading-relaxed">
                The IEEE MAIT Student Branch was established in 2005 at Maharaja Agrasen Institute of Technology, Rohini, Delhi. Over two decades, it has evolved into one of the most active student chapters under the IEEE Delhi Section (Region 10).
              </p>
              <p>
                Our mission is to cultivate an environment of technical excellence, continuous learning, and ethical leadership among engineering students. We bridge academic theory with industry practice through practical workshops, hackathons, guest lectures, and peer-to-peer mentoring.
              </p>

              <div className="pt-6 border-t border-warm-200 dark:border-gray-800 space-y-4">
                <h3 className="font-serif text-2xl text-ink dark:text-gray-100 font-normal">
                  Affiliation & Governance
                </h3>
                <p className="text-warm-500 dark:text-gray-400">
                  As an officially chartered student branch of the Institute of Electrical and Electronics Engineers (IEEE), IEEE MAIT operates under the governance of the IEEE Delhi Section and receives institutional mentorship from MAIT faculty advisors.
                </p>
              </div>

              <div className="pt-6">
                <Button href="/join" variant="primary" size="md" className="flex items-center gap-1.5">
                  <span>Become a Member</span>
                  <FiArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="lg:col-span-4 border border-warm-200 dark:border-gray-800 bg-warm-100/40 dark:bg-gray-900/50 p-6 rounded-xl space-y-6 h-fit shadow-xs">
              <h4 className="font-serif text-xl text-ink dark:text-gray-100 font-normal border-b border-warm-200 dark:border-gray-800 pb-3">
                Key Facts
              </h4>
              <div className="space-y-4 text-xs font-mono">
                <div>
                  <span className="text-warm-400 dark:text-gray-400 block uppercase">Establishment Year</span>
                  <span className="text-ink dark:text-gray-100 font-semibold text-sm">2005</span>
                </div>
                <div>
                  <span className="text-warm-400 dark:text-gray-400 block uppercase">Section & Region</span>
                  <span className="text-ink dark:text-gray-100 font-semibold text-sm">IEEE Delhi Section · Region 10</span>
                </div>
                <div>
                  <span className="text-warm-400 dark:text-gray-400 block uppercase">Chartered Units</span>
                  <span className="text-ink dark:text-gray-100 font-semibold text-sm">Student Branch · EDS Chapter · WIE AG</span>
                </div>
                <div>
                  <span className="text-warm-400 dark:text-gray-400 block uppercase">Host Institution</span>
                  <span className="text-ink dark:text-gray-100 font-semibold text-sm">Maharaja Agrasen Institute of Technology</span>
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
