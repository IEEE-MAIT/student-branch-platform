import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EventPreview } from '@/components/content/EventPreview';
import { EVENTS_DATA } from '@/lib/data';

export const metadata = {
  title: 'Events & Workshops | IEEE MAIT Student Branch',
  description: 'Upcoming technical workshops, seminars, panel discussions, and historical event archives at MAIT Delhi.',
};

export default function EventsPage() {
  const upcomingEvents = EVENTS_DATA.filter(e => e.status === 'upcoming');
  const pastEvents = EVENTS_DATA.filter(e => e.status === 'past');
  const featuredUpcoming = upcomingEvents[0];
  const remainingUpcoming = upcomingEvents.slice(1);

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white">
        <Container size="default">
          <SectionHeading
            category="Activities & Workshops"
            title="Events Archive & Calendar"
            subtitle="Browse upcoming technical sessions, workshops, and historical activity records."
          />

          {/* Upcoming Section */}
          <div className="mb-16 space-y-6">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-ieee-blue border-b border-warm-200 pb-2">
              Upcoming Events
            </h3>

            {featuredUpcoming && (
              <EventPreview
                isFeatured
                title={featuredUpcoming.title}
                slug={featuredUpcoming.slug}
                date={featuredUpcoming.date}
                time={featuredUpcoming.time}
                venue={featuredUpcoming.venue}
                unit={featuredUpcoming.unit}
                category={featuredUpcoming.category}
                description={featuredUpcoming.description}
              />
            )}

            {remainingUpcoming.length > 0 && (
              <div className="border border-warm-200 bg-white rounded-[2px] divide-y divide-warm-200">
                {remainingUpcoming.map(event => (
                  <EventPreview
                    key={event.id}
                    title={event.title}
                    slug={event.slug}
                    date={event.date}
                    venue={event.venue}
                    unit={event.unit}
                    category={event.category}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Past Events Section */}
          <div className="space-y-6">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-ink-muted border-b border-warm-200 pb-2">
              Past Events (Historical Archive)
            </h3>

            <div className="border border-warm-200 bg-white rounded-[2px] divide-y divide-warm-200">
              {pastEvents.map(event => (
                <EventPreview
                  key={event.id}
                  title={event.title}
                  slug={event.slug}
                  date={event.date}
                  venue={event.venue}
                  unit={event.unit}
                  category={event.category}
                />
              ))}
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
