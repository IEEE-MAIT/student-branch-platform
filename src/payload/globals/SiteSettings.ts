/**
 * @file src/payload/globals/SiteSettings.ts
 * @description Payload CMS Global Site Settings schema for site-wide banners and branch statistics.
 * 
 * @author IEEE MAIT Webmaster & Open Source Contributors
 * @license MIT
 */

export const SiteSettingsGlobal = {
  slug: 'site-settings',
  label: 'Site Settings & Banner',
  fields: [
    {
      name: 'announcementMessage',
      type: 'text',
      defaultValue: 'Membership Drive 2025–26 is officially open! Join 150+ students advancing technology at MAIT.',
      label: 'Top Announcement Banner Message',
    },
    {
      name: 'announcementLinkText',
      type: 'text',
      defaultValue: 'Register Now →',
      label: 'Banner CTA Link Text',
    },
    {
      name: 'announcementLinkHref',
      type: 'text',
      defaultValue: '/join',
      label: 'Banner Target URL',
    },
    {
      name: 'announcementActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show Banner Site-Wide',
    },
    {
      name: 'activeMembersCount',
      type: 'text',
      defaultValue: '150+',
      label: 'Active Member Count',
    },
    {
      name: 'eventsOrganizedCount',
      type: 'text',
      defaultValue: '50+',
      label: 'Total Events Organized',
    },
  ],
};
