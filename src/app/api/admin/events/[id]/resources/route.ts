import { NextResponse } from 'next/server';
import { guardApiRoute } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/auditLog';
import { sanitizePlainText, validateSafeUrl } from '@/lib/security';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/events/[id]/resources
 * Retrieves all digital library resources attached to an event.
 */
export async function GET(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: 'Missing event ID' }, { status: 400 });
    }

    const resources = await prisma.eventResource.findMany({
      where: {
        eventId: id,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(resources);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/admin/events/[id]/resources
 * Attaches a new digital resource (PPT, Report, Certificate, Recording) to an event.
 */
export async function POST(req: Request, context: RouteContext) {
  try {
    const authCheck = await guardApiRoute(req, 'Events', 'edit');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }
    const user = authCheck.user;

    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: 'Missing event ID' }, { status: 400 });
    }

    // Verify parent event exists
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const body: any = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    if (!body.title || typeof body.title !== 'string' || !body.url || typeof body.url !== 'string') {
      return NextResponse.json({ error: 'Missing resource title or URL' }, { status: 400 });
    }

    const sanitizedTitle = sanitizePlainText(body.title, 200);
    const sanitizedType = sanitizePlainText(body.type || 'Document', 50);
    const validatedUrl = validateSafeUrl(body.url);
    const validatedFileUrl = body.fileUrl ? validateSafeUrl(body.fileUrl) : null;
    const isPublic = body.isPublic !== undefined ? Boolean(body.isPublic) : true;

    if (!validatedUrl) {
      return NextResponse.json({ error: 'Invalid resource URL format' }, { status: 400 });
    }

    const newResource = await prisma.eventResource.create({
      data: {
        eventId: id,
        title: sanitizedTitle,
        type: sanitizedType,
        url: validatedUrl,
        fileUrl: validatedFileUrl,
        isPublic,
      },
    });

    const performedBy = user.name || user.email;
    await recordAuditLog({
      performedBy,
      userEmail: user.email,
      actionType: 'CREATE',
      entityType: 'EVENT',
      entityId: id,
      entityTitle: event.title,
      changeSummary: `Attached resource "${sanitizedTitle}" (${sanitizedType}) to event "${event.title}".`,
    });

    return NextResponse.json(newResource, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/events/[id]/resources
 * Removes a digital resource from an event.
 */
export async function DELETE(req: Request, context: RouteContext) {
  try {
    const authCheck = await guardApiRoute(req, 'Events', 'delete');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }
    const user = authCheck.user;

    const { id } = await context.params;
    const { searchParams } = new URL(req.url);
    const resourceId = searchParams.get('resourceId');

    if (!resourceId) {
      return NextResponse.json({ error: 'Missing resourceId parameter' }, { status: 400 });
    }

    const existingResource = await prisma.eventResource.findUnique({
      where: { id: resourceId },
      include: { event: true },
    });

    if (!existingResource || existingResource.eventId !== id) {
      return NextResponse.json({ error: 'Resource not found for this event' }, { status: 404 });
    }

    await prisma.eventResource.delete({
      where: { id: resourceId },
    });

    const performedBy = user.name || user.email;
    await recordAuditLog({
      performedBy,
      userEmail: user.email,
      actionType: 'DELETE',
      entityType: 'EVENT',
      entityId: id,
      entityTitle: existingResource.event.title,
      changeSummary: `Removed resource "${existingResource.title}" from event "${existingResource.event.title}".`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
