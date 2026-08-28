// @ts-nocheck
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import {
  EVENTS_DATA,
  ACHIEVEMENTS_DATA,
  CHAPTERS_DATA,
  STORIES_DATA,
  GALLERY_ALBUMS_DATA,
  PROJECTS_DATA,
  INITIATIVES_DATA,
  PEOPLE_DATA,
  SIGS_DATA,
  OPPORTUNITIES_DATA,
  MILESTONES_DATA,
} from '../src/lib/data';
import { SUPER_ADMIN_FALLBACK } from '../src/lib/officers';
import { ROLE_DEFAULT_PERMISSIONS } from '../src/lib/permissions';

// Load variables from .env and .dev.vars
dotenv.config({ path: resolve(process.cwd(), '.env') });
dotenv.config({ path: resolve(process.cwd(), '.dev.vars') });

const prisma = new PrismaClient();

async function seed() {
  console.log('Connecting to database via Prisma ORM...');

  try {
    // -------------------------------------------------------------------------
    // 1. ACADEMIC YEARS
    // -------------------------------------------------------------------------
    console.log('Seeding Academic Years...');
    const academicYears = [
      { id: 'ay-2025-26', label: '2025-26', isCurrent: true, startDate: '2025-08-01', endDate: '2026-07-31' },
      { id: 'ay-2024-25', label: '2024-25', isCurrent: false, startDate: '2024-08-01', endDate: '2025-07-31' },
      { id: 'ay-2023-24', label: '2023-24', isCurrent: false, startDate: '2023-08-01', endDate: '2024-07-31' },
      { id: 'ay-2022-23', label: '2022-23', isCurrent: false, startDate: '2022-08-01', endDate: '2023-07-31' },
    ];

    for (const ay of academicYears) {
      await prisma.academicYear.upsert({
        where: { label: ay.label },
        update: { isCurrent: ay.isCurrent, startDate: ay.startDate, endDate: ay.endDate },
        create: ay,
      });
    }

    const currentYear = await prisma.academicYear.findUnique({ where: { label: '2025-26' } });

    // -------------------------------------------------------------------------
    // 2. PEOPLE & ROLES (CURRENT SESSION 2025–26)
    // -------------------------------------------------------------------------
    console.log('Seeding People & Roles...');
    for (const person of PEOPLE_DATA) {
      await prisma.person.upsert({
        where: { id: person.id },
        update: {
          name: person.name,
          role: person.role,
          category: person.category,
          department: person.department || null,
          academicYear: person.academicYear || '2025-26',
          bio: person.bio || `Active member of IEEE MAIT Student Branch committed to technical innovation and leadership in ${person.department || 'Engineering'}.`,
          imageUrl: person.imageUrl || person.imageSrc || null,
          linkedIn: person.linkedIn || 'https://linkedin.com',
          github: person.github || 'https://github.com/IEEE-MAIT',
          email: person.email || `${person.name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@ieee-mait.org`,
          hierarchy: person.hierarchy ?? 10,
          isFacultyAdvisor: person.isFacultyAdvisor ?? (person.category === 'Counsellor'),
          facultyDepartment: person.isFacultyAdvisor ? (person.department || 'ECE') : null,
        },
        create: {
          id: person.id,
          name: person.name,
          role: person.role,
          category: person.category,
          department: person.department || null,
          academicYear: person.academicYear || '2025-26',
          bio: person.bio || `Active member of IEEE MAIT Student Branch committed to technical innovation and leadership in ${person.department || 'Engineering'}.`,
          imageUrl: person.imageUrl || person.imageSrc || null,
          linkedIn: person.linkedIn || 'https://linkedin.com',
          github: person.github || 'https://github.com/IEEE-MAIT',
          email: person.email || `${person.name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@ieee-mait.org`,
          hierarchy: person.hierarchy ?? 10,
          isFacultyAdvisor: person.isFacultyAdvisor ?? (person.category === 'Counsellor'),
          facultyDepartment: person.isFacultyAdvisor ? (person.department || 'ECE') : null,
        },
      });

      const roleId = `role-${person.role.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      await prisma.role.upsert({
        where: { id: roleId },
        update: { title: person.role, category: person.category, hierarchy: person.hierarchy ?? 10 },
        create: {
          id: roleId,
          title: person.role,
          category: person.category,
          hierarchy: person.hierarchy ?? 10,
        },
      });
    }    // -------------------------------------------------------------------------
    // 3. CHAPTERS
    // -------------------------------------------------------------------------
    console.log('Seeding Chapters...');
    const chaptersDataWithMedia = {
      sb: {
        ...CHAPTERS_DATA.sb,
        coverImageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&auto=format&fit=crop&q=80',
        leaderId: 'p-sec1', // Devansh Sharma
      },
      eds: {
        ...CHAPTERS_DATA.eds,
        coverImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&auto=format&fit=crop&q=80',
        leaderId: 'p-eds1', // Rohan Bansal
      },
      wie: {
        ...CHAPTERS_DATA.wie,
        coverImageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1600&auto=format&fit=crop&q=80',
        leaderId: 'p-wie1', // Liesha Gupta
      },
    };

    for (const chap of Object.values(chaptersDataWithMedia)) {
      await prisma.chapter.upsert({
        where: { id: chap.id },
        update: {
          name: chap.name,
          slug: chap.slug,
          type: chap.type,
          parentSociety: chap.parentSociety,
          establishedYear: chap.establishedYear,
          tagline: chap.tagline || null,
          description: chap.description,
          mission: chap.mission || null,
          logoUrl: chap.logoUrl || null,
          coverImageUrl: chap.coverImageUrl || null,
          accentColor: chap.accentColor || null,
          instagramUrl: chap.instagramUrl || null,
          linkedinUrl: chap.linkedinUrl || null,
          githubUrl: chap.githubUrl || null,
          leaderName: chap.leaderName || null,
          leaderRole: chap.leaderRole || null,
          leaderId: chap.leaderId || null,
          memberCount: parseInt(String(chap.memberCount).replace(/\D/g, ''), 10) || 0,
          eventCount: parseInt(String(chap.eventCount).replace(/\D/g, ''), 10) || 0,
        },
        create: {
          id: chap.id,
          name: chap.name,
          slug: chap.slug,
          type: chap.type,
          parentSociety: chap.parentSociety,
          establishedYear: chap.establishedYear,
          tagline: chap.tagline || null,
          description: chap.description,
          mission: chap.mission || null,
          logoUrl: chap.logoUrl || null,
          coverImageUrl: chap.coverImageUrl || null,
          accentColor: chap.accentColor || null,
          instagramUrl: chap.instagramUrl || null,
          linkedinUrl: chap.linkedinUrl || null,
          githubUrl: chap.githubUrl || null,
          leaderName: chap.leaderName || null,
          leaderRole: chap.leaderRole || null,
          leaderId: chap.leaderId || null,
          memberCount: parseInt(String(chap.memberCount).replace(/\D/g, ''), 10) || 0,
          eventCount: parseInt(String(chap.eventCount).replace(/\D/g, ''), 10) || 0,
        },
      });
    }

    // -------------------------------------------------------------------------
    // 4. ORGANIZATION MEMBERSHIPS (CURRENT SESSION 2025–26)
    // -------------------------------------------------------------------------
    console.log('Seeding Memberships...');
    for (const person of PEOPLE_DATA) {
      const roleId = `role-${person.role.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      const targetChapterId = person.chapterId || (person.category === 'Chapter Lead' ? person.chapterSlug : 'sb');
      await prisma.organizationMembership.upsert({
        where: { id: `mem-${person.id}` },
        update: {
          chapterId: targetChapterId,
          isCurrent: true,
          sortOrder: person.hierarchy ?? 10,
        },
        create: {
          id: `mem-${person.id}`,
          personId: person.id,
          roleId: roleId,
          academicYearId: currentYear.id,
          chapterId: targetChapterId,
          startDate: '2025-08-01',
          isCurrent: true,
          sortOrder: person.hierarchy ?? 10,
        },
      });
    }

    // -------------------------------------------------------------------------
    // 5. SPECIAL INTEREST GROUPS (SIGs) & SIG MEMBERSHIPS
    // -------------------------------------------------------------------------
    console.log('Seeding SIGs & SIG Memberships...');
    const sigLeadsMap = {
      'dsa': 'p-sec1',         // Devansh Sharma
      'development': 'p-sec4', // Dishant Pandey
      'ai-ml': 'p-eds2',       // Aarav Sharma
      'hardware': 'p-eds3',    // Kunal Verma
    };

    for (const sig of SIGS_DATA) {
      const assignedLeadId = sigLeadsMap[sig.slug] || null;
      const sRecord = await prisma.sIG.upsert({
        where: { id: sig.id },
        update: {
          name: sig.name,
          slug: sig.slug,
          description: sig.description,
          accentColor: sig.accentColor || '#0284C7',
          coverImageUrl: sig.coverImageUrl || null,
          memberCount: sig.memberCount || 40,
          leadId: assignedLeadId,
        },
        create: {
          id: sig.id,
          name: sig.name,
          slug: sig.slug,
          description: sig.description,
          accentColor: sig.accentColor || '#0284C7',
          coverImageUrl: sig.coverImageUrl || null,
          memberCount: sig.memberCount || 40,
          leadId: assignedLeadId,
        },
      });

      if (assignedLeadId) {
        await prisma.sIGMembership.upsert({
          where: { sigId_personId: { sigId: sRecord.id, personId: assignedLeadId } },
          update: { role: 'Lead', isCurrent: true },
          create: {
            id: `sig-mem-${sig.slug}-${assignedLeadId}`,
            sigId: sRecord.id,
            personId: assignedLeadId,
            role: 'Lead',
            isCurrent: true,
            joinedAt: new Date('2025-08-15'),
          },
        });
      }
    }

    // -------------------------------------------------------------------------
    // 5. GALLERIES & PHOTOS
    // -------------------------------------------------------------------------
    console.log('Seeding Galleries & Photos...');
    for (const gal of Object.values(GALLERY_ALBUMS_DATA)) {
      const targetChapterId = gal.unit.includes('EDS') ? 'eds' : gal.unit.includes('WIE') ? 'wie' : 'sb';
      await prisma.gallery.upsert({
        where: { id: gal.id },
        update: {
          title: gal.title,
          slug: gal.slug,
          date: gal.date,
          category: gal.unit,
          coverImage: gal.coverUrl || (gal.photos && gal.photos.length > 0 ? gal.photos[0].url : ''),
          imageCount: gal.photos?.length || gal.photoCount,
          description: gal.description,
          chapterId: targetChapterId,
        },
        create: {
          id: gal.id,
          title: gal.title,
          slug: gal.slug,
          date: gal.date,
          category: gal.unit,
          coverImage: gal.coverUrl || (gal.photos && gal.photos.length > 0 ? gal.photos[0].url : ''),
          imageCount: gal.photos?.length || gal.photoCount,
          description: gal.description,
          chapterId: targetChapterId,
        },
      });

      for (const photo of gal.photos) {
        await prisma.galleryPhoto.upsert({
          where: { id: photo.id },
          update: {
            galleryId: gal.id,
            caption: photo.caption,
            url: photo.url || null,
          },
          create: {
            id: photo.id,
            galleryId: gal.id,
            caption: photo.caption,
            url: photo.url || null,
          },
        });
      }
    }

    // -------------------------------------------------------------------------
    // 6. STORIES & TECHNICAL PUBLICATIONS
    // -------------------------------------------------------------------------
    console.log('Seeding Stories & Publications...');
    const storyAuthorMap = {
      'applied-neural-networks-workshop-series': 'p-eds3',
      'empowering-women-in-engineering-roadmap': 'p-wie1',
      'demystifying-riscv-pipelined-soft-core': 'p-eds1',
      'nextjs-edge-architecture-student-branch': 'p-sec4',
    };

    for (const story of Object.values(STORIES_DATA)) {
      const authorPersonId = storyAuthorMap[story.slug] || null;
      const targetChapterId = story.unit.includes('EDS') ? 'eds' : story.unit.includes('WIE') ? 'wie' : 'sb';

      await prisma.story.upsert({
        where: { id: story.id },
        update: {
          title: story.title,
          slug: story.slug,
          date: story.publishedDate,
          author: story.author,
          authorId: authorPersonId,
          category: story.type,
          publicationType: story.type,
          excerpt: story.excerpt,
          contentHtml: story.content.map((p: string) => `<p>${p}</p>`).join(''),
          imageUrl: story.imageUrl || null,
          pdfUrl: `/resources/publication-${story.slug}.pdf`,
          externalLink: 'https://github.com/IEEE-MAIT',
          chapterId: targetChapterId,
          workflowStatus: 'Published',
        },
        create: {
          id: story.id,
          title: story.title,
          slug: story.slug,
          date: story.publishedDate,
          author: story.author,
          authorId: authorPersonId,
          category: story.type,
          publicationType: story.type,
          excerpt: story.excerpt,
          contentHtml: story.content.map((p: string) => `<p>${p}</p>`).join(''),
          imageUrl: story.imageUrl || null,
          pdfUrl: `/resources/publication-${story.slug}.pdf`,
          externalLink: 'https://github.com/IEEE-MAIT',
          chapterId: targetChapterId,
          workflowStatus: 'Published',
        },
      });
    }

    // -------------------------------------------------------------------------
    // 7. EVENTS & EVENT RESOURCES
    // -------------------------------------------------------------------------
    console.log('Seeding Events & Event Resources...');
    const eventRelationsMap = {
      'ev-1': { chapterId: 'sb', eventType: 'Branch Event', isLive: false, vtools: 'https://events.vtools.ieee.org/m/401920', sigId: null },
      'ev-2': { chapterId: 'sb', eventType: 'Hackathon', isLive: false, vtools: 'https://events.vtools.ieee.org/m/402110', sigId: 'sig-dev' },
      'ev-3': { chapterId: 'wie', eventType: 'Seminar', isLive: false, vtools: 'https://events.vtools.ieee.org/m/399812', storyId: 's2', sigId: null },
      'ev-4': { chapterId: 'eds', eventType: 'Workshop', isLive: false, vtools: 'https://events.vtools.ieee.org/m/403450', sigId: 'sig-hardware' },
      'ev-5': { chapterId: 'sb', eventType: 'Flagship', isLive: false, galleryId: 'g1', vtools: 'https://events.vtools.ieee.org/m/389102', sigId: null },
      'ev-6': { chapterId: 'eds', eventType: 'Workshop', isLive: false, galleryId: 'g2', storyId: 's1', vtools: 'https://events.vtools.ieee.org/m/388204', sigId: 'sig-hardware' },
      'ev-7': { chapterId: 'sb', eventType: 'Competition', isLive: false, vtools: 'https://events.vtools.ieee.org/m/387410', sigId: 'sig-dsa' },
      'ev-8': { chapterId: 'eds', eventType: 'Seminar', isLive: false, vtools: 'https://events.vtools.ieee.org/m/386901', sigId: 'sig-ai-ml' },
    };

    for (const event of EVENTS_DATA) {
      const rel = eventRelationsMap[event.id] || {};
      const eRecord = await prisma.event.upsert({
        where: { id: event.id },
        update: {
          title: event.title,
          slug: event.slug,
          date: event.date,
          time: event.time || '10:00 AM – 1:00 PM',
          venue: event.venue,
          unit: event.unit,
          unitSlug: event.unitSlug,
          category: event.category,
          eventType: rel.eventType || event.category,
          status: event.status,
          isLive: Boolean(rel.isLive),
          description: event.description || '',
          imageSrc: event.imageSrc || null,
          images: event.imageSrc ? [event.imageSrc] : [],
          registrationLink: event.registrationLink || null,
          vtoolsLink: rel.vtools || 'https://events.vtools.ieee.org',
          liveLink: event.status === 'Upcoming' ? 'https://meet.google.com/xyz-ieee-live' : null,
          virtualLink: event.status === 'Upcoming' ? 'https://youtube.com/live/ieeemait' : null,
          galleryId: rel.galleryId || null,
          storyId: rel.storyId || null,
          chapterId: rel.chapterId || event.unitSlug,
          academicYearId: currentYear.id,
          sigId: rel.sigId || null,
          workflowStatus: 'Published',
        },
        create: {
          id: event.id,
          title: event.title,
          slug: event.slug,
          date: event.date,
          time: event.time || '10:00 AM – 1:00 PM',
          venue: event.venue,
          unit: event.unit,
          unitSlug: event.unitSlug,
          category: event.category,
          eventType: rel.eventType || event.category,
          status: event.status,
          isLive: Boolean(rel.isLive),
          description: event.description || '',
          imageSrc: event.imageSrc || null,
          images: event.imageSrc ? [event.imageSrc] : [],
          registrationLink: event.registrationLink || null,
          vtoolsLink: rel.vtools || 'https://events.vtools.ieee.org',
          liveLink: event.status === 'Upcoming' ? 'https://meet.google.com/xyz-ieee-live' : null,
          virtualLink: event.status === 'Upcoming' ? 'https://youtube.com/live/ieeemait' : null,
          galleryId: rel.galleryId || null,
          storyId: rel.storyId || null,
          chapterId: rel.chapterId || event.unitSlug,
          academicYearId: currentYear.id,
          sigId: rel.sigId || null,
          workflowStatus: 'Published',
        },
      });

      // Event Resources
      const resTypes = [
        { type: 'PPT', title: 'Official Slide Deck & Workshop Notes', url: 'https://docs.google.com/presentation/d/sample' },
        { type: 'Report', title: 'Executive Post-Event Summary & Attendance Dossier', url: `/resources/report-${event.slug}.pdf` },
        { type: 'Link', title: 'GitHub Code Examples & Demonstration Repos', url: 'https://github.com/IEEE-MAIT' },
      ];

      for (let i = 0; i < resTypes.length; i++) {
        const rt = resTypes[i];
        await prisma.eventResource.upsert({
          where: { id: `ev-res-${event.id}-${i}` },
          update: { title: rt.title, type: rt.type, url: rt.url, isPublic: true },
          create: {
            id: `ev-res-${event.id}-${i}`,
            eventId: eRecord.id,
            type: rt.type,
            title: rt.title,
            url: rt.url,
            isPublic: true,
          },
        });
      }
    }

    // -------------------------------------------------------------------------
    // 8. ACHIEVEMENTS, TAGS & RECIPIENTS
    // -------------------------------------------------------------------------
    console.log('Seeding Achievements, Tags & People...');
    const achievementMeta = {
      'a1': { chapterId: 'sb', eventId: 'ev-5', tags: ['Exemplary', 'Section Recognition', 'Institutional Impact'], personId: 'p-sec1' },
      'a2': { chapterId: 'eds', eventId: 'ev-6', tags: ['Robotics', '1st Place', 'Hardware Hackathon'], personId: 'p-eds1' },
      'a3': { chapterId: 'sb', eventId: null, tags: ['Leadership', 'Chair Recognition', 'Region 10'], personId: 'p-sec1' },
      'a4': { chapterId: 'wie', eventId: 'ev-3', tags: ['Diversity & Inclusion', 'Workshop Impact', 'SAC Award'], personId: 'p-wie1' },
      'a5': { chapterId: 'sb', eventId: null, tags: ['Global Finalist', 'Research Paper', 'Edge AI'], personId: 'p-eds2' },
      'a6': { chapterId: 'wie', eventId: null, tags: ['Affinity Group of the Year', 'WIE Outstanding AG'], personId: 'p-wie1' },
      'a7': { chapterId: 'sb', eventId: null, tags: ['Counselor Honors', '20+ Years', 'Faculty Leadership'], personId: 'p-1' },
      'a8': { chapterId: 'sb', eventId: 'ev-5', tags: ['Global Winner', 'Media & Photography', 'IEEE Day'], personId: 'p-sec4' },
    };

    for (const ach of ACHIEVEMENTS_DATA) {
      const meta = achievementMeta[ach.id] || {};
      const aRecord = await prisma.achievement.upsert({
        where: { id: ach.id },
        update: {
          year: ach.year,
          title: ach.title,
          conferredBy: ach.conferredBy,
          unitOrTeam: ach.unitOrTeam,
          category: ach.category,
          achievementType: 'Branch',
          description: ach.description || '',
          imageSrc: 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=1200&auto=format&fit=crop&q=80',
          images: [
            'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=1200&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1200&auto=format&fit=crop&q=80',
          ],
          chapterId: meta.chapterId || 'sb',
          eventId: meta.eventId || null,
          academicYearId: currentYear.id,
        },
        create: {
          id: ach.id,
          year: ach.year,
          title: ach.title,
          conferredBy: ach.conferredBy,
          unitOrTeam: ach.unitOrTeam,
          category: ach.category,
          achievementType: 'Branch',
          description: ach.description || '',
          imageSrc: 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=1200&auto=format&fit=crop&q=80',
          images: [
            'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=1200&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1200&auto=format&fit=crop&q=80',
          ],
          chapterId: meta.chapterId || 'sb',
          eventId: meta.eventId || null,
          academicYearId: currentYear.id,
        },
      });

      // Tags
      if (meta.tags && meta.tags.length > 0) {
        for (const tagText of meta.tags) {
          await prisma.achievementTag.upsert({
            where: { achievementId_tag: { achievementId: aRecord.id, tag: tagText } },
            update: {},
            create: {
              id: `tag-${aRecord.id}-${tagText.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
              achievementId: aRecord.id,
              tag: tagText,
            },
          });
        }
      }

      // Person attribution
      if (meta.personId) {
        await prisma.achievementPerson.upsert({
          where: { achievementId_personId: { achievementId: aRecord.id, personId: meta.personId } },
          update: {},
          create: {
            achievementId: aRecord.id,
            personId: meta.personId,
          },
        });
      }
    }

    // -------------------------------------------------------------------------
    // 9. TECHNICAL PROJECTS
    // -------------------------------------------------------------------------
    console.log('Seeding Technical Projects...');
    const projectSigMap = {
      'proj-1': 'sig-hardware',
      'proj-2': 'sig-ai-ml',
      'proj-3': 'sig-hardware',
      'proj-4': 'sig-dev',
      'proj-5': 'sig-ai-ml',
      'proj-6': 'sig-hardware',
      'proj-7': 'sig-hardware',
      'proj-8': 'sig-dev',
    };

    for (const proj of PROJECTS_DATA) {
      await prisma.project.upsert({
        where: { id: proj.id },
        update: {
          title: proj.title,
          slug: proj.slug,
          summary: proj.summary,
          description: proj.description || null,
          githubUrl: proj.githubUrl || 'https://github.com/IEEE-MAIT',
          demoUrl: proj.demoUrl || 'https://ieeemait.com',
          coverImage: proj.coverImage || null,
          year: proj.year,
          tags: Array.isArray(proj.tags) ? proj.tags : [],
          chapterId: proj.chapterId || 'sb',
          sigId: projectSigMap[proj.id] || null,
          status: proj.year === '2026' ? 'Ongoing' : 'Completed',
          featured: proj.featured || false,
          workflowStatus: 'Published',
        },
        create: {
          id: proj.id,
          title: proj.title,
          slug: proj.slug,
          summary: proj.summary,
          description: proj.description || null,
          githubUrl: proj.githubUrl || 'https://github.com/IEEE-MAIT',
          demoUrl: proj.demoUrl || 'https://ieeemait.com',
          coverImage: proj.coverImage || null,
          year: proj.year,
          tags: Array.isArray(proj.tags) ? proj.tags : [],
          chapterId: proj.chapterId || 'sb',
          sigId: projectSigMap[proj.id] || null,
          status: proj.year === '2026' ? 'Ongoing' : 'Completed',
          featured: proj.featured || false,
          workflowStatus: 'Published',
        },
      });
    }

    // -------------------------------------------------------------------------
    // 10. STRATEGIC INITIATIVES
    // -------------------------------------------------------------------------
    console.log('Seeding Strategic Initiatives...');
    for (const init of INITIATIVES_DATA) {
      await prisma.initiative.upsert({
        where: { id: init.id },
        update: {
          title: init.title,
          slug: init.slug,
          description: init.description,
          status: init.status,
          chapterId: init.chapterId || 'sb',
          iconName: init.iconName || 'Zap',
          targetAudience: init.targetAudience || 'All Undergraduate Students',
          featured: init.featured || false,
        },
        create: {
          id: init.id,
          title: init.title,
          slug: init.slug,
          description: init.description,
          status: init.status,
          chapterId: init.chapterId || 'sb',
          iconName: init.iconName || 'Zap',
          targetAudience: init.targetAudience || 'All Undergraduate Students',
          featured: init.featured || false,
        },
      });
    }

    // -------------------------------------------------------------------------
    // 11. OPPORTUNITIES & FELLOWSHIPS
    // -------------------------------------------------------------------------
    console.log('Seeding Opportunities & Fellowships...');
    for (const opp of OPPORTUNITIES_DATA) {
      await prisma.opportunity.upsert({
        where: { id: opp.id },
        update: {
          title: opp.title,
          slug: opp.slug,
          description: opp.description,
          organisation: opp.organisation,
          category: opp.category,
          eligibility: opp.eligibility,
          deadline: opp.deadline,
          deadlineDate: opp.deadlineDate ? new Date(opp.deadlineDate) : null,
          link: opp.link,
          status: opp.status,
          featured: opp.featured,
        },
        create: {
          id: opp.id,
          title: opp.title,
          slug: opp.slug,
          description: opp.description,
          organisation: opp.organisation,
          category: opp.category,
          eligibility: opp.eligibility,
          deadline: opp.deadline,
          deadlineDate: opp.deadlineDate ? new Date(opp.deadlineDate) : null,
          link: opp.link,
          status: opp.status,
          featured: opp.featured,
        },
      });
    }

    // -------------------------------------------------------------------------
    // 12. INSTITUTIONAL MILESTONES
    // -------------------------------------------------------------------------
    console.log('Seeding Milestones...');
    for (let i = 0; i < MILESTONES_DATA.length; i++) {
      const m = MILESTONES_DATA[i];
      await prisma.milestone.upsert({
        where: { id: `m-${m.year}-${i}` },
        update: {
          year: String(m.year),
          title: m.title,
          description: m.description,
          category: i === 0 ? 'Establishment' : i < 3 ? 'Award / Recognition' : 'Chapter Charter',
          sortOrder: i,
        },
        create: {
          id: `m-${m.year}-${i}`,
          year: String(m.year),
          title: m.title,
          description: m.description,
          category: i === 0 ? 'Establishment' : i < 3 ? 'Award / Recognition' : 'Chapter Charter',
          sortOrder: i,
        },
      });
    }

    // -------------------------------------------------------------------------
    // 13. RESOURCES & DIGITAL LIBRARY
    // -------------------------------------------------------------------------
    console.log('Seeding Resources & Documents...');
    const SEED_RESOURCES = [
      {
        id: 'res-1',
        title: 'IEEE MAIT Newsletter — Volume 3, Issue 2',
        type: 'Newsletter',
        publishedDate: 'JUL 2026',
        description: 'Bi-annual branch newsletter covering student technical competitions, member spotlights, and project chronicles.',
        fileUrl: '/resources/newsletter-vol3-issue2.pdf',
        status: 'published',
      },
      {
        id: 'res-2',
        title: 'IEEE MAIT Newsletter — Volume 3, Issue 1',
        type: 'Newsletter',
        publishedDate: 'JAN 2026',
        description: 'First issue of 2026 covering new academic session roadmap, KiCad bootcamp highlights, and WIE symposium.',
        fileUrl: '/resources/newsletter-vol3-issue1.pdf',
        status: 'published',
      },
      {
        id: 'res-3',
        title: 'Annual Activity & Transition Report 2025–26',
        type: 'AnnualReport',
        publishedDate: 'MAY 2026',
        description: 'Full institutional report: 18 events, 150+ enrolled members, financial audit summary, and Delhi Section achievements.',
        fileUrl: '/resources/annual-report-2025-26.pdf',
        status: 'published',
      },
      {
        id: 'res-4',
        title: 'Annual Activity & Transition Report 2024–25',
        type: 'AnnualReport',
        publishedDate: 'MAY 2025',
        description: 'Institutional summary covering the 2024–25 academic year, student paper publications, and branch officer transitions.',
        fileUrl: '/resources/annual-report-2024-25.pdf',
        status: 'published',
      },
      {
        id: 'res-5',
        title: 'IEEE Student Membership & Onboarding Guide',
        type: 'Document',
        publishedDate: 'AUG 2025',
        description: 'Step-by-step walkthrough for joining IEEE.org, activating 50% student discounts, and registering with MAIT Student Branch.',
        fileUrl: '/resources/membership-guide-2025.pdf',
        status: 'published',
      },
      {
        id: 'res-6',
        title: 'IEEE MAIT Branch Operational Constitution',
        type: 'Document',
        publishedDate: 'JAN 2024',
        description: 'Governing document for IEEE MAIT Student Branch bylaws, executive committee responsibilities, and electoral protocols.',
        fileUrl: '/resources/branch-constitution.pdf',
        status: 'published',
      },
    ];

    for (const r of SEED_RESOURCES) {
      await prisma.resource.upsert({
        where: { id: r.id },
        update: {
          title: r.title,
          type: r.type,
          publishedDate: r.publishedDate,
          description: r.description,
          fileUrl: r.fileUrl,
          status: r.status,
        },
        create: {
          id: r.id,
          title: r.title,
          type: r.type,
          publishedDate: r.publishedDate,
          description: r.description,
          fileUrl: r.fileUrl,
          status: r.status,
        },
      });
    }

    // -------------------------------------------------------------------------
    // 14. PROMOTIONAL BANNERS
    // -------------------------------------------------------------------------
    console.log('Seeding Promotional Banners...');
    const bannersData = [
      {
        id: 'banner-hackmait',
        title: 'HackMAIT 2026 Registration Open',
        subtitle: 'Join India’s top student hardware & AI hackathon with INR 1.5 Lakh prize pool.',
        imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600&auto=format&fit=crop&q=80',
        linkHref: '/events/hackmait-2026-national-hackathon',
        linkText: 'Apply on Devpost →',
        isActive: true,
        sortOrder: 1,
      },
      {
        id: 'banner-wie-summit',
        title: 'EmpowerHer: WIE Leadership Conclave',
        subtitle: 'Connecting women engineers with global research fellowships and industry leaders.',
        imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1600&auto=format&fit=crop&q=80',
        linkHref: '/events/wie-women-in-tech-leadership-panel',
        linkText: 'Reserve Free Seat →',
        isActive: true,
        sortOrder: 2,
      },
    ];

    for (const b of bannersData) {
      await prisma.banner.upsert({
        where: { id: b.id },
        update: b,
        create: b,
      });
    }

    // -------------------------------------------------------------------------
    // 15. SOCIAL LINKS
    // -------------------------------------------------------------------------
    console.log('Seeding Social Links...');
    const socialLinksData = [
      { id: 'soc-sb-li', entity: 'Branch', platform: 'LinkedIn', url: 'https://linkedin.com/company/ieee-mait', handle: 'ieee-mait', isActive: true, sortOrder: 1 },
      { id: 'soc-sb-ig', entity: 'Branch', platform: 'Instagram', url: 'https://instagram.com/ieeemait', handle: '@ieeemait', isActive: true, sortOrder: 2 },
      { id: 'soc-sb-gh', entity: 'Branch', platform: 'GitHub', url: 'https://github.com/IEEE-MAIT', handle: 'IEEE-MAIT', isActive: true, sortOrder: 3 },
      { id: 'soc-sb-em', entity: 'Branch', platform: 'Email', url: 'mailto:mait.ieee.sb@gmail.com', handle: 'mait.ieee.sb@gmail.com', isActive: true, sortOrder: 4 },
      { id: 'soc-eds-ig', entity: 'EDS Chapter', platform: 'Instagram', url: 'https://instagram.com/eds_mait', handle: '@eds_mait', isActive: true, sortOrder: 5 },
      { id: 'soc-wie-ig', entity: 'WIE AG', platform: 'Instagram', url: 'https://instagram.com/wie_mait', handle: '@wie_mait', isActive: true, sortOrder: 6 },
    ];

    for (const s of socialLinksData) {
      await prisma.socialLink.upsert({
        where: { id: s.id },
        update: s,
        create: s,
      });
    }

    // -------------------------------------------------------------------------
    // 16. CONTACT FORM INQUIRIES
    // -------------------------------------------------------------------------
    console.log('Seeding Sample Inquiries...');
    const inquiriesData = [
      { id: 'inq-1', name: 'Kabir Verma', email: 'kabir.v@gmail.com', subject: 'Inquiry regarding KiCad PCB Workshop Registration', message: 'Hello, I am a 2nd year ECE student interested in joining the upcoming hardware tapeout track. Is prior soldering experience required?', status: 'Replied', createdAt: '2026-08-20T10:15:00Z' },
      { id: 'inq-2', name: 'Pooja Narang', email: 'pooja.narang@outlook.com', subject: 'WIE Travel Grant Application Support', message: 'I recently had an IEEE conference paper accepted for R10 TENCON. Does IEEE MAIT WIE offer proposal review assistance?', status: 'Replied', createdAt: '2026-08-22T14:30:00Z' },
      { id: 'inq-3', name: 'Tanmay Saxena', email: 'tanmay.s@mait.ac.in', subject: 'Core Webmaster & Developer Call', message: 'Submitted my application for full-stack edge developer position. Look forward to collaborating on the open-source platform.', status: 'Unread', createdAt: '2026-08-25T09:00:00Z' },
    ];

    for (const inq of inquiriesData) {
      await prisma.inquiry.upsert({
        where: { id: inq.id },
        update: inq,
        create: inq,
      });
    }

    // -------------------------------------------------------------------------
    // 17. AUDIT LOGS
    // -------------------------------------------------------------------------
    console.log('Seeding Audit Logs...');
    const auditLogsData = [
      { id: 'log-1', timestamp: '2026-08-27 22:30:00', performedBy: 'Super Admin', userEmail: 'superadmin@ieee-mait.org', actionType: 'PUBLISH', entityType: 'EVENT', entityId: 'ev-2', entityTitle: 'HackMAIT 2026: 36-Hour National Hackathon', changeSummary: 'Published flagship national hackathon announcement.' },
      { id: 'log-2', timestamp: '2026-08-27 21:15:00', performedBy: 'Content Editor', userEmail: 'editor@ieee-mait.org', actionType: 'UPDATE', entityType: 'PUBLICATION', entityId: 's3', entityTitle: 'Demystifying RISC-V in Verilog', changeSummary: 'Updated Vivado simulation testbench citations.' },
      { id: 'log-3', timestamp: '2026-08-26 18:45:00', performedBy: 'Super Admin', userEmail: 'superadmin@ieee-mait.org', actionType: 'CREATE', entityType: 'PROJECT', entityId: 'proj-8', entityTitle: 'ZeroTrust Guard Network Gateway', changeSummary: 'Created new cybersecurity soft-gateway project profile.' },
    ];

    for (const log of auditLogsData) {
      await prisma.auditLog.upsert({
        where: { id: log.id },
        update: log,
        create: log,
      });
    }

    // -------------------------------------------------------------------------
    // 18. CONTENT WORKFLOWS
    // -------------------------------------------------------------------------
    console.log('Seeding Content Workflows...');
    const workflowsData = [
      { id: 'wf-1', entityType: 'Event', entityId: 'ev-2', status: 'Approved', updatedBy: 'Super Admin', comments: 'Reviewed schedule, jury panel, and prize pool budget.' },
      { id: 'wf-2', entityType: 'Publication', entityId: 's3', status: 'Approved', updatedBy: 'Editor', comments: 'Peer-reviewed technical Verilog code snippets and diagrams.' },
      { id: 'wf-3', entityType: 'Opportunity', entityId: 'opp-1', status: 'Approved', updatedBy: 'Super Admin', comments: 'Verified global IEEE Computer Society deadline dates.' },
    ];

    for (const wf of workflowsData) {
      await prisma.contentWorkflow.upsert({
        where: { id: wf.id },
        update: wf,
        create: wf,
      });
    }

    // -------------------------------------------------------------------------
    // 19. HISTORICAL ACADEMIC YEARS & PAST EXECOMS
    // -------------------------------------------------------------------------
    console.log('Seeding Historical Past ExeComs (2024–25, 2023–24, 2022–23)...');
    const pastYearsData = [
      {
        label: '2024-25',
        isCurrent: false,
        startDate: '2024-08-01',
        endDate: '2025-07-31',
        officers: [
          { name: 'Dr. Sunil Kumar', role: 'Branch Counselor', category: 'Counsellor', dept: 'ECE', bio: 'Professor & Dean, ECE Department', hierarchy: 1 },
          { name: 'Tarun Singhal', role: 'Student Chair', category: 'Senior Executive Committee', dept: 'CSE', hierarchy: 2 },
          { name: 'Megha Goel', role: 'Student Vice-Chair', category: 'Senior Executive Committee', dept: 'IT', hierarchy: 3 },
          { name: 'Ayush Aggarwal', role: 'General Secretary', category: 'Senior Executive Committee', dept: 'ECE', hierarchy: 4 },
          { name: 'Pooja Kashyap', role: 'Treasurer', category: 'Senior Executive Committee', dept: 'CSE', hierarchy: 5 },
          { name: 'Vikram Sethi', role: 'Lead Webmaster', category: 'Senior Executive Committee', dept: 'IT', hierarchy: 6 },
          { name: 'Kavita Joshi', role: 'WIE Affinity Group Chair', category: 'Chapter Lead', dept: 'ECE', hierarchy: 20 },
          { name: 'Aditya Mathur', role: 'EDS Chapter Chair', category: 'Chapter Lead', dept: 'EEE', hierarchy: 21 },
        ],
      },
      {
        label: '2023-24',
        isCurrent: false,
        startDate: '2023-08-01',
        endDate: '2024-07-31',
        officers: [
          { name: 'Dr. Sunil Kumar', role: 'Branch Counselor', category: 'Counsellor', dept: 'ECE', bio: 'Professor & Dean, ECE Department', hierarchy: 1 },
          { name: 'Rishit Rastogi', role: 'Student Chair', category: 'Senior Executive Committee', dept: 'CSE', hierarchy: 2 },
          { name: 'Anushka Sen', role: 'Student Vice-Chair', category: 'Senior Executive Committee', dept: 'ECE', hierarchy: 3 },
          { name: 'Karan Mehra', role: 'General Secretary', category: 'Senior Executive Committee', dept: 'IT', hierarchy: 4 },
          { name: 'Tanvi Saxena', role: 'Treasurer', category: 'Senior Executive Committee', dept: 'CSE', hierarchy: 5 },
          { name: 'Gaurav Bhatia', role: 'Webmaster', category: 'Senior Executive Committee', dept: 'IT', hierarchy: 6 },
        ],
      },
      {
        label: '2022-23',
        isCurrent: false,
        startDate: '2022-08-01',
        endDate: '2023-07-31',
        officers: [
          { name: 'Dr. Sunil Kumar', role: 'Branch Counselor', category: 'Counsellor', dept: 'ECE', bio: 'Professor & Dean, ECE Department', hierarchy: 1 },
          { name: 'Pranav Tandon', role: 'Student Chair', category: 'Senior Executive Committee', dept: 'ECE', hierarchy: 2 },
          { name: 'Divya Rawat', role: 'Student Vice-Chair', category: 'Senior Executive Committee', dept: 'CSE', hierarchy: 3 },
          { name: 'Shubham Mittal', role: 'General Secretary', category: 'Senior Executive Committee', dept: 'IT', hierarchy: 4 },
          { name: 'Nupur Agrawal', role: 'Treasurer', category: 'Senior Executive Committee', dept: 'ECE', hierarchy: 5 },
        ],
      },
    ];

    for (const yr of pastYearsData) {
      const yrRecord = await prisma.academicYear.upsert({
        where: { label: yr.label },
        update: { isCurrent: yr.isCurrent },
        create: { label: yr.label, isCurrent: yr.isCurrent, startDate: yr.startDate, endDate: yr.endDate },
      });

      for (let i = 0; i < yr.officers.length; i++) {
        const off = yr.officers[i];
        const personId = `p-${yr.label}-${i}`;
        const pRec = await prisma.person.upsert({
          where: { id: personId },
          update: {
            name: off.name,
            role: off.role,
            category: off.category,
            department: off.dept,
            academicYear: yr.label,
            hierarchy: off.hierarchy,
            bio: off.bio || `Executive officer serving during academic term ${yr.label}.`,
            imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
          },
          create: {
            id: personId,
            name: off.name,
            role: off.role,
            category: off.category,
            department: off.dept,
            academicYear: yr.label,
            hierarchy: off.hierarchy,
            bio: off.bio || `Executive officer serving during academic term ${yr.label}.`,
            imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
          },
        });

        const roleId = `role-${off.role.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
        const roleRec = await prisma.role.upsert({
          where: { id: roleId },
          update: { title: off.role, category: off.category },
          create: { id: roleId, title: off.role, category: off.category, hierarchy: off.hierarchy },
        });

        await prisma.organizationMembership.upsert({
          where: { id: `mem-${personId}` },
          update: { isCurrent: false, sortOrder: off.hierarchy },
          create: {
            id: `mem-${personId}`,
            personId: pRec.id,
            roleId: roleRec.id,
            academicYearId: yrRecord.id,
            chapterId: 'sb',
            isCurrent: false,
            sortOrder: off.hierarchy,
          },
        });
      }
    }

    // -------------------------------------------------------------------------
    // 20. RBAC ROLES, ADMIN USERS & OFFICERS
    // -------------------------------------------------------------------------
    console.log('Seeding Admin Roles, Admin Users & Officers...');
    const adminRolesList = [
      { id: 'role-super-admin', name: 'Super Admin', description: 'Full unrestricted root access to all digital platform modules and RBAC settings.', isSystem: true },
      { id: 'role-admin', name: 'Admin', description: 'Administrative access to create, edit, approve, and publish branch content.', isSystem: true },
      { id: 'role-event-mgr', name: 'Event Manager', description: 'Dedicated access to create and manage events, registrations, and resources.', isSystem: false },
      { id: 'role-content-editor', name: 'Content Editor', description: 'Editorial access to draft and publish technical stories, newsletters, and gallery albums.', isSystem: false },
    ];

    for (const r of adminRolesList) {
      await prisma.adminRole.upsert({
        where: { name: r.name },
        update: { description: r.description, isSystem: r.isSystem, permissions: JSON.stringify(ROLE_DEFAULT_PERMISSIONS[r.name] || ROLE_DEFAULT_PERMISSIONS['Super Admin'] || {}) },
        create: {
          id: r.id,
          name: r.name,
          description: r.description,
          isSystem: r.isSystem,
          permissions: JSON.stringify(ROLE_DEFAULT_PERMISSIONS[r.name] || ROLE_DEFAULT_PERMISSIONS['Super Admin'] || {}),
        },
      });
    }

    const superAdminRole = await prisma.adminRole.findUnique({ where: { name: 'Super Admin' } });
    const adminUser = SUPER_ADMIN_FALLBACK;

    await prisma.officer.upsert({
      where: { email: adminUser.email.toLowerCase() },
      update: {
        name: adminUser.name,
        password: adminUser.password,
        role: adminUser.role,
        category: adminUser.category,
      },
      create: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email.toLowerCase(),
        password: adminUser.password,
        role: adminUser.role,
        category: adminUser.category,
        createdAt: adminUser.createdAt,
        createdBy: adminUser.createdBy,
      },
    });

    await prisma.adminUser.upsert({
      where: { email: adminUser.email.toLowerCase() },
      update: {
        name: adminUser.name,
        password: adminUser.password,
        roleId: superAdminRole.id,
        isActive: true,
      },
      create: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email.toLowerCase(),
        password: adminUser.password,
        roleId: superAdminRole.id,
        isActive: true,
      },
    });

    // -------------------------------------------------------------------------
    // 21. SITE SETTINGS
    // -------------------------------------------------------------------------
    console.log('Seeding Site Settings...');
    await prisma.siteSetting.upsert({
      where: { id: 'global' },
      update: {
        announcementMessage: 'Membership Drive 2025–26 & HackMAIT 2026 are officially open! Join 150+ student engineers advancing technology at MAIT.',
        announcementLinkText: 'Explore Events & Register →',
        announcementLinkHref: '/events',
        announcementActive: true,
        donateUrl: 'https://www.ieee.org/about/donate/index.html',
        recycleBinRetentionDays: 30,
      },
      create: {
        id: 'global',
        announcementMessage: 'Membership Drive 2025–26 & HackMAIT 2026 are officially open! Join 150+ student engineers advancing technology at MAIT.',
        announcementLinkText: 'Explore Events & Register →',
        announcementLinkHref: '/events',
        announcementActive: true,
        donateUrl: 'https://www.ieee.org/about/donate/index.html',
        recycleBinRetentionDays: 30,
      },
    });

    console.log('✅ Database successfully synchronized and seeded with 100% comprehensive datasets across all 20+ models!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
