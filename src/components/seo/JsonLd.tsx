import React from 'react';

/**
 * @file src/components/seo/JsonLd.tsx
 * @description EducationalOrganization Schema.org JSON-LD component for IEEE MAIT Student Branch.
 * 
 * Injects structured metadata into the HTML head to provide search engines with rich context
 * regarding the institutional hierarchy, parent college, chartered chapters, and social profiles.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

export interface JsonLdProps {
  /** Optional custom site URL override */
  siteUrl?: string;
}

export const JsonLd: React.FC<JsonLdProps> = ({ siteUrl }) => {
  const baseUrl = siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://ieeemait.com';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'IEEE MAIT Student Branch',
    alternateName: [
      'IEEE Student Branch MAIT',
      'IEEE Maharaja Agrasen Institute of Technology Student Branch',
      'IEEE MAIT SB',
    ],
    url: baseUrl,
    logo: `${baseUrl}/main_student_branch_logo.png`,
    image: `${baseUrl}/main_student_branch_logo.png`,
    description:
      'Official digital platform, identity, and institutional record of IEEE MAIT Student Branch at Maharaja Agrasen Institute of Technology, Delhi. Established in 2005 under IEEE Delhi Section, Region 10.',
    foundingDate: '2005',
    email: 'mait.ieee.sb@gmail.com',
    parentOrganization: {
      '@type': 'CollegeOrUniversity',
      name: 'Maharaja Agrasen Institute of Technology',
      alternateName: 'MAIT Delhi',
      url: 'https://mait.ac.in',
    },
    memberOf: {
      '@type': 'Organization',
      name: 'IEEE Delhi Section',
      alternateName: 'IEEE Region 10 (Asia-Pacific)',
      url: 'https://ieeedelhi.org',
    },
    department: [
      {
        '@type': 'Organization',
        name: 'IEEE EDS Chapter MAIT',
        alternateName: 'Electron Devices Society Student Branch Chapter',
        description: 'Advancing Solid-State Devices, Microelectronics, and Semiconductor Engineering.',
        url: `${baseUrl}/chapters/eds`,
      },
      {
        '@type': 'Organization',
        name: 'IEEE WIE Affinity Group MAIT',
        alternateName: 'Women in Engineering Student Branch Affinity Group',
        description: 'Empowering Women in Engineering, Science, and Technology.',
        url: `${baseUrl}/chapters/wie`,
      },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'PSP Area, Plot No-1, Sector-22, Rohini',
      addressLocality: 'Delhi',
      postalCode: '110086',
      addressCountry: 'IN',
    },
    sameAs: [
      'https://github.com/IEEE-MAIT',
      'https://linkedin.com/company/ieee-mait',
      'https://instagram.com/ieee_mait',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
