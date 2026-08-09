import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';

export default function AboutGlobalIEEEPage() {
  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white">
        <Container size="default">
          <SectionHeading
            category="Global Organization"
            title="About IEEE (Institute of Electrical and Electronics Engineers)"
            subtitle="The world's largest technical professional organization dedicated to advancing technology for the benefit of humanity."
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
            <div className="lg:col-span-8 space-y-8 text-base text-ink-muted leading-relaxed font-sans">
              <div className="space-y-4">
                <h3 className="font-serif text-2xl text-ink font-normal border-b border-warm-200 pb-2">
                  Global Legacy & Scale
                </h3>
                <p>
                  Tracing its origins to 1884 (with the founding of the American Institute of Electrical Engineers, AIEE) and formally formed as IEEE in 1963, IEEE is a globally recognized professional organization with over 460,000 members in more than 160 countries.
                </p>
                <p>
                  IEEE is the trusted voice for engineering, computing, and technology information around the globe. Through its highly cited publications, conferences, technology standards, and educational and professional activities, IEEE inspires a global community.
                </p>
              </div>

              <div className="space-y-4 border-t border-warm-200 pt-6">
                <h3 className="font-serif text-2xl text-ink font-normal border-b border-warm-200 pb-2">
                  IEEE Region 10 & Delhi Section
                </h3>
                <p>
                  IEEE is geographically divided into 10 regions worldwide. IEEE MAIT Student Branch operates under **Region 10 (Asia-Pacific)** and the **IEEE Delhi Section**, connecting students directly with regional congresses, awards, and industry mentorship.
                </p>
              </div>

              <div className="pt-4">
                <Button href="https://ieee.org" external variant="primary" size="md">
                  Visit Global ieee.org →
                </Button>
              </div>
            </div>

            <div className="lg:col-span-4 border border-warm-200 bg-warm-100/40 p-6 rounded-[2px] space-y-6 h-fit">
              <h4 className="font-serif text-xl text-ink font-normal border-b border-warm-200 pb-3">
                IEEE at a Glance
              </h4>
              <div className="space-y-4 text-xs font-mono">
                <div>
                  <span className="text-warm-400 block uppercase">Global Membership</span>
                  <span className="text-ieee-blue font-semibold text-sm">460,000+ Members</span>
                </div>
                <div>
                  <span className="text-warm-400 block uppercase">Student Members</span>
                  <span className="text-ink font-semibold text-sm">125,000+ Worldwide</span>
                </div>
                <div>
                  <span className="text-warm-400 block uppercase">Technical Societies</span>
                  <span className="text-ink font-semibold text-sm">39 Specialized Societies</span>
                </div>
                <div>
                  <span className="text-warm-400 block uppercase">Conferences Hosted</span>
                  <span className="text-ink font-semibold text-sm">2,000+ Annual Events</span>
                </div>
                <div>
                  <span className="text-warm-400 block uppercase">Standards Developed</span>
                  <span className="text-ink font-semibold text-sm">1,000+ Active Standards</span>
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
