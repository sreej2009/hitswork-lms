import type { FooterColumn, NavLink } from '../types';

export const primaryNav: NavLink[] = [
  { label: 'Courses', href: '#courses' },
  { label: 'Teach on Hitswork', href: '/teach' },
  { label: 'For Business', href: '/business' },
];

export const footerColumns: FooterColumn[] = [
  {
    title: 'Quick Links',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Blog', href: '/blog' },
      { label: 'Help & Support', href: '/support' },
    ],
  },
  {
    title: 'Categories',
    links: [
      { label: 'Development', href: '/categories/development' },
      { label: 'Business', href: '/categories/business' },
      { label: 'Design', href: '/categories/design' },
      { label: 'Marketing', href: '/categories/marketing' },
      { label: 'Photography', href: '/categories/photography' },
      { label: 'IT & Software', href: '/categories/it-software' },
    ],
  },
  {
    title: 'For Business',
    links: [
      { label: 'Teach on Hitswork', href: '/teach' },
      { label: 'Enterprise Solutions', href: '/business' },
      { label: 'Partner with Us', href: '/partners' },
      { label: 'Affiliate Program', href: '/affiliates' },
    ],
  },
];

export const legalLinks: NavLink[] = [
  { label: 'Terms', href: '/terms' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Cookies', href: '/cookies' },
  { label: 'Sitemap', href: '/sitemap' },
];
