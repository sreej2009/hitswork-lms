import type { FooterColumn, NavLink } from '../types';

export const primaryNav: NavLink[] = [
  { label: 'Courses', href: '/courses' },
  { label: 'Teach on Hitswork', href: '/teach' },
  { label: 'For Business', href: '/business' },
];

export const footerColumns: FooterColumn[] = [
  {
    title: 'Quick Links',
    links: [
      { label: 'About Hitswork', href: '/about' },
      { label: 'Courses', href: '/courses' },
      { label: 'Help Center', href: '/help' },
      { label: 'Contact', href: '/contact' },
      { label: 'Careers', href: '/careers' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Categories',
    links: [
      { label: 'Development', href: '/courses?category=development' },
      { label: 'Business', href: '/courses?category=business' },
      { label: 'Design', href: '/courses?category=design' },
      { label: 'Marketing', href: '/courses?category=marketing' },
      { label: 'Photography', href: '/courses?category=photography' },
      { label: 'IT & Software', href: '/courses?category=it-software' },
    ],
  },
  {
    title: 'Work With Us',
    links: [
      { label: 'Teach on Hitswork', href: '/teach' },
      { label: 'For Business', href: '/business' },
      { label: 'Partner with Us', href: '/partners' },
      { label: 'Affiliate Program', href: '/affiliates' },
    ],
  },
];

/** Secondary links shown in the mobile drawer. */
export const supportNav: NavLink[] = [
  { label: 'About Hitswork', href: '/about' },
  { label: 'Help Center', href: '/help' },
  { label: 'Contact Us', href: '/contact' },
];

export const legalLinks: NavLink[] = [
  { label: 'Terms', href: '/terms' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Cookies', href: '/cookies' },
  { label: 'Sitemap', href: '/sitemap' },
];
