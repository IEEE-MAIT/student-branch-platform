import { NextResponse } from 'next/server';
import { guardApiRoute } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/auditLog';
import { sanitizePlainText, validateSafeUrl } from '@/lib/security';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const includeDeleted = searchParams.get('includeDeleted') === 'true';

    const list = await prisma.achievement.findMany({
      where: includeDeleted ? undefined : { deletedAt: null },
      orderBy: { year: 'desc' },
      include: {
        people: { include: { person: true } },
        tags: true,
        chapter: true,
        sig: true,
        event: true,
      },
    });
    return NextResponse.json(list);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authCheck = await guardApiRoute(req, 'Achievements', 'create');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }
    const user = authCheck.user;

    const body: any = await req.json();
    const {
      year,
      title,
      conferredBy,
      unitOrTeam,
      category,
      achievementType,
      description,
      imageSrc,
      images,
      chapterId,
      sigId,
      eventId,
      tags,
    } = body;

    if (!year || !title) {
      return NextResponse.json({ error: 'Year and Title are required.' }, { status: 400 });
    }

    const safeTitle = sanitizePlainText(title, 200);
    const safeYear = sanitizePlainText(year, 20);
    const safeConferredBy = conferredBy ? sanitizePlainText(conferredBy, 150) : null;
    const safeUnitOrTeam = unitOrTeam ? sanitizePlainText(unitOrTeam, 100) : null;
    const safeCategory = category ? sanitizePlainText(category, 50) : 'Branch';
    const safeAchievementType = achievementType ? sanitizePlainText(achievementType, 50) : 'Branch';
    const safeDescription = description ? sanitizePlainText(description, 2000) : null;
    const sanitizedImageSrc = imageSrc ? validateSafeUrl(imageSrc) : null;

    let sanitizedImages: string[] = [];
    if (Array.isArray(images)) {
      sanitizedImages = images
        .map((url: any) => (typeof url === 'string' ? validateSafeUrl(url) : null))
        .filter(Boolean) as string[];
      if (sanitizedImages.length > 8) {
        sanitizedImages = sanitizedImages.slice(0, 8);
      }
    }

    const item = await prisma.achievement.create({
      data: {
        year: safeYear,
        title: safeTitle,
        conferredBy: safeConferredBy,
        unitOrTeam: safeUnitOrTeam,
        category: safeCategory,
        achievementType: safeAchievementType,
        description: safeDescription,
        imageSrc: sanitizedImageSrc,
        images: sanitizedImages,
        chapterId: chapterId && chapterId.trim() ? chapterId.trim() : null,
        sigId: sigId && sigId.trim() ? sigId.trim() : null,
        eventId: eventId && eventId.trim() ? eventId.trim() : null,
      },
    });

    // Save custom tags
    if (Array.isArray(tags) && tags.length > 0) {
      for (const tag of tags) {
        if (typeof tag === 'string' && tag.trim()) {
          await prisma.achievementTag.create({
            data: {
              achievementId: item.id,
              tag: sanitizePlainText(tag, 50),
            },
          }).catch(() => {});
        }
      }
    }

    await recordAuditLog({
      performedBy: user.name || user.email,
      userEmail: user.email,
      actionType: 'CREATE',
      entityType: 'ACHIEVEMENT',
      entityId: item.id,
      entityTitle: safeTitle,
      changeSummary: `Created achievement recognition: ${safeTitle} (${safeYear})`,
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const authCheck = await guardApiRoute(req, 'Achievements', 'edit');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }
    const user = authCheck.user;

    const body: any = await req.json();
    const {
      id,
      year,
      title,
      conferredBy,
      unitOrTeam,
      category,
      achievementType,
      description,
      imageSrc,
      images,
      chapterId,
      sigId,
      eventId,
      tags,
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Achievement ID is required.' }, { status: 400 });
    }

    const safeTitle = title ? sanitizePlainText(title, 200) : undefined;
    const safeYear = year ? sanitizePlainText(year, 20) : undefined;
    const safeConferredBy = conferredBy !== undefined ? (conferredBy ? sanitizePlainText(conferredBy, 150) : null) : undefined;
    const safeUnitOrTeam = unitOrTeam !== undefined ? (unitOrTeam ? sanitizePlainText(unitOrTeam, 100) : null) : undefined;
    const safeCategory = category !== undefined ? (category ? sanitizePlainText(category, 50) : 'Branch') : undefined;
    const safeAchievementType = achievementType !== undefined ? (achievementType ? sanitizePlainText(achievementType, 50) : 'Branch') : undefined;
    const safeDescription = description !== undefined ? (description ? sanitizePlainText(description, 2000) : null) : undefined;
    const sanitizedImageSrc = imageSrc !== undefined ? (imageSrc ? validateSafeUrl(imageSrc) : null) : undefined;

    let sanitizedImages: string[] | undefined = undefined;
    if (images !== undefined && Array.isArray(images)) {
      sanitizedImages = images
        .map((url: any) => (typeof url === 'string' ? validateSafeUrl(url) : null))
        .filter(Boolean) as string[];
    }

    const updated = await prisma.achievement.update({
      where: { id },
      data: {
        ...(safeYear && { year: safeYear }),
        ...(safeTitle && { title: safeTitle }),
        conferredBy: safeConferredBy,
        unitOrTeam: safeUnitOrTeam,
        category: safeCategory,
        achievementType: safeAchievementType,
        description: safeDescription,
        imageSrc: sanitizedImageSrc,
        images: sanitizedImages,
        chapterId: chapterId !== undefined ? (chapterId && chapterId.trim() ? chapterId.trim() : null) : undefined,
        sigId: sigId !== undefined ? (sigId && sigId.trim() ? sigId.trim() : null) : undefined,
        eventId: eventId !== undefined ? (eventId && eventId.trim() ? eventId.trim() : null) : undefined,
      },
    });

    if (Array.isArray(tags)) {
      await prisma.achievementTag.deleteMany({ where: { achievementId: id } });
      for (const tag of tags) {
        if (typeof tag === 'string' && tag.trim()) {
          await prisma.achievementTag.create({
            data: {
              achievementId: id,
              tag: sanitizePlainText(tag, 50),
            },
          }).catch(() => {});
        }
      }
    }

    await recordAuditLog({
      performedBy: user.name || user.email,
      userEmail: user.email,
      actionType: 'UPDATE',
      entityType: 'ACHIEVEMENT',
      entityId: id,
      entityTitle: updated.title,
      changeSummary: `Updated achievement recognition: ${updated.title}`,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const authCheck = await guardApiRoute(req, 'Achievements', 'delete');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }
    const user = authCheck.user;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const permanent = searchParams.get('permanent') === 'true';

    if (!id) {
      return NextResponse.json({ error: 'Achievement ID is required.' }, { status: 400 });
    }

    const existing = await prisma.achievement.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Achievement not found.' }, { status: 404 });
    }

    if (permanent) {
      await prisma.achievement.delete({ where: { id } });
      await recordAuditLog({
        performedBy: user.name || user.email,
        userEmail: user.email,
        actionType: 'DELETE',
        entityType: 'ACHIEVEMENT',
        entityId: id,
        entityTitle: existing.title,
        changeSummary: `Permanently deleted achievement: ${existing.title} (ID: ${id})`,
      });
    } else {
      await prisma.achievement.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          deletedBy: user.name || user.email,
        },
      });
      await recordAuditLog({
        performedBy: user.name || user.email,
        userEmail: user.email,
        actionType: 'DELETE',
        entityType: 'ACHIEVEMENT',
        entityId: id,
        entityTitle: existing.title,
        changeSummary: `Moved achievement to Recycle Bin: ${existing.title} (ID: ${id})`,
      });
    }

    return NextResponse.json({ success: true, softDeleted: !permanent });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
