import { NextResponse } from 'next/server';
import { guardApiRoute } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/auditLog';
import { sanitizePlainText, validateSafeUrl } from '@/lib/security';
import { deleteCloudinaryImage } from '@/lib/cloudinaryServer';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const includeDeleted = searchParams.get('includeDeleted') === 'true';

    const people = await prisma.person.findMany({
      where: includeDeleted ? undefined : { deletedAt: null },
      orderBy: { hierarchy: 'asc' },
      include: {
        memberships: {
          include: { academicYear: true, chapter: true, role: true },
        },
        sigMemberships: {
          include: { sig: true },
        },
      },
    });
    return NextResponse.json(people);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authCheck = await guardApiRoute(req, 'People', 'create');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }
    const user = authCheck.user;

    const body: any = await req.json();
    const {
      name,
      role,
      category,
      department,
      hierarchy,
      imageUrl,
      bio,
      quote,
      linkedin,
      chapterId,
      academicYear,
      isFacultyAdvisor,
      facultyDepartment,
    } = body;

    if (!name || !role || !category) {
      return NextResponse.json({ error: 'Name, Role, and Category are required.' }, { status: 400 });
    }

    // Sanitize inputs cleanly to pure UTF-8 strings
    const safeName = sanitizePlainText(name, 100);
    const safeRole = sanitizePlainText(role, 100);
    const safeCategory = sanitizePlainText(category, 100);
    const rawBio = bio || quote;
    const safeBio = rawBio ? sanitizePlainText(rawBio, 2000) : null;
    const safeLinkedin = linkedin ? validateSafeUrl(linkedin) : null;
    const safeImageUrl = imageUrl ? validateSafeUrl(imageUrl) : null;
    const safeDepartment = department ? sanitizePlainText(department, 100) : '';
    const safeFacultyDepartment = facultyDepartment ? sanitizePlainText(facultyDepartment, 100) : null;
    const safeAcademicYear = academicYear ? sanitizePlainText(academicYear, 50) : '2025-26';

    // Fetch or create Role in DB (CMS-managed)
    let dbRole = await prisma.role.findFirst({ where: { title: safeRole } });
    if (!dbRole) {
      dbRole = await prisma.role.create({
        data: {
          title: safeRole,
          category: safeCategory === 'Senior Executive Committee' ? 'SEC' : 'Lead',
          hierarchy: Number(hierarchy) || 10,
          isActive: true,
        },
      });
    }

    // Fetch or create Academic Year
    let dbAcademicYear = await prisma.academicYear.findFirst({
      where: {
        OR: [
          { label: safeAcademicYear },
          { label: safeAcademicYear.replace('-', '–') },
          { label: safeAcademicYear.replace('–', '-') },
        ],
      },
    });

    if (!dbAcademicYear) {
      dbAcademicYear = await prisma.academicYear.create({
        data: {
          label: safeAcademicYear,
          isCurrent: safeAcademicYear === '2025-26' || safeAcademicYear === '2025–26',
        },
      });
    }

    // Create Person and Membership
    const person = await prisma.person.create({
      data: {
        name: safeName,
        role: safeRole,
        category: safeCategory,
        academicYear: safeAcademicYear,
        department: safeDepartment,
        facultyDepartment: safeFacultyDepartment,
        isFacultyAdvisor: Boolean(isFacultyAdvisor),
        hierarchy: Number(hierarchy) || 10,
        imageUrl: safeImageUrl,
        bio: safeBio,
        linkedIn: safeLinkedin,
        memberships: {
          create: {
            roleId: dbRole.id,
            academicYearId: dbAcademicYear.id,
            chapterId: chapterId || null,
            isCurrent: dbAcademicYear.isCurrent,
          },
        },
      },
    });

    await recordAuditLog({
      performedBy: user.name || user.email,
      userEmail: user.email,
      actionType: 'CREATE',
      entityType: 'PERSON',
      entityId: person.id,
      entityTitle: safeName,
      changeSummary: `Created team member: ${safeName} (${safeRole})`,
    });

    return NextResponse.json(person, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const authCheck = await guardApiRoute(req, 'People', 'edit');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }
    const user = authCheck.user;

    const body: any = await req.json();
    const {
      id,
      name,
      role,
      category,
      department,
      hierarchy,
      imageUrl,
      bio,
      quote,
      linkedin,
      chapterId,
      academicYear,
      isFacultyAdvisor,
      facultyDepartment,
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Person ID is required for update.' }, { status: 400 });
    }

    if (!name || !role || !category) {
      return NextResponse.json({ error: 'Name, Role, and Category are required.' }, { status: 400 });
    }

    const existingPerson = await prisma.person.findUnique({
      where: { id },
      include: { memberships: true },
    });

    if (!existingPerson) {
      return NextResponse.json({ error: 'Person record not found.' }, { status: 404 });
    }

    // Sanitize inputs cleanly to pure UTF-8 strings
    const safeName = sanitizePlainText(name, 100);
    const safeRole = sanitizePlainText(role, 100);
    const safeCategory = sanitizePlainText(category, 100);
    const rawBio = bio || quote;
    const safeBio = rawBio ? sanitizePlainText(rawBio, 2000) : null;
    const safeLinkedin = linkedin ? validateSafeUrl(linkedin) : null;
    const safeImageUrl = imageUrl ? validateSafeUrl(imageUrl) : null;
    const safeDepartment = department ? sanitizePlainText(department, 100) : '';
    const safeFacultyDepartment = facultyDepartment ? sanitizePlainText(facultyDepartment, 100) : null;
    const safeAcademicYear = academicYear ? sanitizePlainText(academicYear, 50) : (existingPerson.academicYear || '2025-26');

    // IF IMAGE CHANGED: Delete old image from Cloudinary
    if (existingPerson.imageUrl && existingPerson.imageUrl !== safeImageUrl) {
      await deleteCloudinaryImage(existingPerson.imageUrl).catch(() => {});
    }

    // Fetch or create Role
    let dbRole = await prisma.role.findFirst({ where: { title: safeRole } });
    if (!dbRole) {
      dbRole = await prisma.role.create({
        data: {
          title: safeRole,
          category: safeCategory === 'Senior Executive Committee' ? 'SEC' : 'Lead',
          hierarchy: Number(hierarchy) || 10,
          isActive: true,
        },
      });
    }

    // Fetch or create Academic Year
    let dbAcademicYear = await prisma.academicYear.findFirst({
      where: {
        OR: [
          { label: safeAcademicYear },
          { label: safeAcademicYear.replace('-', '–') },
          { label: safeAcademicYear.replace('–', '-') },
        ],
      },
    });

    if (!dbAcademicYear) {
      dbAcademicYear = await prisma.academicYear.create({
        data: {
          label: safeAcademicYear,
          isCurrent: safeAcademicYear === '2025-26' || safeAcademicYear === '2025–26',
        },
      });
    }

    // Update Person
    const updatedPerson = await prisma.person.update({
      where: { id },
      data: {
        name: safeName,
        role: safeRole,
        category: safeCategory,
        academicYear: safeAcademicYear,
        department: safeDepartment,
        facultyDepartment: safeFacultyDepartment,
        isFacultyAdvisor: isFacultyAdvisor !== undefined ? Boolean(isFacultyAdvisor) : existingPerson.isFacultyAdvisor,
        hierarchy: Number(hierarchy) || 10,
        imageUrl: safeImageUrl,
        bio: safeBio,
        linkedIn: safeLinkedin,
      },
    });

    // Update or recreate membership
    if (dbRole && dbAcademicYear) {
      await prisma.organizationMembership.deleteMany({
        where: { personId: id },
      });
      await prisma.organizationMembership.create({
        data: {
          personId: id,
          roleId: dbRole.id,
          academicYearId: dbAcademicYear.id,
          chapterId: chapterId || null,
          isCurrent: dbAcademicYear.isCurrent,
        },
      });
    }

    await recordAuditLog({
      performedBy: user.name || user.email,
      userEmail: user.email,
      actionType: 'UPDATE',
      entityType: 'PERSON',
      entityId: id,
      entityTitle: safeName,
      changeSummary: `Updated team member: ${safeName} (${safeRole})`,
    });

    return NextResponse.json(updatedPerson);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const authCheck = await guardApiRoute(req, 'People', 'delete');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }
    const user = authCheck.user;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const permanent = searchParams.get('permanent') === 'true';

    if (!id) {
      return NextResponse.json({ error: 'Person ID is required.' }, { status: 400 });
    }

    const existingPerson = await prisma.person.findUnique({ where: { id } });
    if (!existingPerson) {
      return NextResponse.json({ error: 'Person not found.' }, { status: 404 });
    }

    const performedBy = user.name || user.email;

    if (permanent) {
      if (existingPerson.imageUrl) {
        await deleteCloudinaryImage(existingPerson.imageUrl).catch(() => {});
      }
      await prisma.person.delete({ where: { id } });

      await recordAuditLog({
        performedBy,
        userEmail: user.email,
        actionType: 'DELETE',
        entityType: 'PERSON',
        entityId: id,
        entityTitle: existingPerson.name,
        changeSummary: `Permanently deleted person: ${existingPerson.name} (${id})`,
      });
    } else {
      await prisma.person.update({
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
        entityType: 'PERSON',
        entityId: id,
        entityTitle: existingPerson.name,
        changeSummary: `Moved person to Recycle Bin: ${existingPerson.name} (${id})`,
      });
    }

    return NextResponse.json({ success: true, softDeleted: !permanent });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
