/**
 * @file src/lib/permissions.ts
 * @description Centralized Role-Based Access Control (RBAC) Engine & Permission Matrix.
 * 
 * Defines all system modules, actions, and default permission sets for the 7 official roles:
 * 1. Super Admin
 * 2. Admin
 * 3. Event Manager
 * 4. PR/Media
 * 5. SIG Lead
 * 6. Content Editor
 * 7. Viewer
 * 
 * Supports granular role-level permission matrices + per-user custom permission overrides.
 * 
 * @author IEEE MAIT Webmaster & Security Team
 * @license MIT
 */

export type AppModule =
  | 'Events'
  | 'People'
  | 'Positions'
  | 'Achievements'
  | 'Publications'
  | 'Galleries'
  | 'Resources'
  | 'Milestones'
  | 'SIGs'
  | 'Projects'
  | 'Chapters'
  | 'Opportunities'
  | 'Banners'
  | 'SocialLinks'
  | 'Users'
  | 'Roles'
  | 'Settings'
  | 'AuditLogs'
  | 'RecycleBin';

export type AppAction =
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'restore'
  | 'publish'
  | 'approve';

export type ModulePermissions = Partial<Record<AppAction, boolean>>;
export type PermissionMatrix = Partial<Record<AppModule, ModulePermissions>>;

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
  roleId?: string | null;
  permissions?: PermissionMatrix;
  customPermissions?: PermissionMatrix | null;
}

export const ALL_MODULES: AppModule[] = [
  'Events',
  'People',
  'Positions',
  'Achievements',
  'Publications',
  'Galleries',
  'Resources',
  'Milestones',
  'SIGs',
  'Projects',
  'Chapters',
  'Opportunities',
  'Banners',
  'SocialLinks',
  'Users',
  'Roles',
  'Settings',
  'AuditLogs',
  'RecycleBin',
];

export const ALL_ACTIONS: AppAction[] = [
  'view',
  'create',
  'edit',
  'delete',
  'restore',
  'publish',
  'approve',
];

const fullAccess: ModulePermissions = {
  view: true,
  create: true,
  edit: true,
  delete: true,
  restore: true,
  publish: true,
  approve: true,
};

const viewOnly: ModulePermissions = {
  view: true,
  create: false,
  edit: false,
  delete: false,
  restore: false,
  publish: false,
  approve: false,
};

const noAccess: ModulePermissions = {
  view: false,
  create: false,
  edit: false,
  delete: false,
  restore: false,
  publish: false,
  approve: false,
};

/**
 * Default permission matrix for all 7 standard roles.
 */
export const ROLE_DEFAULT_PERMISSIONS: Record<string, PermissionMatrix> = {
  'Super Admin': {
    Events: fullAccess,
    People: fullAccess,
    Positions: fullAccess,
    Achievements: fullAccess,
    Publications: fullAccess,
    Galleries: fullAccess,
    Resources: fullAccess,
    Milestones: fullAccess,
    SIGs: fullAccess,
    Projects: fullAccess,
    Chapters: fullAccess,
    Opportunities: fullAccess,
    Banners: fullAccess,
    SocialLinks: fullAccess,
    Users: fullAccess,
    Roles: fullAccess,
    Settings: fullAccess,
    // Audit logs are completely immutable and untouchable by anyone
    AuditLogs: { view: true, create: true, edit: false, delete: false, restore: false, publish: false, approve: false },
    RecycleBin: fullAccess,
  },

  Admin: {
    Events: fullAccess,
    People: fullAccess,
    Positions: fullAccess,
    Achievements: fullAccess,
    Publications: fullAccess,
    Galleries: fullAccess,
    Resources: fullAccess,
    Milestones: fullAccess,
    SIGs: fullAccess,
    Projects: fullAccess,
    Chapters: fullAccess,
    Opportunities: fullAccess,
    Banners: fullAccess,
    SocialLinks: fullAccess,
    Users: noAccess,
    Roles: noAccess,
    Settings: viewOnly,
    AuditLogs: viewOnly,
    RecycleBin: { view: true, create: false, edit: false, delete: true, restore: true, publish: false, approve: false },
  },

  'Event Manager': {
    Events: { view: true, create: true, edit: true, delete: false, restore: false, publish: true, approve: false },
    People: viewOnly,
    Positions: viewOnly,
    Achievements: viewOnly,
    Publications: viewOnly,
    Galleries: { view: true, create: true, edit: true, delete: false, restore: false, publish: false, approve: false },
    Resources: { view: true, create: true, edit: true, delete: false, restore: false, publish: false, approve: false },
    Milestones: viewOnly,
    SIGs: viewOnly,
    Projects: viewOnly,
    Chapters: viewOnly,
    Opportunities: viewOnly,
    Banners: viewOnly,
    SocialLinks: viewOnly,
    Users: noAccess,
    Roles: noAccess,
    Settings: noAccess,
    AuditLogs: noAccess,
    RecycleBin: noAccess,
  },

  'PR/Media': {
    Events: viewOnly,
    People: viewOnly,
    Positions: viewOnly,
    Achievements: viewOnly,
    Publications: { view: true, create: true, edit: true, delete: true, restore: true, publish: true, approve: false },
    Galleries: { view: true, create: true, edit: true, delete: true, restore: true, publish: true, approve: false },
    Resources: viewOnly,
    Milestones: viewOnly,
    SIGs: viewOnly,
    Projects: viewOnly,
    Chapters: viewOnly,
    Opportunities: viewOnly,
    Banners: { view: true, create: true, edit: true, delete: false, restore: false, publish: true, approve: false },
    SocialLinks: { view: true, create: true, edit: true, delete: false, restore: false, publish: false, approve: false },
    Users: noAccess,
    Roles: noAccess,
    Settings: noAccess,
    AuditLogs: noAccess,
    RecycleBin: noAccess,
  },

  'SIG Lead': {
    Events: { view: true, create: true, edit: true, delete: false, restore: false, publish: false, approve: false },
    People: viewOnly,
    Positions: viewOnly,
    Achievements: viewOnly,
    Publications: viewOnly,
    Galleries: viewOnly,
    Resources: { view: true, create: true, edit: true, delete: false, restore: false, publish: false, approve: false },
    Milestones: viewOnly,
    SIGs: { view: true, create: false, edit: true, delete: false, restore: false, publish: false, approve: false },
    Projects: { view: true, create: true, edit: true, delete: false, restore: false, publish: false, approve: false },
    Chapters: viewOnly,
    Opportunities: viewOnly,
    Banners: viewOnly,
    SocialLinks: viewOnly,
    Users: noAccess,
    Roles: noAccess,
    Settings: noAccess,
    AuditLogs: noAccess,
    RecycleBin: noAccess,
  },

  'Content Editor': {
    Events: viewOnly,
    People: viewOnly,
    Positions: viewOnly,
    Achievements: viewOnly,
    Publications: { view: true, create: true, edit: true, delete: false, restore: false, publish: false, approve: false },
    Galleries: viewOnly,
    Resources: { view: true, create: true, edit: true, delete: false, restore: false, publish: false, approve: false },
    Milestones: viewOnly,
    SIGs: viewOnly,
    Projects: viewOnly,
    Chapters: viewOnly,
    Opportunities: { view: true, create: true, edit: true, delete: false, restore: false, publish: false, approve: false },
    Banners: viewOnly,
    SocialLinks: viewOnly,
    Users: noAccess,
    Roles: noAccess,
    Settings: noAccess,
    AuditLogs: noAccess,
    RecycleBin: noAccess,
  },

  Viewer: {
    Events: viewOnly,
    People: viewOnly,
    Positions: viewOnly,
    Achievements: viewOnly,
    Publications: viewOnly,
    Galleries: viewOnly,
    Resources: viewOnly,
    Milestones: viewOnly,
    SIGs: viewOnly,
    Projects: viewOnly,
    Chapters: viewOnly,
    Opportunities: viewOnly,
    Banners: viewOnly,
    SocialLinks: viewOnly,
    Users: noAccess,
    Roles: noAccess,
    Settings: noAccess,
    AuditLogs: noAccess,
    RecycleBin: noAccess,
  },
};

/**
 * Normalizes legacy role names to standard 7 roles.
 */
export function normalizeRoleName(roleName: string | null | undefined): string {
  if (!roleName) return 'Viewer';
  const clean = roleName.trim().toLowerCase();
  if (clean === 'super admin' || clean === 'superadmin' || clean === 'root') return 'Super Admin';
  if (clean === 'admin' || clean === 'webmaster' || clean === 'chairperson' || clean === 'general secretary' || clean === 'chapter admin') return 'Admin';
  if (clean === 'event manager' || clean === 'events manager' || clean === 'event manager lead') return 'Event Manager';
  if (clean === 'pr/media' || clean === 'pr' || clean === 'media' || clean === 'pr lead' || clean === 'creative head' || clean === 'pr head') return 'PR/Media';
  if (clean === 'sig lead' || clean === 'technical lead' || clean === 'sig head') return 'SIG Lead';
  if (clean === 'content editor' || clean === 'content manager' || clean === 'editor') return 'Content Editor';
  if (clean === 'viewer' || clean === 'guest') return 'Viewer';
  return roleName;
}

/**
 * Normalizes legacy module or alias names case-insensitively.
 */
export function normalizeModule(moduleName: string): AppModule {
  if (!moduleName) return 'Events';
  const clean = moduleName.trim().toLowerCase();
  if (clean === 'articles' || clean === 'stories' || clean === 'story' || clean === 'publications' || clean === 'publication') {
    return 'Publications';
  }
  if (clean === 'gallery' || clean === 'galleries' || clean === 'photos' || clean === 'photo') {
    return 'Galleries';
  }
  if (clean === 'events' || clean === 'event') {
    return 'Events';
  }
  if (clean === 'people' || clean === 'person' || clean === 'members' || clean === 'member') {
    return 'People';
  }
  if (clean === 'positions' || clean === 'position') {
    return 'Positions';
  }
  if (clean === 'projects' || clean === 'project') {
    return 'Projects';
  }
  if (clean === 'chapters' || clean === 'chapter') {
    return 'Chapters';
  }
  if (clean === 'achievements' || clean === 'achievement') {
    return 'Achievements';
  }
  if (clean === 'milestones' || clean === 'milestone') {
    return 'Milestones';
  }
  if (clean === 'resources' || clean === 'resource') {
    return 'Resources';
  }
  if (clean === 'opportunities' || clean === 'opportunity') {
    return 'Opportunities';
  }
  if (clean === 'banners' || clean === 'banner') {
    return 'Banners';
  }
  if (clean === 'sociallinks' || clean === 'social_links' || clean === 'sociallink' || clean === 'social-links') {
    return 'SocialLinks';
  }
  if (clean === 'users' || clean === 'user' || clean === 'adminusers' || clean === 'admin_users') {
    return 'Users';
  }
  if (clean === 'roles' || clean === 'role' || clean === 'adminroles' || clean === 'admin_roles') {
    return 'Roles';
  }
  if (clean === 'settings' || clean === 'setting' || clean === 'sitesettings' || clean === 'site_settings') {
    return 'Settings';
  }
  if (clean === 'auditlogs' || clean === 'audit_logs' || clean === 'auditlog' || clean === 'audit-logs') {
    return 'AuditLogs';
  }
  if (clean === 'recyclebin' || clean === 'recycle_bin' || clean === 'recycle-bin' || clean === 'trash') {
    return 'RecycleBin';
  }
  if (clean === 'sigs' || clean === 'sig') {
    return 'SIGs';
  }

  // Fallback match against ALL_MODULES
  const found = ALL_MODULES.find((m) => m.toLowerCase() === clean);
  return found || (moduleName as AppModule);
}

/**
 * Checks whether a given user session has permission to perform an action on a module.
 * 
 * Precedence:
 * 1. Super Admin role always has full permission (except destructive actions on AuditLogs).
 * 2. User's explicit customPermissions overrides (if present).
 * 3. User's dynamic role permissions (from database).
 * 4. Built-in default permissions for the normalized role name.
 */
export function canPerform(
  user: SessionUser | null | undefined,
  module: string | AppModule,
  action: AppAction | string
): boolean {
  if (!user) return false;

  const targetModule = normalizeModule(module as string);
  const targetAction = (action || '').toLowerCase() as AppAction;
  const normalizedRole = normalizeRoleName(user.role);

  // Security Rule: AuditLogs are completely immutable for everyone, including Super Admin
  if (targetModule === 'AuditLogs' && (targetAction === 'delete' || targetAction === 'edit' || targetAction === 'restore')) {
    return false;
  }

  // Super Admin fast-path for everything else
  if (normalizedRole === 'Super Admin') {
    return true;
  }

  // Check custom user override
  if (user.customPermissions && user.customPermissions[targetModule]?.[targetAction] !== undefined) {
    return Boolean(user.customPermissions[targetModule]?.[targetAction]);
  }

  // Check dynamic role permissions from DB
  if (user.permissions && user.permissions[targetModule]?.[targetAction] !== undefined) {
    return Boolean(user.permissions[targetModule]?.[targetAction]);
  }

  // Fallback to role defaults
  const roleDefaults = ROLE_DEFAULT_PERMISSIONS[normalizedRole];
  if (roleDefaults && roleDefaults[targetModule]?.[targetAction] !== undefined) {
    return Boolean(roleDefaults[targetModule]?.[targetAction]);
  }

  return false;
}
