/**
 * @file src/payload/collections/Stories.ts
 * @description Payload CMS collection schema for Stories, Articles, and Technical Event Reports.
 * 
 * AUDIT SPECIFICATIONS:
 * - `timestamps: true` auto-tracks `createdAt` and `updatedAt` timestamps.
 * - `beforeChange` hook auto-populates `createdBy` and `updatedBy` user relations for accountability.
 * 
 * @author IEEE MAIT Webmaster & Open Source Contributors
 * @license MIT
 */

import { PublicationType } from '../../lib/data';

export const StoriesCollection = {
  slug: 'stories',
  timestamps: true,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'unit', 'publishedDate', 'updatedAt', 'updatedBy'],
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
      name: 'title',
      type: 'text',
      required: true,
      label: 'Article Title',
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
      defaultValue: PublicationType.ARTICLE,
      options: [
        { label: 'Article', value: PublicationType.ARTICLE },
        { label: 'Event Report', value: PublicationType.EVENT_REPORT },
        { label: 'Announcement', value: PublicationType.ANNOUNCEMENT },
      ],
      label: 'Publication Type',
    },
    {
      name: 'author',
      type: 'text',
      required: true,
      label: 'Author Name',
    },
    {
      name: 'authorRole',
      type: 'text',
      required: true,
      label: 'Author Role Designation',
    },
    {
      name: 'publishedDate',
      type: 'text',
      required: true,
      label: 'Publication Date',
    },
    {
      name: 'readingTime',
      type: 'text',
      defaultValue: '5 min read',
      label: 'Estimated Reading Time',
    },
    {
      name: 'unit',
      type: 'text',
      required: true,
      label: 'Associated Unit',
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      label: 'Article Summary Excerpt',
    },
    {
      name: 'content',
      type: 'array',
      label: 'Article Content Paragraphs',
      fields: [
        { name: 'paragraph', type: 'textarea', required: true, label: 'Paragraph Text' },
      ],
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
