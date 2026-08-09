/**
 * @file src/lib/auth.ts
 * @description Permission checking & RBAC logic per Section 40 of spec.
 *
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

export type Role =
  | 'Super Admin'
  | 'Webmaster'
  | 'Chairperson'
  | 'General Secretary'
  | 'Content Manager'
  | 'Events Manager'
  | 'Chapter Admin';

export type Resource =
  | 'People'
  | 'Events'
  | 'Articles'
  | 'Galleries'
  | 'Milestones'
  | 'Achievements'
  | 'Resources'
  | 'Settings'
  | 'Users'
  | 'AuditLogs';

export type Action = 'view' | 'create' | 'edit' | 'delete' | 'publish';

// Permission Matrix mapping (Resource -> Action -> allowed roles)
const PERMISSION_MATRIX: Record<Resource, Record<Action, Role[]>> = {
  People: {
    view: ['Super Admin', 'Webmaster', 'Chairperson', 'General Secretary', 'Content Manager', 'Events Manager', 'Chapter Admin'],
    create: ['Super Admin', 'Webmaster', 'Chairperson', 'General Secretary'],
    edit: ['Super Admin', 'Webmaster', 'Chairperson', 'General Secretary'],
    delete: ['Super Admin', 'Webmaster'],
    publish: ['Super Admin', 'Webmaster', 'Chairperson'],
  },
  Events: {
    view: ['Super Admin', 'Webmaster', 'Chairperson', 'General Secretary', 'Content Manager', 'Events Manager', 'Chapter Admin'],
    create: ['Super Admin', 'Webmaster', 'Chairperson', 'General Secretary', 'Events Manager', 'Chapter Admin'],
    edit: ['Super Admin', 'Webmaster', 'Chairperson', 'General Secretary', 'Events Manager', 'Chapter Admin'],
    delete: ['Super Admin', 'Webmaster', 'Chairperson'],
    publish: ['Super Admin', 'Webmaster', 'Chairperson'],
  },
  Articles: {
    view: ['Super Admin', 'Webmaster', 'Chairperson', 'General Secretary', 'Content Manager', 'Events Manager', 'Chapter Admin'],
    create: ['Super Admin', 'Webmaster', 'Chairperson', 'General Secretary', 'Content Manager'],
    edit: ['Super Admin', 'Webmaster', 'Chairperson', 'General Secretary', 'Content Manager'],
    delete: ['Super Admin', 'Webmaster'],
    publish: ['Super Admin', 'Webmaster', 'Chairperson', 'Content Manager'],
  },
  Galleries: {
    view: ['Super Admin', 'Webmaster', 'Chairperson', 'General Secretary', 'Content Manager', 'Events Manager', 'Chapter Admin'],
    create: ['Super Admin', 'Webmaster', 'Chairperson', 'General Secretary', 'Content Manager', 'Events Manager', 'Chapter Admin'],
    edit: ['Super Admin', 'Webmaster', 'Chairperson', 'General Secretary', 'Content Manager', 'Events Manager', 'Chapter Admin'],
    delete: ['Super Admin', 'Webmaster'],
    publish: ['Super Admin', 'Webmaster', 'Chairperson', 'Content Manager'],
  },
  Milestones: {
    view: ['Super Admin', 'Webmaster', 'Chairperson', 'General Secretary', 'Content Manager', 'Events Manager', 'Chapter Admin'],
    create: ['Super Admin', 'Webmaster', 'Chairperson', 'General Secretary', 'Content Manager'],
    edit: ['Super Admin', 'Webmaster', 'Chairperson', 'General Secretary', 'Content Manager'],
    delete: ['Super Admin', 'Webmaster'],
    publish: ['Super Admin', 'Webmaster'],
  },
  Achievements: {
    view: ['Super Admin', 'Webmaster', 'Chairperson', 'General Secretary', 'Content Manager', 'Events Manager', 'Chapter Admin'],
    create: ['Super Admin', 'Webmaster', 'Chairperson', 'General Secretary', 'Events Manager', 'Chapter Admin'],
    edit: ['Super Admin', 'Webmaster', 'Chairperson', 'General Secretary', 'Events Manager', 'Chapter Admin'],
    delete: ['Super Admin', 'Webmaster'],
    publish: ['Super Admin', 'Webmaster', 'Chairperson'],
  },
  Resources: {
    view: ['Super Admin', 'Webmaster', 'Chairperson', 'General Secretary', 'Content Manager', 'Events Manager', 'Chapter Admin'],
    create: ['Super Admin', 'Webmaster', 'Chairperson', 'General Secretary', 'Content Manager'],
    edit: ['Super Admin', 'Webmaster', 'Chairperson', 'General Secretary', 'Content Manager'],
    delete: ['Super Admin', 'Webmaster'],
    publish: ['Super Admin', 'Webmaster', 'Chairperson'],
  },
  Settings: {
    view: ['Super Admin', 'Webmaster', 'Chairperson'],
    create: ['Super Admin', 'Webmaster'],
    edit: ['Super Admin', 'Webmaster'],
    delete: ['Super Admin'],
    publish: ['Super Admin', 'Webmaster'],
  },
  Users: {
    view: ['Super Admin', 'Webmaster'],
    create: ['Super Admin', 'Webmaster'],
    edit: ['Super Admin', 'Webmaster'],
    delete: ['Super Admin'],
    publish: ['Super Admin'],
  },
  AuditLogs: {
    view: ['Super Admin', 'Webmaster', 'Chairperson'],
    create: ['Super Admin'],
    edit: [],
    delete: ['Super Admin'],
    publish: [],
  },
};

/**
 * Checks if a given role has permission to perform an action on a resource.
 */
export function hasPermission(role: string | null | undefined, resource: Resource, action: Action): boolean {
  if (!role) return false;
  const userRole = role as Role;
  const allowedRoles = PERMISSION_MATRIX[resource]?.[action];
  if (!allowedRoles) return false;
  return allowedRoles.includes(userRole);
}
