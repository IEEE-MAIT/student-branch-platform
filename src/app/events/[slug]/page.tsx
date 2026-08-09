import React from 'react';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EVENTS_DATA } from '@/lib/data';
import Link from 'next/link';

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EventPageProps) {
  const resolvedParams = await params;
  const event = EVENTS_DATA.find(e => e.slug === resolvedParams.slug);
  if (!event) return { title: 'Event Not Found — IEEE MAIT' };

  return {
    title: `${event.title} | IEEE MAIT Events`,
    description: event.description,
    openGraph: {
      title: event.title,
      description: event.description,
      type: 'article',
      siteName: 'IEEE MAIT Student Branch',
    },
  };
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const resolvedParams = await params;
  const event = EVENTS_DATA.find(e => e.slug === resolvedParams.slug);

  if (!event) {
    notFound();
  }

  // Encodes .ics data URL for instant iCal calendar file download
  const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//IEEE MAIT Student Branch//Events//EN
BEGIN:VEVENT
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.venue}
END:VEVENT
END:VCALENDAR`;

  const icsDownloadUrl = `data:text/calendar;charset=utf8,${encodeURIComponent(icsData)}`;

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white">
        <Container size="default">
          <Link href="/events" className="inline-flex items-center gap-1.5 font-mono text-xs text-warm-400 hover:text-ieee-blue mb-8 transition-colors">
            <span>← Back to Events Archive</span>
          </Link>

          <div className="flex items-center gap-2 mb-3">
            <Badge variant="ieee">{event.category}</Badge>
            <Badge variant="neutral">{event.unit}</Badge>
          </div>

          <SectionHeading
            title={event.title}
            className="mb-8"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
            <div className="lg:col-span-8 space-y-10">
              {/* Event Description */}
              <div className="space-y-4">
                <h3 className="font-serif text-2xl text-ink font-normal border-b border-warm-200 pb-2">
                  About This Event
                </h3>
                <p className="text-base text-warm-400 leading-relaxed font-sans">
                  {event.description}
                </p>
              </div>

              {/* Event Schedule */}
              {event.schedule && event.schedule.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-serif text-2xl text-ink font-normal border-b border-warm-200 pb-2">
                    Event Schedule
                  </h3>
                  <div className="border border-warm-200 rounded-[2px] divide-y divide-warm-200 bg-white">
                    {event.schedule.map((item, idx) => (
                      <div key={idx} className="p-4 flex items-start gap-4">
                        <span className="font-mono text-xs font-semibold text-ieee-blue w-20 flex-shrink-0 pt-0.5">
                          {item.time}
                        </span>
                        <span className="text-sm text-ink font-sans">
                          {item.activity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Speakers */}
              {event.speakers && event.speakers.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-serif text-2xl text-ink font-normal border-b border-warm-200 pb-2">
                    Featured Speakers
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {event.speakers.map((sp, idx) => (
                      <div key={idx} className="p-4 border border-warm-200 rounded-[2px] bg-warm-100/30">
                        <h4 className="font-serif text-lg text-ink font-normal">{sp.name}</h4>
                        <p className="text-xs text-ieee-blue font-medium mt-0.5">{sp.title}</p>
                        <p className="text-xs text-warm-400 mt-0.5">{sp.organization}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Registration & Calendar CTAs */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Button href="/join" variant="primary" size="lg">
                  Register for Event →
                </Button>
                <a
                  href={icsDownloadUrl}
                  download={`${event.slug}.ics`}
                  className="px-5 py-3 text-sm font-medium border border-warm-200 hover:border-ieee-blue text-ink hover:text-ieee-blue rounded-[2px] transition-colors font-mono"
                >
                  📅 Add to Calendar (.ics)
                </a>
              </div>
            </div>

            {/* Event Logistics Sidebar */}
            <div className="lg:col-span-4 border border-warm-200 bg-warm-100/40 p-6 rounded-[2px] space-y-6 h-fit">
              <h4 className="font-serif text-xl text-ink font-normal border-b border-warm-200 pb-3">
                Logistics & Details
              </h4>
              <div className="space-y-4 text-xs font-mono">
                <div>
                  <span className="text-warm-400 block uppercase">Date</span>
                  <span className="text-ink font-semibold text-sm">{event.date}</span>
                </div>
                {event.time && (
                  <div>
                    <span className="text-warm-400 block uppercase">Time</span>
                    <span className="text-ink font-semibold text-sm">{event.time}</span>
                  </div>
                )}
                <div>
                  <span className="text-warm-400 block uppercase">Venue</span>
                  <span className="text-ink font-semibold text-sm">{event.venue}</span>
                </div>
                <div>
                  <span className="text-warm-400 block uppercase">Organizing Unit</span>
                  <span className="text-ieee-blue font-semibold text-sm">{event.unit}</span>
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
