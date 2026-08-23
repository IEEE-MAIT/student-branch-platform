import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { hasPermission } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/auditLog';
import { sanitizeText, validateSafeUrl } from '@/lib/security';
import { deleteCloudinaryImage } from '@/lib/cloudinaryServer';

export async function GET() {
  try {
    const people = await prisma.person.findMany({ 
      orderBy: { hierarchy: 'asc' },
      include: { memberships: { include: { academicYear: true, chapter: true } } }
    });
    return NextResponse.json(people);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    const payload = token ? verifyJWT(token) : null;

    if (!payload || !hasPermission(payload.role, 'People', 'create')) {
      return NextResponse.json({ error: 'Unauthorized. Insufficient permissions.' }, { status: 403 });
    }

    const body: any = await req.json();
    const { name, role, category, department, hierarchy, imageUrl, bio, quote, linkedin, chapterId, academicYear } = body;

    if (!name || !role || !category) {
      return NextResponse.json({ error: 'Name, Role, and Category are required.' }, { status: 400 });
    }

    // Sanitize inputs
    const safeName = sanitizeText(name, 100);
    const rawBio = bio || quote;
    const safeBio = rawBio ? sanitizeText(rawBio, 1000) : null;
    const safeLinkedin = linkedin ? validateSafeUrl(linkedin) : null;
    const safeImageUrl = imageUrl ? validateSafeUrl(imageUrl) : null;
    const safeDepartment = department ? sanitizeText(department, 100) : '';
    const safeAcademicYear = academicYear ? sanitizeText(academicYear, 50) : '2025-26';

    // --- STRUCTURAL VALIDATION ENGINE ---
    const secRoles = [
      'Chairperson', 'Vice-Chairperson', 'General Secretary',
      'Web Master', 'Treasurer', 'Joint Secretary',
      'PR Head', 'Creative Head', 'Sponsorship Head', 'Hardware Head'
    ];
    const operationalRoles = [
      'Technical Lead', 'Creative Lead', 'PR Lead', 'Event Management Lead'
    ];

    const isSEC = category === 'Senior Executive Committee' || category === 'EDS Chapter' || category === 'Affinity Group';
    const isOperational = category === 'Operational Leads';

    if (isSEC && !secRoles.includes(role)) {
      return NextResponse.json({ error: `Invalid role for ${category}. Allowed roles: ${secRoles.join(', ')}` }, { status: 400 });
    }

    if (isOperational && !operationalRoles.includes(role)) {
      return NextResponse.json({ error: `Invalid role for ${category}. Allowed roles: ${operationalRoles.join(', ')}` }, { status: 400 });
    }

    // --- CAPACITY ENFORCEMENT (MAX 2 PER ROLE IN A CATEGORY, CHAPTER, AND ACADEMIC YEAR) ---
    if (isSEC || isOperational) {
      const existingCount = await prisma.person.count({
        where: {
          role: role,
          category: category,
          academicYear: safeAcademicYear,
          ...(chapterId ? { memberships: { some: { chapterId } } } : {})
        }
      });

      if (existingCount >= 2) {
        return NextResponse.json({ error: `Position Limit Reached: There are already 2 active people holding the '${role}' position in this unit for ${safeAcademicYear}.` }, { status: 400 });
      }
    }
    // --- END VALIDATION ---

    // Fetch or create Role
    let dbRole = await prisma.role.findFirst({ where: { title: role } });
    if (!dbRole) {
      dbRole = await prisma.role.create({
        data: {
          title: role,
          category: isSEC ? 'SEC' : isOperational ? 'Operational' : 'General',
          hierarchy: Number(hierarchy) || 10,
          isActive: true
        }
      });
    }

    // Fetch or create Academic Year
    let dbAcademicYear = await prisma.academicYear.findFirst({
      where: {
        OR: [
          { label: safeAcademicYear },
          { label: safeAcademicYear.replace('-', '–') },
          { label: safeAcademicYear.replace('–', '-') }
        ]
      }
    });

    if (!dbAcademicYear) {
      dbAcademicYear = await prisma.academicYear.create({
        data: {
          label: safeAcademicYear,
          isCurrent: safeAcademicYear === '2025-26' || safeAcademicYear === '2025–26'
        }
      });
    }

    // Create Person and Membership
    const person = await prisma.person.create({
      data: {
        name: safeName,
        role,
        category,
        academicYear: safeAcademicYear,
        department: safeDepartment,
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
          }
        }
      },
    });

    await recordAuditLog({
      performedBy: payload.name || payload.email,
      actionType: 'CREATE',
      entityType: 'PERSON',
      entityTitle: safeName,
      changeSummary: `Created team member: ${safeName} (${role})`,
    });

    return NextResponse.json(person);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    const payload = token ? verifyJWT(token) : null;

    if (!payload || !hasPermission(payload.role, 'People', 'edit')) {
      return NextResponse.json({ error: 'Unauthorized. Insufficient permissions.' }, { status: 403 });
    }

    const body: any = await req.json();
    const { id, name, role, category, department, hierarchy, imageUrl, bio, quote, linkedin, chapterId, academicYear } = body;

    if (!id) {
      return NextResponse.json({ error: 'Person ID is required for update.' }, { status: 400 });
    }

    if (!name || !role || !category) {
      return NextResponse.json({ error: 'Name, Role, and Category are required.' }, { status: 400 });
    }

    // Find existing person record
    const existingPerson = await prisma.person.findUnique({
      where: { id },
      include: { memberships: true }
    });

    if (!existingPerson) {
      return NextResponse.json({ error: 'Person record not found.' }, { status: 404 });
    }

    // Sanitize inputs
    const safeName = sanitizeText(name, 100);
    const rawBio = bio || quote;
    const safeBio = rawBio ? sanitizeText(rawBio, 1000) : null;
    const safeLinkedin = linkedin ? validateSafeUrl(linkedin) : null;
    const safeImageUrl = imageUrl ? validateSafeUrl(imageUrl) : null;
    const safeDepartment = department ? sanitizeText(department, 100) : '';
    const safeAcademicYear = academicYear ? sanitizeText(academicYear, 50) : (existingPerson.academicYear || '2025-26');

    // --- STRUCTURAL VALIDATION ENGINE ---
    const secRoles = [
      'Chairperson', 'Vice-Chairperson', 'General Secretary',
      'Web Master', 'Treasurer', 'Joint Secretary',
      'PR Head', 'Creative Head', 'Sponsorship Head', 'Hardware Head'
    ];
    const operationalRoles = [
      'Technical Lead', 'Creative Lead', 'PR Lead', 'Event Management Lead'
    ];

    const isSEC = category === 'Senior Executive Committee' || category === 'EDS Chapter' || category === 'Affinity Group';
    const isOperational = category === 'Operational Leads';

    if (isSEC && !secRoles.includes(role)) {
      return NextResponse.json({ error: `Invalid role for ${category}. Allowed roles: ${secRoles.join(', ')}` }, { status: 400 });
    }

    if (isOperational && !operationalRoles.includes(role)) {
      return NextResponse.json({ error: `Invalid role for ${category}. Allowed roles: ${operationalRoles.join(', ')}` }, { status: 400 });
    }

    // --- CAPACITY ENFORCEMENT (MAX 2 PER ROLE IN A CATEGORY, CHAPTER, AND ACADEMIC YEAR EXCEPT CURRENT PERSON) ---
    if (isSEC || isOperational) {
      const existingCount = await prisma.person.count({
        where: {
          id: { not: id },
          role: role,
          category: category,
          academicYear: safeAcademicYear,
          ...(chapterId ? { memberships: { some: { chapterId } } } : {})
        }
      });

      if (existingCount >= 2) {
        return NextResponse.json({ error: `Position Limit Reached: There are already 2 active people holding the '${role}' position in this unit for ${safeAcademicYear}.` }, { status: 400 });
      }
    }
    // --- END VALIDATION ---

    // IF IMAGE CHANGED: Delete old image from Cloudinary
    if (existingPerson.imageUrl && existingPerson.imageUrl !== safeImageUrl) {
      await deleteCloudinaryImage(existingPerson.imageUrl);
    }

    // Fetch or create Role
    let dbRole = await prisma.role.findFirst({ where: { title: role } });
    if (!dbRole) {
      dbRole = await prisma.role.create({
        data: {
          title: role,
          category: isSEC ? 'SEC' : isOperational ? 'Operational' : 'General',
          hierarchy: Number(hierarchy) || 10,
          isActive: true
        }
      });
    }

    // Fetch or create Academic Year
    let dbAcademicYear = await prisma.academicYear.findFirst({
      where: {
        OR: [
          { label: safeAcademicYear },
          { label: safeAcademicYear.replace('-', '–') },
          { label: safeAcademicYear.replace('–', '-') }
        ]
      }
    });

    if (!dbAcademicYear) {
      dbAcademicYear = await prisma.academicYear.create({
        data: {
          label: safeAcademicYear,
          isCurrent: safeAcademicYear === '2025-26' || safeAcademicYear === '2025–26'
        }
      });
    }

    // Update Person
    const updatedPerson = await prisma.person.update({
      where: { id },
      data: {
        name: safeName,
        role,
        category,
        academicYear: safeAcademicYear,
        department: safeDepartment,
        hierarchy: Number(hierarchy) || 10,
        imageUrl: safeImageUrl,
        bio: safeBio,
        linkedIn: safeLinkedin,
      },
    });

    // Update or recreate membership
    if (dbRole && dbAcademicYear) {
      await prisma.organizationMembership.deleteMany({
        where: { personId: id }
      });
      await prisma.organizationMembership.create({
        data: {
          personId: id,
          roleId: dbRole.id,
          academicYearId: dbAcademicYear.id,
          chapterId: (category === 'EDS Chapter' || category === 'Affinity Group') ? (chapterId || null) : null,
          isCurrent: dbAcademicYear.isCurrent,
        }
      });
    }

    await recordAuditLog({
      performedBy: payload.name || payload.email,
      actionType: 'UPDATE',
      entityType: 'PERSON',
      entityTitle: safeName,
      changeSummary: `Updated team member: ${safeName} (${role})`,
    });

    return NextResponse.json(updatedPerson);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    const payload = token ? verifyJWT(token) : null;

    if (!payload || !hasPermission(payload.role, 'People', 'delete')) {
      return NextResponse.json({ error: 'Unauthorized. Insufficient permissions.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Person ID is required.' }, { status: 400 });
    }

    const existingPerson = await prisma.person.findUnique({ where: { id } });
    if (existingPerson?.imageUrl) {
      await deleteCloudinaryImage(existingPerson.imageUrl);
    }

    await prisma.person.delete({ where: { id } });

    await recordAuditLog({
      performedBy: payload.name || payload.email,
      actionType: 'DELETE',
      entityType: 'PERSON',
      entityTitle: existingPerson?.name || id,
      changeSummary: `Deleted team member: ${existingPerson?.name || id}`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
