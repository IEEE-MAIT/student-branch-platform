import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { hasPermission } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/auditLog';
import { sanitizeText } from '@/lib/security';

export async function GET() {
  try {
    const list = await prisma.chapter.findMany({ orderBy: { name: 'asc' } });
    return NextResponse.json(list);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    const payload = token ? verifyJWT(token) : null;

    if (!payload || !hasPermission(payload.role, 'Settings', 'create')) {
      return NextResponse.json({ error: 'Unauthorized. Insufficient permissions.' }, { status: 403 });
    }

    const body: any = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    if (!body.name || typeof body.name !== 'string' || !body.slug || typeof body.slug !== 'string' || !body.type || typeof body.type !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid name, slug, or type' }, { status: 400 });
    }

    const sanitizedName = sanitizeText(body.name, 100);
    const sanitizedSlug = sanitizeText(body.slug, 100).toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const sanitizedType = sanitizeText(body.type, 50);
    
    const newChapter = await prisma.chapter.create({
      data: {
        name: sanitizedName,
        slug: sanitizedSlug,
        type: sanitizedType,
        parentSociety: body.parentSociety ? sanitizeText(body.parentSociety, 100) : null,
        establishedYear: body.establishedYear ? sanitizeText(body.establishedYear, 10) : null,
        description: body.description ? sanitizeText(body.description, 2000) : null,
        mission: body.mission ? sanitizeText(body.mission, 2000) : null,
        tagline: body.tagline ? sanitizeText(body.tagline, 200) : null,
        logoUrl: body.logoUrl ? sanitizeText(body.logoUrl, 500) : null,
        coverImageUrl: body.coverImageUrl ? sanitizeText(body.coverImageUrl, 500) : null,
        accentColor: body.accentColor ? sanitizeText(body.accentColor, 30) : null,
        instagramUrl: body.instagramUrl ? sanitizeText(body.instagramUrl, 300) : null,
        linkedinUrl: body.linkedinUrl ? sanitizeText(body.linkedinUrl, 300) : null,
        githubUrl: body.githubUrl ? sanitizeText(body.githubUrl, 300) : null,
        leaderName: body.leaderName ? sanitizeText(body.leaderName, 100) : null,
        leaderRole: body.leaderRole ? sanitizeText(body.leaderRole, 100) : null,
        leaderId: body.leaderId ? sanitizeText(body.leaderId, 100) : null,
        memberCount: typeof body.memberCount === 'number' ? body.memberCount : parseInt(body.memberCount || '0', 10) || 0,
        eventCount: typeof body.eventCount === 'number' ? body.eventCount : parseInt(body.eventCount || '0', 10) || 0,
      }
    });

    await recordAuditLog({
      performedBy: payload.name || payload.email,
      actionType: 'CREATE',
      entityType: 'CHAPTER',
      entityTitle: sanitizedName,
      changeSummary: `Created organizational unit: ${sanitizedName} (${sanitizedType})`,
    });

    return NextResponse.json(newChapter, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    const payload = token ? verifyJWT(token) : null;

    if (!payload || !hasPermission(payload.role, 'Settings', 'edit')) {
      return NextResponse.json({ error: 'Unauthorized. Insufficient permissions.' }, { status: 403 });
    }

    const body: any = await req.json();
    if (!body || typeof body !== 'object' || !body.id) {
      return NextResponse.json({ error: 'Chapter ID and payload required' }, { status: 400 });
    }

    const updatedChapter = await prisma.chapter.update({
      where: { id: body.id },
      data: {
        ...(body.name && { name: sanitizeText(body.name, 100) }),
        ...(body.slug && { slug: sanitizeText(body.slug, 100).toLowerCase().replace(/[^a-z0-9-]/g, '-') }),
        ...(body.type && { type: sanitizeText(body.type, 50) }),
        parentSociety: body.parentSociety !== undefined ? (body.parentSociety ? sanitizeText(body.parentSociety, 100) : null) : undefined,
        establishedYear: body.establishedYear !== undefined ? (body.establishedYear ? sanitizeText(body.establishedYear, 10) : null) : undefined,
        description: body.description !== undefined ? (body.description ? sanitizeText(body.description, 2000) : null) : undefined,
        mission: body.mission !== undefined ? (body.mission ? sanitizeText(body.mission, 2000) : null) : undefined,
        tagline: body.tagline !== undefined ? (body.tagline ? sanitizeText(body.tagline, 200) : null) : undefined,
        logoUrl: body.logoUrl !== undefined ? (body.logoUrl ? sanitizeText(body.logoUrl, 500) : null) : undefined,
        coverImageUrl: body.coverImageUrl !== undefined ? (body.coverImageUrl ? sanitizeText(body.coverImageUrl, 500) : null) : undefined,
        accentColor: body.accentColor !== undefined ? (body.accentColor ? sanitizeText(body.accentColor, 30) : null) : undefined,
        instagramUrl: body.instagramUrl !== undefined ? (body.instagramUrl ? sanitizeText(body.instagramUrl, 300) : null) : undefined,
        linkedinUrl: body.linkedinUrl !== undefined ? (body.linkedinUrl ? sanitizeText(body.linkedinUrl, 300) : null) : undefined,
        githubUrl: body.githubUrl !== undefined ? (body.githubUrl ? sanitizeText(body.githubUrl, 300) : null) : undefined,
        leaderName: body.leaderName !== undefined ? (body.leaderName ? sanitizeText(body.leaderName, 100) : null) : undefined,
        leaderRole: body.leaderRole !== undefined ? (body.leaderRole ? sanitizeText(body.leaderRole, 100) : null) : undefined,
        leaderId: body.leaderId !== undefined ? (body.leaderId ? sanitizeText(body.leaderId, 100) : null) : undefined,
        ...(body.memberCount !== undefined && {
          memberCount: typeof body.memberCount === 'number' ? body.memberCount : parseInt(body.memberCount || '0', 10) || 0,
        }),
        ...(body.eventCount !== undefined && {
          eventCount: typeof body.eventCount === 'number' ? body.eventCount : parseInt(body.eventCount || '0', 10) || 0,
        }),
      }
    });

    await recordAuditLog({
      performedBy: payload.name || payload.email,
      actionType: 'UPDATE',
      entityType: 'CHAPTER',
      entityTitle: updatedChapter.name,
      changeSummary: `Updated organizational unit: ${updatedChapter.name}`,
    });

    return NextResponse.json(updatedChapter);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    const payload = token ? verifyJWT(token) : null;

    if (!payload || !hasPermission(payload.role, 'Settings', 'delete')) {
      return NextResponse.json({ error: 'Unauthorized. Insufficient permissions.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Chapter ID is required.' }, { status: 400 });
    }

    await prisma.chapter.delete({ where: { id } });

    await recordAuditLog({
      performedBy: payload.name || payload.email,
      actionType: 'DELETE',
      entityType: 'CHAPTER',
      entityTitle: id,
      changeSummary: `Deleted chapter ID: ${id}`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
