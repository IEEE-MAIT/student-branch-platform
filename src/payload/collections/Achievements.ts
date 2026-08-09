/**
 * @file src/payload/collections/Achievements.ts
 * @description Payload CMS collection schema for Branch Achievements, Awards, and Hackathon Wins.
 * 
 * AUDIT SPECIFICATIONS:
 * - `timestamps: true` auto-tracks `createdAt` and `updatedAt` timestamps.
 * - `beforeChange` hook auto-populates `createdBy` and `updatedBy` user relations for accountability.
 * 
 * @author IEEE MAIT Webmaster & Open Source Contributors
 * @license MIT
 */

import { AchievementCategory } from '../../lib/data';

export const AchievementsCollection = {
  slug: 'achievements',
  timestamps: true,
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
