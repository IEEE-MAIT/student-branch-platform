/**
 * @file src/app/projects/[slug]/page.tsx
 * @description Technical Project Case Study & Specification Detail Page with react-icons.
 * 
 * FEATURES:
 * - Architecture breakdown and system implementation narrative.
 * - Hardware specifications & firmware methodology.
 * - Live GitHub repo & demo action buttons with react-icons.
 * - Contributor & builder attribution.
 * - Social sharing & related project recommendations.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import React from 'react';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ShareWidget } from '@/components/content/ShareWidget';
import { getDynamicProjectBySlug, getDynamicProjects } from '@/lib/api';
import Link from '@/components/ui/AppLink';
import { FaGithub } from 'react-icons/fa6';
import { FiExternalLink, FiArrowRight, FiArrowLeft, FiUsers } from 'react-icons/fi';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  const projects = await getDynamicProjects();
  return projects.map((p: any) => ({
    slug: p.slug,
  }));
}

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60; // ISR Cache for 60 seconds

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const project = await getDynamicProjectBySlug(resolvedParams.slug);
  if (!project) return { title: 'Project Not Found — IEEE MAIT' };

  return {
    title: `${project.title} | IEEE MAIT Projects`,
    description: project.summary || `Technical project built by IEEE MAIT Student Branch members.`,
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const project = await getDynamicProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const allProjects = await getDynamicProjects();
  const relatedProjects = allProjects
    .filter((p: any) => p.slug !== slug)
    .slice(0, 2);

  const shareUrl = `https://ieee-mait.org/projects/${slug}`;

  return (
    <>
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 bg-white dark:bg-gray-950 transition-colors duration-200 page-enter">
        <Container size="narrow">
          {/* Breadcrumbs */}
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Technical Projects', href: '/projects' },
              { label: project.title },
            ]}
          />

          {/* Project Header Banner */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <Badge variant="ieee">{project.year}</Badge>
              {project.chapter && <Badge variant="neutral">{project.chapter.name}</Badge>}
              {project.sig && <Badge variant="neutral">SIG: {project.sig.name}</Badge>}
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                ● {project.status}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ink dark:text-gray-100 font-normal leading-tight">
              {project.title}
            </h1>

            <p className="text-lg text-warm-500 dark:text-gray-300 font-sans leading-relaxed pt-1">
              {project.summary}
            </p>

            {/* Action Links Bar */}
            <div className="flex items-center gap-4 pt-4 border-y border-warm-200 dark:border-gray-800 py-4 flex-wrap">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-ink dark:bg-gray-800 hover:bg-black dark:hover:bg-gray-700 text-white font-mono text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors shadow-xs"
                >
                  <FaGithub className="w-4 h-4" />
                  <span>Explore on GitHub</span>
                  <FiExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              )}

              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-ieee-blue hover:bg-ieee-dark dark:bg-sky-600 dark:hover:bg-sky-700 text-white font-mono text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>Live Demonstration</span>
                  <FiExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              )}

              <span className="font-mono text-xs text-warm-400 dark:text-gray-400 ml-auto">
                IEEE MAIT Innovation Lab
              </span>
            </div>
          </div>

          {/* Tech Stack Chips */}
          {project.tags && project.tags.length > 0 && (
            <div className="mb-10 space-y-3">
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-ieee-blue dark:text-sky-400 block">
                Technology Stack & Components
              </span>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-lg text-xs font-mono bg-warm-50 dark:bg-gray-800 border border-warm-200 dark:border-gray-700 text-warm-600 dark:text-gray-200 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Detailed System Architecture & Description */}
          <div className="space-y-6 text-base text-ink/85 dark:text-gray-200 font-sans leading-relaxed border-b border-warm-200 dark:border-gray-800 pb-10">
            <h2 className="font-serif text-2xl text-ink dark:text-gray-100 font-normal">
              System Architecture & Methodology
            </h2>
            <p>
              {project.description || project.summary}
            </p>
            <p>
              All hardware schematics, PCB Gerbers, firmware drivers, and neural network weight topologies developed under this project are licensed under the MIT Open Source License and open-sourced to encourage academic research and collaborative student learning.
            </p>

            {/* Technical Specifications Matrix */}
            <div className="pt-4">
              <h3 className="font-serif text-xl text-ink dark:text-gray-100 font-normal mb-3">
                Technical Specifications & Architecture Matrix
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3.5 bg-warm-50/70 dark:bg-gray-900/70 border border-warm-200/80 dark:border-gray-800 rounded-xl space-y-1">
                  <span className="text-warm-400 dark:text-gray-400 block text-[10px] uppercase tracking-wider">Target Controller / SOC</span>
                  <span className="text-ink dark:text-gray-200 font-bold">
                    {slug.includes('rover') ? 'STM32F401 & ESP32 Telemetry Dual-Core' : slug.includes('acoustic') ? 'ESP32-S3 Xtensa Dual-Core with Vector Extensions' : slug.includes('riscv') ? 'Xilinx Artix-7 FPGA (RV32I Soft-Core)' : 'Cloudflare Workers & V8 Edge Runtime'}
                  </span>
                </div>
                <div className="p-3.5 bg-warm-50/70 dark:bg-gray-900/70 border border-warm-200/80 dark:border-gray-800 rounded-xl space-y-1">
                  <span className="text-warm-400 dark:text-gray-400 block text-[10px] uppercase tracking-wider">Firmware / Core Engine</span>
                  <span className="text-ink dark:text-gray-200 font-bold">
                    {slug.includes('rover') ? 'FreeRTOS & Embedded C Hal' : slug.includes('acoustic') ? 'TensorFlow Lite Micro (8-Bit INT8)' : slug.includes('riscv') ? 'Verilog HDL & Bare-Metal C Runtime' : 'Next.js 16 App Router & Turbopack'}
                  </span>
                </div>
                <div className="p-3.5 bg-warm-50/70 dark:bg-gray-900/70 border border-warm-200/80 dark:border-gray-800 rounded-xl space-y-1">
                  <span className="text-warm-400 dark:text-gray-400 block text-[10px] uppercase tracking-wider">Communication & Protocols</span>
                  <span className="text-ink dark:text-gray-200 font-bold">
                    {slug.includes('rover') ? '2.4GHz ISM Band, I2C, SPI & PWM' : slug.includes('acoustic') ? 'I2S MEMS Bus, WiFi 802.11 b/g/n, MQTT' : slug.includes('riscv') ? 'Memory-Mapped AXI4-Lite & UART Peripherals' : 'HTTPS/3, PostgreSQL Wire Protocol, Edge WebSockets'}
                  </span>
                </div>
                <div className="p-3.5 bg-warm-50/70 dark:bg-gray-900/70 border border-warm-200/80 dark:border-gray-800 rounded-xl space-y-1">
                  <span className="text-warm-400 dark:text-gray-400 block text-[10px] uppercase tracking-wider">Licensing & Open Access</span>
                  <span className="text-ink dark:text-gray-200 font-bold">MIT Open Source License (Public Repository)</span>
                </div>
              </div>
            </div>

            {/* Call for Student Contributors */}
            <div className="p-6 border border-ieee-blue/30 dark:border-sky-800 bg-ieee-subtle/30 dark:bg-sky-950/30 rounded-xl mt-6 space-y-3">
              <div className="flex items-center gap-2">
                <FiUsers className="w-5 h-5 text-ieee-blue dark:text-sky-400" />
                <h4 className="font-serif text-lg text-ink dark:text-gray-100 font-normal">
                  Open Engineering Workstreams
                </h4>
              </div>
              <p className="text-xs text-warm-500 dark:text-gray-300 font-sans leading-relaxed">
                Interested in contributing hardware improvements, optimizing neural network quantization, or writing documentation for this project?
              </p>
              <div className="pt-1 flex items-center gap-3 flex-wrap text-xs font-mono">
                <Link
                  href="/opportunities"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-ieee-blue hover:bg-ieee-dark dark:bg-sky-600 dark:hover:bg-sky-700 text-white font-bold rounded-lg transition-colors shadow-xs"
                >
                  <span>Join Technical Contributor Track</span>
                  <FiArrowRight className="w-3.5 h-3.5" />
                </Link>
                {project.githubUrl && (
                  <a
                    href={`${project.githubUrl}/issues`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ieee-blue dark:text-sky-400 hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>View Open GitHub Issues</span>
                    <FiExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Social Share Widget */}
          <ShareWidget url={shareUrl} title={project.title} />

          {/* Related Projects Strip */}
          {relatedProjects.length > 0 && (
            <div className="pt-12 space-y-6">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-ieee-blue dark:text-sky-400">
                Explore More Technical Projects
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {relatedProjects.map((p: any) => (
                  <div
                    key={p.id}
                    className="p-5 border border-warm-200 dark:border-gray-800 bg-warm-50/40 dark:bg-gray-900/40 rounded-xl space-y-2 hover:border-ieee-blue/40 transition-colors group"
                  >
                    <span className="font-mono text-[10px] text-ieee-blue dark:text-sky-400 uppercase">
                      {p.year} · {p.status}
                    </span>
                    <h4 className="font-serif text-lg text-ink dark:text-gray-100 font-normal leading-snug group-hover:text-ieee-blue dark:group-hover:text-sky-400 transition-colors">
                      <Link href={`/projects/${p.slug}`}>
                        {p.title}
                      </Link>
                    </h4>
                    <p className="text-xs text-warm-500 dark:text-gray-400 font-sans line-clamp-2">
                      {p.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Back Footer Link */}
          <div className="mt-12 pt-8 border-t border-warm-200 dark:border-gray-800 flex justify-between items-center">
            <Link
              href="/projects"
              className="text-xs font-mono text-ieee-blue dark:text-sky-400 hover:underline font-semibold flex items-center gap-1"
            >
              <FiArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Projects</span>
            </Link>
            <span className="font-mono text-xs text-warm-400 dark:text-gray-500">
              IEEE MAIT Technical Cell
            </span>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
