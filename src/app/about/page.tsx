import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white">
        <Container size="default">
          <SectionHeading
            category="About Us"
            title="IEEE MAIT Student Branch"
            subtitle="Fostering technical innovation, professional development, and community impact since 2005."
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8">
            <div className="lg:col-span-8 space-y-6 text-base text-ink-muted leading-relaxed">
              <h3 className="font-serif text-2xl text-ink font-normal">
                Our Institutional Mission
              </h3>
              <p>
                The IEEE MAIT Student Branch was established in 2005 at Maharaja Agrasen Institute of Technology, Rohini, Delhi. Over two decades, it has evolved into one of the most active student chapters under the IEEE Delhi Section (Region 10).
              </p>
              <p>
                Our mission is to cultivate an environment of technical excellence, continuous learning, and ethical leadership among engineering students. We bridge academic theory with industry practice through practical workshops, hackathons, guest lectures, and peer-to-peer mentoring.
              </p>

              <div className="pt-6 border-t border-warm-200 space-y-4">
                <h3 className="font-serif text-2xl text-ink font-normal">
                  Affiliation & Governance
                </h3>
                <p className="text-warm-400">
                  As an officially chartered student branch of the Institute of Electrical and Electronics Engineers (IEEE), IEEE MAIT operates under the governance of the IEEE Delhi Section and receives institutional mentorship from MAIT faculty advisors.
                </p>
              </div>

              <div className="pt-6">
                <Button href="/join" variant="primary" size="md">
                  Become a Member →
                </Button>
              </div>
            </div>

            <div className="lg:col-span-4 border border-warm-200 bg-warm-100/40 p-6 rounded-[2px] space-y-6 h-fit">
              <h4 className="font-serif text-xl text-ink font-normal border-b border-warm-200 pb-3">
                Key Facts
              </h4>
              <div className="space-y-4 text-xs font-mono">
                <div>
                  <span className="text-warm-400 block uppercase">Establishment Year</span>
                  <span className="text-ink font-semibold text-sm">2005</span>
                </div>
                <div>
                  <span className="text-warm-400 block uppercase">Institution</span>
                  <span className="text-ink font-semibold text-sm">Maharaja Agrasen Institute of Technology</span>
                </div>
                <div>
                  <span className="text-warm-400 block uppercase">IEEE Region</span>
                  <span className="text-ink font-semibold text-sm">Region 10 (Asia-Pacific)</span>
                </div>
                <div>
                  <span className="text-warm-400 block uppercase">IEEE Section</span>
                  <span className="text-ink font-semibold text-sm">Delhi Section</span>
                </div>
                <div>
                  <span className="text-warm-400 block uppercase">Official Email</span>
                  <span className="text-ieee-blue font-semibold text-sm">mait.ieee.sb@gmail.com</span>
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
