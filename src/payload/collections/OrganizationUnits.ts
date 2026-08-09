/**
 * @file src/payload/collections/OrganizationUnits.ts
 * @description Payload CMS collection schema for Chapters and Affinity Groups (WIE, EDS, etc.).
 * 
 * SECURITY & AUDIT SPECIFICATIONS:
 * - Access Control: Public read-only; mutations require active authenticated admin session (`req.user`).
 * - Timestamps: Auto-tracks `createdAt` and `updatedAt`.
 * - LifeCycle Hook: `beforeChange` auto-populates `createdBy` and `updatedBy` Officer IDs.
 * 
 * @author IEEE MAIT Webmaster & Open Source Contributors
 * @license MIT
 */

import { ChapterType } from '../../lib/data';

export const OrganizationUnitsCollection = {
  slug: 'organization-units',
  timestamps: true,
  access: {
    read: () => true,
    create: ({ req }: any) => Boolean(req?.user),
    update: ({ req }: any) => Boolean(req?.user),
    delete: ({ req }: any) => Boolean(req?.user),
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'type', 'establishedYear', 'updatedAt', 'updatedBy'],
  },
  hooks: {
    beforeChange: [
      ({ req, operation, data }: any) => {
        if (req.user) {
          if (operation === 'create') {
            data.createdBy = req.user.id;
          }
          data.updatedBy = req.user.id;
        }
        return data;
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Unit Display Name',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: ChapterType.TECHNICAL_CHAPTER,
      options: [
        { label: 'Affinity Group', value: ChapterType.AFFINITY_GROUP },
        { label: 'Technical Chapter', value: ChapterType.TECHNICAL_CHAPTER },
      ],
      label: 'Classification Type',
    },
    {
      name: 'parentSociety',
      type: 'text',
      required: true,
      label: 'Global IEEE Parent Society',
    },
    {
      name: 'establishedYear',
      type: 'text',
      required: true,
      label: 'Established Year at MAIT',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Overview Description',
    },
    {
      name: 'mission',
      type: 'textarea',
      required: true,
      label: 'Mission Statement',
    },
    {
      name: 'memberCount',
      type: 'text',
      label: 'Current Member Count',
    },
    {
      name: 'eventCount',
      type: 'text',
      label: 'Total Events Organized',
    },
    {
      name: 'leaderName',
      type: 'text',
      label: 'Student Chair Name',
    },
    {
      name: 'leaderRole',
      type: 'text',
      label: 'Student Chair Designation',
    },
    {
      name: 'updatedBy',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      label: 'Last Updated By (Officer ID)',
    },
    {
      name: 'createdBy',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      label: 'Created By (Officer ID)',
    },
  ],
};
