import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { hasPermission } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/auditLog';
import { validateSafeUrl } from '@/lib/security';

export async function GET() {
  try {
    const list = await prisma.achievement.findMany({ orderBy: { year: 'desc' } });
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

    if (!payload || !hasPermission(payload.role, 'Achievements', 'create')) {
      return NextResponse.json({ error: 'Unauthorized. Insufficient permissions.' }, { status: 403 });
    }

    const body: any = await req.json();
    const { year, title, conferredBy, unitOrTeam, category, description } = body;

    if (!year || !title) {
      return NextResponse.json({ error: 'Year and Title are required.' }, { status: 400 });
    }

    const sanitizedImageSrc = body.imageSrc ? validateSafeUrl(body.imageSrc) : null;
    
    // Ensure images is an array of valid URLs, limited to 4
    let sanitizedImages: string[] = [];
    if (Array.isArray(body.images)) {
      sanitizedImages = body.images
        .map((url: any) => typeof url === 'string' ? validateSafeUrl(url) : null)
        .filter(Boolean) as string[];
      if (sanitizedImages.length > 4) {
        sanitizedImages = sanitizedImages.slice(0, 4);
      }
    }

    const item = await prisma.achievement.create({
      data: { 
        year, 
        title, 
        conferredBy, 
        unitOrTeam, 
        category, 
        description,
        imageSrc: sanitizedImageSrc,
        images: sanitizedImages,
      },
    });

    await recordAuditLog({
      performedBy: payload.name || payload.email,
      actionType: 'CREATE',
      entityType: 'ACHIEVEMENT',
      entityTitle: title,
      changeSummary: `Created achievement honor: ${title} (${year})`,
    });

    return NextResponse.json(item);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    const payload = token ? verifyJWT(token) : null;

    if (!payload || !hasPermission(payload.role, 'Achievements', 'delete')) {
      return NextResponse.json({ error: 'Unauthorized. Insufficient permissions.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Achievement ID is required.' }, { status: 400 });
    }

    await prisma.achievement.delete({ where: { id } });

    await recordAuditLog({
      performedBy: payload.name || payload.email,
      actionType: 'DELETE',
      entityType: 'ACHIEVEMENT',
      entityTitle: id,
      changeSummary: `Deleted achievement ID: ${id}`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
