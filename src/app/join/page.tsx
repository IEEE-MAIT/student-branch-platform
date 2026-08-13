import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/Button';

export default function JoinPage() {
  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white page-enter">
        <Container size="default">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Join IEEE MAIT' },
            ]}
          />

          <SectionHeading
            category="Membership"
            title="Join IEEE MAIT Student Branch"
            subtitle="Become part of a global network of 460,000+ technologists and join 150+ active students at MAIT Delhi."
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
            {/* Steps & Guidance */}
            <div className="lg:col-span-8 space-y-10">
              <div className="space-y-6">
                <h3 className="font-serif text-2xl text-ink font-normal border-b border-warm-200 pb-3">
                  Why Become an IEEE Member?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-5 border border-warm-200 bg-warm-100/30 rounded-[2px] space-y-2">
                    <span className="font-mono text-xs font-semibold text-ieee-blue uppercase tracking-wider">01. Global Network</span>
                    <h4 className="font-serif text-lg text-ink font-normal">460,000+ Technologists</h4>
                    <p className="text-xs text-warm-400 leading-relaxed">
                      Connect with student members, researchers, and industry professionals across 160+ countries.
                    </p>
                  </div>
                  <div className="p-5 border border-warm-200 bg-warm-100/30 rounded-[2px] space-y-2">
                    <span className="font-mono text-xs font-semibold text-ieee-blue uppercase tracking-wider">02. Hands-on Experience</span>
                    <h4 className="font-serif text-lg text-ink font-normal">Technical Workshops</h4>
                    <p className="text-xs text-warm-400 leading-relaxed">
                      Gain practical experience in machine learning, hardware design, robotics, and software development.
                    </p>
                  </div>
                  <div className="p-5 border border-warm-200 bg-warm-100/30 rounded-[2px] space-y-2">
                    <span className="font-mono text-xs font-semibold text-ieee-blue uppercase tracking-wider">03. Leadership</span>
                    <h4 className="font-serif text-lg text-ink font-normal">Executive Opportunities</h4>
                    <p className="text-xs text-warm-400 leading-relaxed">
                      Lead teams, organize national-level technical events, and build management confidence.
                    </p>
                  </div>
                  <div className="p-5 border border-warm-200 bg-warm-100/30 rounded-[2px] space-y-2">
                    <span className="font-mono text-xs font-semibold text-ieee-blue uppercase tracking-wider">04. IEEE Resources</span>
                    <h4 className="font-serif text-lg text-ink font-normal">Digital Library Access</h4>
                    <p className="text-xs text-warm-400 leading-relaxed">
                      Discounted conference registrations, IEEE Xplore digital library access, and society publications.
                    </p>
                  </div>
                </div>
              </div>

              {/* How to Join Steps */}
              <div className="space-y-6">
                <h3 className="font-serif text-2xl text-ink font-normal border-b border-warm-200 pb-3">
                  4 Steps to Register
                </h3>

                <ol className="space-y-4 font-sans text-sm text-ink">
                  <li className="flex items-start gap-4 p-4 border border-warm-200 bg-white rounded-[2px]">
                    <span className="font-mono text-base font-bold text-ieee-blue bg-ieee-subtle px-2.5 py-1 rounded-[2px]">Step 1</span>
                    <div>
                      <span className="font-semibold text-ink block">Fill the IEEE MAIT Registration Form</span>
                      <span className="text-xs text-warm-400">Complete our official branch Google Form with your details and department info.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4 p-4 border border-warm-200 bg-white rounded-[2px]">
                    <span className="font-mono text-base font-bold text-ieee-blue bg-ieee-subtle px-2.5 py-1 rounded-[2px]">Step 2</span>
                    <div>
                      <span className="font-semibold text-ink block">Create Account on ieee.org</span>
                      <span className="text-xs text-warm-400">Sign up on the global IEEE portal to obtain your IEEE Account credentials.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4 p-4 border border-warm-200 bg-white rounded-[2px]">
                    <span className="font-mono text-base font-bold text-ieee-blue bg-ieee-subtle px-2.5 py-1 rounded-[2px]">Step 3</span>
                    <div>
                      <span className="font-semibold text-ink block">Select MAIT as Student Branch</span>
                      <span className="text-xs text-warm-400">Ensure &quot;Maharaja Agrasen Inst of Tech&quot; is selected as your university branch.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4 p-4 border border-warm-200 bg-white rounded-[2px]">
                    <span className="font-mono text-base font-bold text-ieee-blue bg-ieee-subtle px-2.5 py-1 rounded-[2px]">Step 4</span>
                    <div>
                      <span className="font-semibold text-ink block">Join WhatsApp & Discord Channels</span>
                      <span className="text-xs text-warm-400">Receive your membership confirmation and get added to our active community channels.</span>
                    </div>
                  </li>
                </ol>

                <div className="pt-4">
                  <Button 
                    href="https://forms.google.com" 
                    external 
                    variant="primary" 
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Open Membership Registration Form →
                  </Button>
                </div>
              </div>
            </div>

            {/* FAQ Card */}
            <div className="lg:col-span-4 border border-warm-200 bg-warm-100/40 p-6 rounded-[2px] space-y-6 h-fit">
              <h4 className="font-serif text-xl text-ink font-normal border-b border-warm-200 pb-3">
                Frequently Asked Questions
              </h4>

              <div className="space-y-4 text-xs">
                <div>
                  <h5 className="font-semibold text-ink mb-1">Who can join IEEE MAIT?</h5>
                  <p className="text-warm-400 leading-relaxed">
                    Any student enrolled at Maharaja Agrasen Institute of Technology across any year and department (CSE, IT, ECE, EEE, MAE, AI/ML, etc.) is eligible.
                  </p>
                </div>

                <div className="border-t border-warm-200 pt-3">
                  <h5 className="font-semibold text-ink mb-1">Can 1st-year students join?</h5>
                  <p className="text-warm-400 leading-relaxed">
                    Yes! First-year students are actively encouraged to join to make the most of workshops and early leadership roles.
                  </p>
                </div>

                <div className="border-t border-warm-200 pt-3">
                  <h5 className="font-semibold text-ink mb-1">Need assistance registering?</h5>
                  <p className="text-warm-400 leading-relaxed">
                    Contact our membership team at <span className="text-ieee-blue font-mono">mait.ieee.sb@gmail.com</span>
                  </p>
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
