import { NextResponse } from 'next/server';
import { guardApiRoute } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/auditLog';
import { sanitizePlainText, validateSafeUrl } from '@/lib/security';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const includeDeleted = searchParams.get('includeDeleted') === 'true';

    const list = await prisma.event.findMany({
      where: includeDeleted ? undefined : { deletedAt: null },
      orderBy: { date: 'desc' },
      include: {
        sig: true,
        chapter: true,
        resources: { where: { deletedAt: null } },
      },
    });
    return NextResponse.json(list);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authCheck = await guardApiRoute(req, 'Events', 'create');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }
    const user = authCheck.user;

    const body: any = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    if (!body.title || typeof body.title !== 'string' || !body.slug || typeof body.slug !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid title or slug' }, { status: 400 });
    }

    const sanitizedTitle = sanitizePlainText(body.title, 200);
    const sanitizedSlug = sanitizePlainText(body.slug, 100).toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const sanitizedDate = sanitizePlainText(body.date || '', 50);
    const sanitizedEndDate = body.endDate ? sanitizePlainText(body.endDate, 50) : null;
    const sanitizedTime = sanitizePlainText(body.time || '', 50);
    const sanitizedVenue = sanitizePlainText(body.venue || 'MAIT Campus', 100);
    const sanitizedDescription = sanitizePlainText(body.description || '', 5000);
    const sanitizedRegistrationLink = body.registrationLink ? validateSafeUrl(body.registrationLink) : null;
    const sanitizedVtoolsLink = body.vtoolsLink ? validateSafeUrl(body.vtoolsLink) : null;
    const sanitizedLiveLink = body.liveLink ? validateSafeUrl(body.liveLink) : null;
    const sanitizedVirtualLink = body.virtualLink ? validateSafeUrl(body.virtualLink) : null;
    const sanitizedImageSrc = body.imageSrc ? validateSafeUrl(body.imageSrc) : null;
    
    // Ensure images is an array of valid URLs, limited to 20
    let sanitizedImages: string[] = [];
    if (Array.isArray(body.images)) {
      sanitizedImages = body.images
        .map((url: any) => (typeof url === 'string' ? validateSafeUrl(url) : null))
        .filter(Boolean) as string[];
      if (sanitizedImages.length > 20) {
        sanitizedImages = sanitizedImages.slice(0, 20);
      }
    }

    const performedBy = user.name || user.email;

    const newEvent = await prisma.event.create({
      data: {
        title: sanitizedTitle,
        slug: sanitizedSlug,
        date: sanitizedDate,
        endDate: sanitizedEndDate,
        time: sanitizedTime,
        venue: sanitizedVenue,
        unit: sanitizePlainText(body.unit || 'IEEE MAIT SB', 50),
        unitSlug: sanitizePlainText(body.unitSlug || 'sb', 20),
        category: sanitizePlainText(body.category || 'Technical Workshop', 50),
        eventType: body.eventType ? sanitizePlainText(body.eventType, 50) : 'Technical',
        status: sanitizePlainText(body.status || 'upcoming', 20),
        isLive: Boolean(body.isLive),
        description: sanitizedDescription,
        registrationLink: sanitizedRegistrationLink,
        vtoolsLink: sanitizedVtoolsLink,
        liveLink: sanitizedLiveLink,
        virtualLink: sanitizedVirtualLink,
        imageSrc: sanitizedImageSrc,
        images: sanitizedImages,
        chapterId: body.chapterId || null,
        sigId: body.sigId || null,
      },
    });

    // Auto-Milestone creation for flagship events (P1)
    if (body.eventType === 'Flagship' && sanitizedDate) {
      const milestoneYear = sanitizedDate.slice(0, 4);
      await prisma.milestone.create({
        data: {
          year: milestoneYear || new Date().getFullYear().toString(),
          title: sanitizedTitle,
          description: sanitizedDescription.slice(0, 300),
          category: 'Flagship Event',
          sourceEventId: newEvent.id,
        },
      }).catch(() => {});
    }

    await recordAuditLog({
      performedBy,
      userEmail: user.email,
      actionType: 'CREATE',
      entityType: 'EVENT',
      entityId: newEvent.id,
      entityTitle: sanitizedTitle,
      changeSummary: `Created event "${sanitizedTitle}" scheduled for ${sanitizedDate} at ${sanitizedVenue}.`,
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const authCheck = await guardApiRoute(req, 'Events', 'edit');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }
    const user = authCheck.user;

    const body: any = await req.json();
    if (!body || typeof body !== 'object' || !body.id) {
      return NextResponse.json({ error: 'Invalid payload or missing ID' }, { status: 400 });
    }

    if (!body.title || typeof body.title !== 'string' || !body.slug || typeof body.slug !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid title or slug' }, { status: 400 });
    }

    const sanitizedTitle = sanitizePlainText(body.title, 200);
    const sanitizedSlug = sanitizePlainText(body.slug, 100).toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const sanitizedDate = sanitizePlainText(body.date || '', 50);
    const sanitizedEndDate = body.endDate ? sanitizePlainText(body.endDate, 50) : null;
    const sanitizedTime = sanitizePlainText(body.time || '', 50);
    const sanitizedVenue = sanitizePlainText(body.venue || 'MAIT Campus', 100);
    const sanitizedDescription = sanitizePlainText(body.description || '', 5000);
    const sanitizedRegistrationLink = body.registrationLink ? validateSafeUrl(body.registrationLink) : null;
    const sanitizedVtoolsLink = body.vtoolsLink ? validateSafeUrl(body.vtoolsLink) : null;
    const sanitizedLiveLink = body.liveLink ? validateSafeUrl(body.liveLink) : null;
    const sanitizedVirtualLink = body.virtualLink ? validateSafeUrl(body.virtualLink) : null;
    const sanitizedImageSrc = body.imageSrc ? validateSafeUrl(body.imageSrc) : null;
    
    let sanitizedImages: string[] = [];
    if (Array.isArray(body.images)) {
      sanitizedImages = body.images
        .map((url: any) => (typeof url === 'string' ? validateSafeUrl(url) : null))
        .filter(Boolean) as string[];
      if (sanitizedImages.length > 20) {
        sanitizedImages = sanitizedImages.slice(0, 20);
      }
    }

    const performedBy = user.name || user.email;

    const updatedEvent = await prisma.event.update({
      where: { id: body.id },
      data: {
        title: sanitizedTitle,
        slug: sanitizedSlug,
        date: sanitizedDate,
        endDate: sanitizedEndDate,
        time: sanitizedTime,
        venue: sanitizedVenue,
        unit: sanitizePlainText(body.unit || 'IEEE MAIT SB', 50),
        unitSlug: sanitizePlainText(body.unitSlug || 'sb', 20),
        category: sanitizePlainText(body.category || 'Technical Workshop', 50),
        eventType: body.eventType ? sanitizePlainText(body.eventType, 50) : 'Technical',
        status: sanitizePlainText(body.status || 'upcoming', 20),
        isLive: Boolean(body.isLive),
        description: sanitizedDescription,
        registrationLink: sanitizedRegistrationLink,
        vtoolsLink: sanitizedVtoolsLink,
        liveLink: sanitizedLiveLink,
        virtualLink: sanitizedVirtualLink,
        imageSrc: sanitizedImageSrc,
        images: sanitizedImages,
        chapterId: body.chapterId || null,
        sigId: body.sigId || null,
      },
    });

    // Keep linked milestone in sync if one exists
    await prisma.milestone.updateMany({
      where: { sourceEventId: body.id },
      data: {
        title: sanitizedTitle,
        description: sanitizedDescription.slice(0, 300),
        year: sanitizedDate ? sanitizedDate.slice(0, 4) : undefined,
      },
    }).catch(() => {});

    await recordAuditLog({
      performedBy,
      userEmail: user.email,
      actionType: 'UPDATE',
      entityType: 'EVENT',
      entityId: body.id,
      entityTitle: sanitizedTitle,
      changeSummary: `Updated event "${sanitizedTitle}" (ID: ${body.id}).`,
    });

    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const authCheck = await guardApiRoute(req, 'Events', 'delete');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }
    const user = authCheck.user;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const permanent = searchParams.get('permanent') === 'true';

    if (!id) {
      return NextResponse.json({ error: 'Event ID is required.' }, { status: 400 });
    }

    const existingEvent = await prisma.event.findUnique({ where: { id } });
    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
    }

    const performedBy = user.name || user.email;

    if (permanent) {
      // Hard delete (permanently removes)
      await prisma.event.delete({ where: { id } });

      await recordAuditLog({
        performedBy,
        userEmail: user.email,
        actionType: 'DELETE',
        entityType: 'EVENT',
        entityId: id,
        entityTitle: existingEvent.title,
        changeSummary: `Permanently deleted event: "${existingEvent.title}" (ID: ${id})`,
      });
    } else {
      // Soft delete (Recycle Bin)
      await prisma.event.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          deletedBy: performedBy,
        },
      });

      await recordAuditLog({
        performedBy,
        userEmail: user.email,
        actionType: 'DELETE',
        entityType: 'EVENT',
        entityId: id,
        entityTitle: existingEvent.title,
        changeSummary: `Moved event to Recycle Bin: "${existingEvent.title}" (ID: ${id})`,
      });
    }

    return NextResponse.json({ success: true, softDeleted: !permanent });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
