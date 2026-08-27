'use client';

/**
 * @file src/app/contact/page.tsx
 * @description Official Contact & Outreach page for IEEE MAIT Student Branch with react-icons.
 * 
 * Includes campus location in Rohini, Delhi, official contact email (mait.ieee.sb@gmail.com),
 * social media links with react-icons, and interactive inquiry form handling.
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
import { FiMail, FiMapPin, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { FaInstagram, FaLinkedinIn, FaGithub } from 'react-icons/fa6';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      category: formData.get('category') as string,
      message: formData.get('message') as string,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const errData: any = await res.json().catch(() => ({}));
        setError(errData?.error || 'Failed to submit message. Please try again.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white dark:bg-gray-950 transition-colors duration-200 page-enter">
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
              <div className="p-6 border border-warm-200 dark:border-gray-800 bg-warm-100/30 dark:bg-gray-900/50 rounded-xl space-y-6 shadow-xs">
                <div>
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-ieee-blue dark:text-sky-400 flex items-center gap-1.5 mb-1">
                    <FiMail className="w-4 h-4" />
                    <span>Official Email</span>
                  </span>
                  <a href="mailto:mait.ieee.sb@gmail.com" className="font-mono text-base font-medium text-ink dark:text-gray-100 hover:text-ieee-blue dark:hover:text-sky-400 transition-colors">
                    mait.ieee.sb@gmail.com
                  </a>
                </div>

                <div className="border-t border-warm-200 dark:border-gray-800 pt-4">
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-ieee-blue dark:text-sky-400 flex items-center gap-1.5 mb-1">
                    <FiMapPin className="w-4 h-4" />
                    <span>Campus Location</span>
                  </span>
                  <p className="text-sm text-ink dark:text-gray-300 leading-relaxed font-sans">
                    Maharaja Agrasen Institute of Technology <br />
                    PSP Area, Plot No-1, Sector-22 <br />
                    Rohini, Delhi-110086, India
                  </p>
                </div>

                <div className="border-t border-warm-200 dark:border-gray-800 pt-4">
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-ieee-blue dark:text-sky-400 block mb-2">
                    Social Channels
                  </span>
                  <div className="flex flex-wrap gap-2 text-xs font-mono">
                    <a
                      href="https://instagram.com/ieee_mait"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-warm-200 dark:border-gray-700 hover:border-ieee-blue text-ink dark:text-gray-200 hover:text-ieee-blue dark:hover:text-sky-400 transition-colors rounded-lg flex items-center gap-1.5"
                    >
                      <FaInstagram className="w-3.5 h-3.5" />
                      <span>Instagram</span>
                    </a>
                    <a
                      href="https://linkedin.com/company/ieee-mait"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-warm-200 dark:border-gray-700 hover:border-ieee-blue text-ink dark:text-gray-200 hover:text-ieee-blue dark:hover:text-sky-400 transition-colors rounded-lg flex items-center gap-1.5"
                    >
                      <FaLinkedinIn className="w-3.5 h-3.5" />
                      <span>LinkedIn</span>
                    </a>
                    <a
                      href="https://github.com/IEEE-MAIT"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-warm-200 dark:border-gray-700 hover:border-ieee-blue text-ink dark:text-gray-200 hover:text-ieee-blue dark:hover:text-sky-400 transition-colors rounded-lg flex items-center gap-1.5"
                    >
                      <FaGithub className="w-3.5 h-3.5" />
                      <span>GitHub</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7 border border-warm-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-xl space-y-6 shadow-xs">
              <h3 className="font-serif text-2xl text-ink dark:text-gray-100 font-normal border-b border-warm-200 dark:border-gray-800 pb-3">
                Send an Inquiry
              </h3>

              {submitted ? (
                <div className="p-6 bg-ieee-subtle dark:bg-sky-950/60 border border-ieee-blue/20 dark:border-sky-800 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <FiCheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-mono text-xs font-bold text-ieee-blue dark:text-sky-400 uppercase tracking-wider block">
                      Message Sent Successfully
                    </span>
                  </div>
                  <p className="text-sm text-ink dark:text-gray-200 font-sans">
                    Thank you for reaching out to IEEE MAIT Student Branch. Our executive team will review your message and respond to your email shortly.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-xs font-mono text-ieee-blue dark:text-sky-400 underline cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-warm-500 dark:text-gray-400 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="John Doe"
                        className="w-full px-3.5 py-2.5 text-sm bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100 focus:outline-hidden focus:border-ieee-blue font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-warm-500 dark:text-gray-400 mb-1">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="johndoe@example.com"
                        className="w-full px-3.5 py-2.5 text-sm bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100 focus:outline-hidden focus:border-ieee-blue font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-warm-500 dark:text-gray-400 mb-1">
                      Inquiry Category *
                    </label>
                    <select
                      name="category"
                      required
                      className="w-full px-3.5 py-2.5 text-sm bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100 focus:outline-hidden focus:border-ieee-blue font-sans"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Membership & Registration">Membership &amp; Registration</option>
                      <option value="Event Collaboration & Sponsorship">Event Collaboration &amp; Sponsorship</option>
                      <option value="Workshop & Technical Track">Workshop &amp; Technical Track</option>
                      <option value="Recruitment & ExeCom">Recruitment &amp; ExeCom</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-warm-500 dark:text-gray-400 mb-1">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      required
                      placeholder="How can IEEE MAIT assist you?"
                      className="w-full px-3.5 py-2.5 text-sm bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 rounded-lg text-ink dark:text-gray-100 focus:outline-hidden focus:border-ieee-blue font-sans"
                    />
                  </div>

                  {error && (
                    <p className="text-sm font-mono text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/60 px-3 py-2 rounded-lg">
                      {error}
                    </p>
                  )}

                  <Button type="submit" variant="primary" size="md" className="w-full sm:w-auto flex items-center justify-center gap-1.5" disabled={loading}>
                    <span>{loading ? 'Sending...' : 'Submit Message'}</span>
                    {!loading && <FiArrowRight className="w-4 h-4" />}
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
