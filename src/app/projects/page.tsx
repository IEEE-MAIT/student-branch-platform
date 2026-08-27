/**
 * @file src/app/projects/page.tsx
 * @description Technical Projects Directory Page.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ProjectsFilter } from '@/components/content/ProjectsFilter';
import { getDynamicProjects } from '@/lib/api';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Technical Projects Hub | IEEE MAIT Student Branch',
  description:
    'Explore hardware builds, autonomous robotics rovers, Edge-AI sensor nodes, RISC-V soft-cores, and open-source software built by IEEE MAIT student engineers.',
};

export const revalidate = 60; // ISR Cache for 60 seconds

export default async function ProjectsPage() {
  const projects = await getDynamicProjects();

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white dark:bg-gray-950 transition-colors duration-200 page-enter">
        <Container size="default">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Technical Projects' },
            ]}
          />

          <SectionHeading
            category="Engineering & Innovation"
            title="Technical Projects & Hardware Builds"
            subtitle="Autonomous robotics rovers, Edge-AI industrial sensor nodes, custom RISC-V pipelined processors, and open-source cloud systems engineered by IEEE MAIT students."
          />

          {/* Client-side Filtering & Search Engine */}
          <ProjectsFilter initialProjects={projects} />
        </Container>
      </main>

      <Footer />
    </>
  );
}
