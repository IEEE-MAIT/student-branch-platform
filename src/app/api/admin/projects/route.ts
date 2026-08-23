import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { hasPermission } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/auditLog';
import { sanitizeText, validateSafeUrl } from '@/lib/security';

export async function GET() {
  try {
    const list = await prisma.project.findMany({
      orderBy: { year: 'desc' },
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

    if (!body.title || !body.slug) {
      return NextResponse.json({ error: 'Missing required fields: title, slug' }, { status: 400 });
    }

    const sanitizedTitle = sanitizeText(body.title, 200);
    const sanitizedSlug = sanitizeText(body.slug, 100).toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const sanitizedSummary = sanitizeText(body.summary || '', 500);
    const sanitizedDescription = sanitizeText(body.description || '', 3000);
    const sanitizedYear = sanitizeText(body.year || new Date().getFullYear().toString(), 10);
    const sanitizedGithubUrl = body.githubUrl ? validateSafeUrl(body.githubUrl) : null;
    const sanitizedDemoUrl = body.demoUrl ? validateSafeUrl(body.demoUrl) : null;
    const sanitizedCoverImage = body.coverImage ? validateSafeUrl(body.coverImage) : null;

    const tags = Array.isArray(body.tags)
      ? body.tags.map((t: string) => sanitizeText(t, 50)).slice(0, 10)
      : [];

    const newProject = await prisma.project.create({
      data: {
        title: sanitizedTitle,
        slug: sanitizedSlug,
        summary: sanitizedSummary,
        description: sanitizedDescription,
        githubUrl: sanitizedGithubUrl,
        demoUrl: sanitizedDemoUrl,
        coverImage: sanitizedCoverImage,
        year: sanitizedYear,
        tags,
        featured: Boolean(body.featured),
        chapterId: body.chapterId || null,
      },
    });

    const performedBy = payload.name || payload.email;
    await recordAuditLog({
      performedBy,
      actionType: 'CREATE',
      entityType: 'Project',
      entityTitle: sanitizedTitle,
      changeSummary: `Created technical project "${sanitizedTitle}"`,
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
