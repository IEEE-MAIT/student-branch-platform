import { NextResponse } from 'next/server';
import { guardApiRoute } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/auditLog';
import { sanitizePlainText } from '@/lib/security';
import { ROLE_DEFAULT_PERMISSIONS } from '@/lib/permissions';

export async function GET(req: Request) {
  try {
    const authCheck = await guardApiRoute(req, 'Users', 'view');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }

    const users = await prisma.adminUser.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        roleId: true,
        role: {
          select: { id: true, name: true, description: true },
        },
        customPermissions: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        createdBy: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authCheck = await guardApiRoute(req, 'Users', 'create');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }
    const user = authCheck.user;

    const body: any = await req.json();
    const { name, email, password, roleId, roleName, customPermissions } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await prisma.adminUser.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return NextResponse.json({ error: 'A user with this email address already exists.' }, { status: 400 });
    }

    // Resolve roleId
    let resolvedRoleId = roleId;
    if (!resolvedRoleId && roleName) {
      const normalizedRole = roleName.trim();
      let dbRole = await prisma.adminRole.findUnique({ where: { name: normalizedRole } });
      if (!dbRole) {
        dbRole = await prisma.adminRole.create({
          data: {
            name: normalizedRole,
            description: `${normalizedRole} Role`,
            permissions: (ROLE_DEFAULT_PERMISSIONS[normalizedRole] || ROLE_DEFAULT_PERMISSIONS['Viewer']) as any,
            isSystem: ['Super Admin', 'Admin', 'Event Manager', 'PR/Media', 'SIG Lead', 'Content Editor', 'Viewer'].includes(normalizedRole),
          },
        });
      }
      resolvedRoleId = dbRole.id;
    }

    const safeName = sanitizePlainText(name, 100);

    const newUser = await prisma.adminUser.create({
      data: {
        name: safeName,
        email: normalizedEmail,
        password: password,
        roleId: resolvedRoleId || null,
        customPermissions: customPermissions || null,
        isActive: true,
        createdBy: user.email,
      },
      include: {
        role: true,
      },
    });

    // Mirror to legacy officer table for fallback compatibility
    await prisma.officer.create({
      data: {
        name: safeName,
        email: normalizedEmail,
        password: password,
        role: newUser.role?.name || 'Admin',
        createdAt: new Date().toISOString(),
        createdBy: user.email,
      },
    }).catch(() => {});

    await recordAuditLog({
      performedBy: user.name || user.email,
      userEmail: user.email,
      actionType: 'CREATE',
      entityType: 'USER',
      entityId: newUser.id,
      entityTitle: `${safeName} (${normalizedEmail})`,
      changeSummary: `Created admin user: ${safeName} with role '${newUser.role?.name || 'Custom'}'`,
    });

    return NextResponse.json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role?.name,
      roleId: newUser.roleId,
      isActive: newUser.isActive,
      createdAt: newUser.createdAt,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const authCheck = await guardApiRoute(req, 'Users', 'edit');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }
    const user = authCheck.user;

    const body: any = await req.json();
    const { id, name, roleId, roleName, password, isActive, customPermissions } = body;

    if (!id) {
      return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    const existingUser = await prisma.adminUser.findUnique({
      where: { id },
      include: { role: true },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    // Resolve roleId
    let resolvedRoleId = roleId !== undefined ? roleId : existingUser.roleId;
    if (roleName && resolvedRoleId === undefined) {
      const dbRole = await prisma.adminRole.findUnique({ where: { name: roleName } });
      if (dbRole) {
        resolvedRoleId = dbRole.id;
      }
    }

    const updateData: any = {};
    if (name) updateData.name = sanitizePlainText(name, 100);
    if (password && password.length >= 6) updateData.password = password;
    if (resolvedRoleId !== undefined) updateData.roleId = resolvedRoleId;
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);
    if (customPermissions !== undefined) updateData.customPermissions = customPermissions;

    const updatedUser = await prisma.adminUser.update({
      where: { id },
      data: updateData,
      include: { role: true },
    });

    // Mirror updates to legacy officer table
    if (updateData.name || updateData.password || updatedUser.role?.name) {
      await prisma.officer.updateMany({
        where: { email: existingUser.email },
        data: {
          name: updateData.name || undefined,
          password: updateData.password || undefined,
          role: updatedUser.role?.name || undefined,
        },
      }).catch(() => {});
    }

    await recordAuditLog({
      performedBy: user.name || user.email,
      userEmail: user.email,
      actionType: 'UPDATE',
      entityType: 'USER',
      entityId: id,
      entityTitle: `${updatedUser.name} (${updatedUser.email})`,
      changeSummary: `Updated admin user: ${updatedUser.name} (Role: ${updatedUser.role?.name || 'Custom'}, Active: ${updatedUser.isActive})`,
    });

    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role?.name,
      roleId: updatedUser.roleId,
      isActive: updatedUser.isActive,
      customPermissions: updatedUser.customPermissions,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const authCheck = await guardApiRoute(req, 'Users', 'delete');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }
    const user = authCheck.user;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    const existingUser = await prisma.adminUser.findUnique({ where: { id } });
    if (!existingUser) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    // Protect self-deletion
    if (existingUser.email.toLowerCase() === user.email.toLowerCase()) {
      return NextResponse.json({ error: 'You cannot delete your own account.' }, { status: 400 });
    }

    await prisma.adminUser.delete({ where: { id } });
    await prisma.officer.deleteMany({ where: { email: existingUser.email } }).catch(() => {});

    await recordAuditLog({
      performedBy: user.name || user.email,
      userEmail: user.email,
      actionType: 'DELETE',
      entityType: 'USER',
      entityId: id,
      entityTitle: `${existingUser.name} (${existingUser.email})`,
      changeSummary: `Deleted admin user account: ${existingUser.name} (${existingUser.email})`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
