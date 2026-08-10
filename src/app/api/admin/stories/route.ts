import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { hasPermission } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/auditLog';

export async function GET() {
  try {
    const stories = await prisma.story.findMany({ orderBy: { date: 'desc' } });
    return NextResponse.json(stories);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    const payload = token ? verifyJWT(token) : null;

    if (!payload || !hasPermission(payload.role, 'Articles', 'create')) {
      return NextResponse.json({ error: 'Unauthorized. Insufficient permissions.' }, { status: 403 });
    }

    const body: any = await req.json();
    const { title, slug, author, date, category, readTime, excerpt, contentHtml } = body;

    if (!title || !slug || !contentHtml) {
      return NextResponse.json({ error: 'Title, Slug, and Content are required.' }, { status: 400 });
    }

    const story = await prisma.story.create({
      data: {
        title,
        slug,
        author: author || payload.name,
        date: date || new Date().toISOString().split('T')[0],
        category: category || 'General',
        excerpt: excerpt || '',
        contentHtml,
      },
    });

    await recordAuditLog({
      performedBy: payload.name || payload.email,
      actionType: 'CREATE',
      entityType: 'ARTICLE',
      entityTitle: title,
      changeSummary: `Published story article: ${title} (${slug})`,
    });

    return NextResponse.json(story);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    const payload = token ? verifyJWT(token) : null;

    if (!payload || !hasPermission(payload.role, 'Articles', 'delete')) {
      return NextResponse.json({ error: 'Unauthorized. Insufficient permissions.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Story ID is required.' }, { status: 400 });
    }

    await prisma.story.delete({ where: { id } });

    await recordAuditLog({
      performedBy: payload.name || payload.email,
      actionType: 'DELETE',
      entityType: 'ARTICLE',
      entityTitle: id,
      changeSummary: `Deleted story ID: ${id}`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
