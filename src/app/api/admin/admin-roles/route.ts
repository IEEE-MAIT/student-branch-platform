import { NextResponse } from 'next/server';
import { guardApiRoute } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/auditLog';
import { sanitizePlainText } from '@/lib/security';
import { ROLE_DEFAULT_PERMISSIONS } from '@/lib/permissions';

export async function GET(req: Request) {
  try {
    const authCheck = await guardApiRoute(req, 'Roles', 'view');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }

    let roles = await prisma.adminRole.findMany({
      include: {
        _count: { select: { users: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    // If no roles exist in DB, bootstrap the default 7 roles automatically
    if (roles.length === 0) {
      const defaultRoleNames = Object.keys(ROLE_DEFAULT_PERMISSIONS);
      for (const roleName of defaultRoleNames) {
        await prisma.adminRole.create({
          data: {
            name: roleName,
            description: `Built-in ${roleName} role`,
            permissions: ROLE_DEFAULT_PERMISSIONS[roleName] as any,
            isSystem: true,
          },
        }).catch(() => {});
      }

      roles = await prisma.adminRole.findMany({
        include: {
          _count: { select: { users: true } },
        },
        orderBy: { createdAt: 'asc' },
      });
    }

    return NextResponse.json(roles);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authCheck = await guardApiRoute(req, 'Roles', 'create');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }
    const user = authCheck.user;

    const body: any = await req.json();
    const { name, description, permissions } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Role name is required.' }, { status: 400 });
    }

    const safeName = sanitizePlainText(name, 100);
    const safeDescription = description ? sanitizePlainText(description, 300) : null;

    const existing = await prisma.adminRole.findUnique({ where: { name: safeName } });
    if (existing) {
      return NextResponse.json({ error: 'A role with this name already exists.' }, { status: 400 });
    }

    const newRole = await prisma.adminRole.create({
      data: {
        name: safeName,
        description: safeDescription,
        permissions: permissions || {},
        isSystem: false,
      },
    });

    await recordAuditLog({
      performedBy: user.name || user.email,
      userEmail: user.email,
      actionType: 'CREATE',
      entityType: 'ROLE',
      entityId: newRole.id,
      entityTitle: safeName,
      changeSummary: `Created RBAC admin role: ${safeName}`,
      details: { permissions },
    });

    return NextResponse.json(newRole, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const authCheck = await guardApiRoute(req, 'Roles', 'edit');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }
    const user = authCheck.user;

    const body: any = await req.json();
    const { id, name, description, permissions } = body;

    if (!id) {
      return NextResponse.json({ error: 'Role ID is required.' }, { status: 400 });
    }

    const existingRole = await prisma.adminRole.findUnique({ where: { id } });
    if (!existingRole) {
      return NextResponse.json({ error: 'Role not found.' }, { status: 404 });
    }

    const safeName = name ? sanitizePlainText(name, 100) : existingRole.name;
    const safeDescription = description !== undefined ? sanitizePlainText(description, 300) : existingRole.description;

    const updatedRole = await prisma.adminRole.update({
      where: { id },
      data: {
        name: existingRole.isSystem ? existingRole.name : safeName, // protect system role names
        description: safeDescription,
        permissions: permissions !== undefined ? permissions : (existingRole.permissions as any),
      },
    });

    await recordAuditLog({
      performedBy: user.name || user.email,
      userEmail: user.email,
      actionType: 'UPDATE',
      entityType: 'ROLE',
      entityId: id,
      entityTitle: safeName,
      changeSummary: `Updated permissions for RBAC role: ${safeName}`,
      details: { permissions },
    });

    return NextResponse.json(updatedRole);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const authCheck = await guardApiRoute(req, 'Roles', 'delete');
    if (!authCheck.isAuthorized) {
      return authCheck.errorResponse;
    }
    const user = authCheck.user;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Role ID is required.' }, { status: 400 });
    }

    const existingRole = await prisma.adminRole.findUnique({
      where: { id },
      include: { _count: { select: { users: true } } },
    });

    if (!existingRole) {
      return NextResponse.json({ error: 'Role not found.' }, { status: 404 });
    }

    if (existingRole.isSystem) {
      return NextResponse.json({ error: 'Built-in system roles cannot be deleted.' }, { status: 400 });
    }

    if (existingRole._count.users > 0) {
      return NextResponse.json(
        { error: `Cannot delete role '${existingRole.name}' because ${existingRole._count.users} user(s) are assigned to it.` },
        { status: 400 }
      );
    }

    await prisma.adminRole.delete({ where: { id } });

    await recordAuditLog({
      performedBy: user.name || user.email,
      userEmail: user.email,
      actionType: 'DELETE',
      entityType: 'ROLE',
      entityId: id,
      entityTitle: existingRole.name,
      changeSummary: `Deleted RBAC role: ${existingRole.name}`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
