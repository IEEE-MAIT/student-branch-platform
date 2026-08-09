/**
 * @file src/payload/collections/Events.ts
 * @description Payload CMS collection schema for Branch & Chapter Events, Workshops, and Seminars.
 * 
 * AUDIT SPECIFICATIONS:
 * - `timestamps: true` auto-tracks `createdAt` and `updatedAt` timestamps.
 * - `beforeChange` hook auto-populates `createdBy` and `updatedBy` user relations for accountability.
 * 
 * @author IEEE MAIT Webmaster & Open Source Contributors
 * @license MIT
 */

import { EventCategory, EventStatus, OrganizingUnit, OrganizingUnitSlug } from '../../lib/data';

export const EventsCollection = {
  slug: 'events',
  timestamps: true,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'unit', 'category', 'updatedAt', 'updatedBy'],
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
      label: 'Event Title',
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
      label: 'Event Date (e.g. AUG 20, 2026)',
    },
    {
      name: 'time',
      type: 'text',
      label: 'Event Time (e.g. 2:00 PM – 5:00 PM)',
    },
    {
      name: 'venue',
      type: 'text',
      required: true,
      label: 'Venue / Campus Location',
    },
    {
      name: 'academicYear',
      type: 'text',
      required: true,
      defaultValue: '2025–26',
      label: 'Academic Term Year',
    },
    {
      name: 'unit',
      type: 'select',
      required: true,
      defaultValue: OrganizingUnit.SB,
      options: [
        { label: 'IEEE MAIT SB', value: OrganizingUnit.SB },
        { label: 'WIE Affinity Group', value: OrganizingUnit.WIE },
        { label: 'IEEE EDS Chapter', value: OrganizingUnit.EDS },
      ],
      label: 'Organizing Unit',
    },
    {
      name: 'unitSlug',
      type: 'select',
      required: true,
      defaultValue: OrganizingUnitSlug.SB,
      options: [
        { label: 'Student Branch (sb)', value: OrganizingUnitSlug.SB },
        { label: 'Women in Engineering (wie)', value: OrganizingUnitSlug.WIE },
        { label: 'Electron Devices Society (eds)', value: OrganizingUnitSlug.EDS },
      ],
      label: 'Unit Slug',
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: EventCategory.WORKSHOP,
      options: [
        { label: 'Technical Workshop', value: EventCategory.WORKSHOP },
        { label: 'Panel Discussion', value: EventCategory.PANEL },
        { label: 'Branch Event', value: EventCategory.BRANCH_EVENT },
        { label: 'Flagship Event', value: EventCategory.FLAGSHIP },
        { label: 'Competition', value: EventCategory.COMPETITION },
      ],
      label: 'Category Tag',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: EventStatus.UPCOMING,
      options: [
        { label: 'Upcoming Event', value: EventStatus.UPCOMING },
        { label: 'Past Event', value: EventStatus.PAST },
      ],
      label: 'Lifecycle Status',
    },
    {
      name: 'registrationLink',
      type: 'text',
      label: 'External Registration Form URL (Google Form / IEEE Portal)',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Event Description',
    },
    {
      name: 'imageSrc',
      type: 'text',
      label: 'Cover Poster Image URL (Cloudinary)',
    },
    {
      name: 'speakers',
      type: 'array',
      label: 'Featured Speakers',
      fields: [
        { name: 'name', type: 'text', required: true, label: 'Speaker Name' },
        { name: 'title', type: 'text', required: true, label: 'Title / Role' },
        { name: 'organization', type: 'text', required: true, label: 'Organization' },
      ],
    },
    {
      name: 'schedule',
      type: 'array',
      label: 'Event Schedule Agenda',
      fields: [
        { name: 'time', type: 'text', required: true, label: 'Time Slot' },
        { name: 'activity', type: 'text', required: true, label: 'Activity Description' },
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
