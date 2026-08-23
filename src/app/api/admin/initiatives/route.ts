import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { hasPermission } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/auditLog';
import { sanitizeText } from '@/lib/security';

export async function GET() {
  try {
    const list = await prisma.initiative.findMany({
      include: { chapter: true },
    });
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

    if (!payload || !hasPermission(payload.role, 'Chapters', 'create')) {
      return NextResponse.json({ error: 'Unauthorized. Insufficient permissions.' }, { status: 403 });
    }

    const body: any = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    if (!body.title || !body.slug || !body.description) {
      return NextResponse.json({ error: 'Missing required fields: title, slug, description' }, { status: 400 });
    }

    const sanitizedTitle = sanitizeText(body.title, 200);
    const sanitizedSlug = sanitizeText(body.slug, 100).toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const sanitizedDescription = sanitizeText(body.description, 3000);
    const sanitizedStatus = sanitizeText(body.status || 'Active', 50);
    const sanitizedTargetAudience = body.targetAudience ? sanitizeText(body.targetAudience, 150) : null;
    const sanitizedIconName = body.iconName ? sanitizeText(body.iconName, 50) : null;

    const newInitiative = await prisma.initiative.create({
      data: {
        title: sanitizedTitle,
        slug: sanitizedSlug,
        description: sanitizedDescription,
        status: sanitizedStatus,
        targetAudience: sanitizedTargetAudience,
        iconName: sanitizedIconName,
        chapterId: body.chapterId || null,
      },
    });

    const performedBy = payload.name || payload.email;
    await recordAuditLog({
      performedBy,
      actionType: 'CREATE',
      entityType: 'Initiative',
      entityTitle: sanitizedTitle,
      changeSummary: `Created chapter initiative "${sanitizedTitle}"`,
    });

    return NextResponse.json(newInitiative, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
