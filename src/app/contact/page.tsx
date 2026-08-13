'use client';

/**
 * @file src/app/contact/page.tsx
 * @description Official Contact & Outreach page for IEEE MAIT Student Branch.
 * 
 * Includes campus location in Rohini, Delhi, official contact email (mait.ieee.sb@gmail.com),
 * social media links, and interactive inquiry form handling.
 * 
 * @author IEEE MAIT Webmaster & Open Source Contributors
 */

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/Button';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem('name') as any)?.value || '',
      email: (form.elements.namedItem('email') as any)?.value || '',
      subject: (form.elements.namedItem('subject') as any)?.value || '',
      message: (form.elements.namedItem('message') as any)?.value || '',
    };
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json: any = await res.json();
        setError(json.error || 'Submission failed. Please try again.');
      } else {
        setSubmitted(true);
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white page-enter">
        <Container size="default">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Contact' },
            ]}
          />

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

              {submitted ? (
                <div className="p-6 bg-ieee-subtle border border-ieee-blue/20 rounded-[2px] space-y-2">
                  <span className="font-mono text-xs font-bold text-ieee-blue uppercase tracking-wider block">
                    Message Sent Successfully
                  </span>
                  <p className="text-sm text-ink font-sans">
                    Thank you for reaching out to IEEE MAIT Student Branch. Our executive team will review your message and respond to your email shortly.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-xs font-mono text-ieee-blue underline"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-xs uppercase tracking-wider text-ink font-medium mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="e.g. Aarav Sharma"
                        className="w-full px-3 py-2 text-sm border border-warm-200 rounded-[2px] focus:outline-none focus:border-ieee-blue font-sans"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs uppercase tracking-wider text-ink font-medium mb-1">
                        Your Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="name@domain.com"
                        className="w-full px-3 py-2 text-sm border border-warm-200 rounded-[2px] focus:outline-none focus:border-ieee-blue font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-ink font-medium mb-1">
                      Subject / Topic
                    </label>
                    <select name="subject" className="w-full px-3 py-2 text-sm border border-warm-200 rounded-[2px] focus:outline-none focus:border-ieee-blue bg-white font-sans">
                      <option>General Inquiry</option>
                      <option>Membership &amp; Registration</option>
                      <option>Event &amp; Workshop Collaboration</option>
                      <option>Sponsorship / Industry Partnership</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-ink font-medium mb-1">
                      Message
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      required
                      placeholder="How can IEEE MAIT assist you?"
                      className="w-full px-3 py-2 text-sm border border-warm-200 rounded-[2px] focus:outline-none focus:border-ieee-blue font-sans"
                    />
                  </div>

                  {error && (
                    <p className="text-sm font-mono text-red-600 border border-red-200 bg-red-50 px-3 py-2 rounded-[2px]">
                      {error}
                    </p>
                  )}

                  <Button type="submit" variant="primary" size="md" className="w-full sm:w-auto" disabled={loading}>
                    {loading ? 'Sending...' : 'Submit Message →'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
