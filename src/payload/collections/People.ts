/**
 * @file src/payload/collections/People.ts
 * @description Payload CMS collection schema for Branch People, Faculty Counselors, SEC Officers, and Leads.
 * 
 * SECURITY & AUDIT SPECIFICATIONS:
 * - Access Control: Public read-only; mutations require active authenticated admin session (`req.user`).
 * - Timestamps: Auto-tracks `createdAt` and `updatedAt`.
 * - LifeCycle Hook: `beforeChange` auto-populates `createdBy` and `updatedBy` Officer IDs.
 * 
 * @author IEEE MAIT Webmaster & Open Source Contributors
 * @license MIT
 */

import { PersonCategory } from '../../lib/data';

export const PeopleCollection = {
  slug: 'people',
  timestamps: true,
  access: {
    read: () => true,
    create: ({ req }: any) => Boolean(req?.user),
    update: ({ req }: any) => Boolean(req?.user),
    delete: ({ req }: any) => Boolean(req?.user),
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'category', 'updatedAt', 'updatedBy'],
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
      label: 'Full Name',
    },
    {
      name: 'role',
      type: 'text',
      required: true,
      label: 'Designation / Role Title',
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: PersonCategory.SEC,
      options: [
        { label: 'Branch Counsellor', value: PersonCategory.BRANCH_COUNSELLOR },
        { label: 'Student Mentor of student branch', value: PersonCategory.STUDENT_MENTOR },
        { label: 'Senior Executive Committee', value: PersonCategory.SEC },
        { label: 'Operational Lead', value: PersonCategory.OPERATIONAL_LEAD },
        { label: 'EDS Executive Committee member', value: PersonCategory.EDS_EXECUTIVE },
        { label: 'WIE AAG Executive Committee member', value: PersonCategory.WIE_EXECUTIVE },
      ],
      label: 'Hierarchy Category',
    },
    {
      name: 'department',
      type: 'text',
      required: true,
      label: 'Academic Department / Branch',
    },
    {
      name: 'academicYear',
      type: 'text',
      required: true,
      defaultValue: '2025–26',
      label: 'Academic Term Year',
    },
    {
      name: 'imageSrc',
      type: 'text',
      label: 'Portrait Image URL (Cloudinary)',
    },
    {
      name: 'linkedIn',
      type: 'text',
      label: 'LinkedIn Profile URL',
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Short Biography',
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
