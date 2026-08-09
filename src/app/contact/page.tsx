import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white">
        <Container size="default">
          <SectionHeading
            category="Outreach"
            title="Contact IEEE MAIT"
            subtitle="Get in touch for collaborations, workshops, membership inquiries, or general questions."
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
            {/* Contact Details */}
            <div className="lg:col-span-5 space-y-8">
              <div className="p-6 border border-warm-200 bg-warm-100/30 rounded-[2px] space-y-6">
                <div>
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-ieee-blue block mb-1">
                    Official Email
                  </span>
                  <a href="mailto:mait.ieee.sb@gmail.com" className="font-mono text-base font-medium text-ink hover:text-ieee-blue transition-colors">
                    mait.ieee.sb@gmail.com
                  </a>
                </div>

                <div className="border-t border-warm-200 pt-4">
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-ieee-blue block mb-1">
                    Campus Location
                  </span>
                  <p className="text-sm text-ink leading-relaxed font-sans">
                    Maharaja Agrasen Institute of Technology <br />
                    PSP Area, Plot No-1, Sector-22 <br />
                    Rohini, Delhi-110086, India
                  </p>
                </div>

                <div className="border-t border-warm-200 pt-4">
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-ieee-blue block mb-2">
                    Social Channels
                  </span>
                  <div className="flex flex-wrap gap-2 text-xs font-mono">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-white border border-warm-200 hover:border-ieee-blue text-ink hover:text-ieee-blue transition-colors rounded-[2px]">
                      Instagram
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-white border border-warm-200 hover:border-ieee-blue text-ink hover:text-ieee-blue transition-colors rounded-[2px]">
                      LinkedIn
                    </a>
                    <a href="https://github.com/IEEE-MAIT" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-white border border-warm-200 hover:border-ieee-blue text-ink hover:text-ieee-blue transition-colors rounded-[2px]">
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7 border border-warm-200 bg-white p-6 sm:p-8 rounded-[2px] space-y-6">
              <h3 className="font-serif text-2xl text-ink font-normal border-b border-warm-200 pb-3">
                Send an Inquiry
              </h3>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-ink font-medium mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aarav Sharma"
                      className="w-full px-3 py-2 text-sm border border-warm-200 rounded-[2px] focus:outline-none focus:border-ieee-blue"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-ink font-medium mb-1">
                      Your Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@domain.com"
                      className="w-full px-3 py-2 text-sm border border-warm-200 rounded-[2px] focus:outline-none focus:border-ieee-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-ink font-medium mb-1">
                    Subject / Topic
                  </label>
                  <select className="w-full px-3 py-2 text-sm border border-warm-200 rounded-[2px] focus:outline-none focus:border-ieee-blue bg-white">
                    <option>General Inquiry</option>
                    <option>Membership & Registration</option>
                    <option>Event & Workshop Collaboration</option>
                    <option>Sponsorship / Industry Partnership</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-ink font-medium mb-1">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can IEEE MAIT assist you?"
                    className="w-full px-3 py-2 text-sm border border-warm-200 rounded-[2px] focus:outline-none focus:border-ieee-blue"
                  />
                </div>

                <Button type="submit" variant="primary" size="md" className="w-full sm:w-auto">
                  Submit Message →
                </Button>
              </form>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
