/**
 * @file src/payload/collections/Galleries.ts
 * @description Payload CMS collection schema for Photo Albums and Event Galleries.
 * 
 * AUDIT SPECIFICATIONS:
 * - `timestamps: true` auto-tracks `createdAt` and `updatedAt` timestamps.
 * - `beforeChange` hook auto-populates `createdBy` and `updatedBy` user relations for accountability.
 * 
 * @author IEEE MAIT Webmaster & Open Source Contributors
 * @license MIT
 */

export const GalleriesCollection = {
  slug: 'galleries',
  timestamps: true,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'unit', 'photoCount', 'updatedAt', 'updatedBy'],
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
      label: 'Album Title',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
    },
    {
      name: 'date',
      type: 'text',
      required: true,
      label: 'Album Date',
    },
    {
      name: 'unit',
      type: 'text',
      required: true,
      label: 'Organizing Unit',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Album Overview',
    },
    {
      name: 'photos',
      type: 'array',
      label: 'Photographs in Album',
      fields: [
        { name: 'url', type: 'text', required: true, label: 'Photo Image URL (Cloudinary)' },
        { name: 'caption', type: 'text', required: true, label: 'Photo Caption' },
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
