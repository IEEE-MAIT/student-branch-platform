/**
 * @file src/payload/collections/Achievements.ts
 * @description Payload CMS collection schema for Branch Achievements, Awards, and Hackathon Wins.
 * 
 * SECURITY & AUDIT SPECIFICATIONS:
 * - Access Control: Public read-only; mutations require active authenticated admin session (`req.user`).
 * - Timestamps: Auto-tracks `createdAt` and `updatedAt`.
 * - LifeCycle Hook: `beforeChange` auto-populates `createdBy` and `updatedBy` Officer IDs.
 * 
 * @author IEEE MAIT Webmaster & Open Source Contributors
 * @license MIT
 */

import { AchievementCategory } from '../../lib/data';

export const AchievementsCollection = {
  slug: 'achievements',
  timestamps: true,
  access: {
    read: () => true,
    create: ({ req }: any) => Boolean(req?.user),
    update: ({ req }: any) => Boolean(req?.user),
    delete: ({ req }: any) => Boolean(req?.user),
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['year', 'title', 'conferredBy', 'category', 'updatedAt', 'updatedBy'],
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
      name: 'year',
      type: 'text',
      required: true,
      label: 'Year Conferred (e.g. 2025)',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Official Title of Award',
    },
    {
      name: 'conferredBy',
      type: 'text',
      required: true,
      label: 'Conferring Body (e.g. IEEE Delhi Section)',
    },
    {
      name: 'unitOrTeam',
      type: 'text',
      required: true,
      label: 'Associated Branch Unit / Team',
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: AchievementCategory.IEEE_RECOGNITION,
      options: [
        { label: 'IEEE Recognition', value: AchievementCategory.IEEE_RECOGNITION },
        { label: 'Competition', value: AchievementCategory.COMPETITION },
        { label: 'Award', value: AchievementCategory.AWARD },
        { label: 'Research', value: AchievementCategory.RESEARCH },
      ],
      label: 'Category',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Details & Citation Description',
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
