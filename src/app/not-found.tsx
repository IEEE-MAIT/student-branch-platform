import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <>
      <Navbar />

      <main className="flex-1 py-24 bg-grid-pattern flex items-center">
        <Container size="narrow" className="text-center space-y-6">
          <span className="font-mono text-xs font-semibold text-ieee-blue uppercase tracking-widest">
            Error 404
          </span>

          <h1 className="font-serif text-4xl sm:text-5xl text-ink font-normal">
            Page Not Found
          </h1>

          <div className="accent-rule mx-auto my-2" />

          <p className="text-base text-warm-400 font-sans leading-relaxed">
            The page you are looking for doesn&apos;t exist or has been moved to a new section in the IEEE MAIT archive.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Button href="/" variant="primary" size="md">
              Go to Homepage →
            </Button>
            <Button href="/events" variant="secondary" size="md">
              Explore Events
            </Button>
            <Button href="/contact" variant="ghost" size="md">
              Contact Us
            </Button>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
