import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base = { viewBox: '0 0 24 24', 'aria-hidden': true } as const;

export const FacebookIcon = (props: IconProps) => (
  <svg {...base} fill="currentColor" {...props}>
    <path d="M13.5 21v-7.6h2.6l.4-3h-3V8.5c0-.87.25-1.46 1.5-1.46h1.6V4.36A21 21 0 0 0 14.27 4.2c-2.3 0-3.87 1.4-3.87 3.97v2.23H7.8v3h2.6V21h3.1Z" />
  </svg>
);

export const XIcon = (props: IconProps) => (
  <svg {...base} fill="currentColor" {...props}>
    <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.77L17.75 3Zm-1.08 16.2h1.7L7.4 4.73H5.58L16.67 19.2Z" />
  </svg>
);

export const InstagramIcon = (props: IconProps) => (
  <svg {...base} fill="none" stroke="currentColor" strokeWidth={1.9} {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const LinkedInIcon = (props: IconProps) => (
  <svg {...base} fill="currentColor" {...props}>
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.8v1.6h.06c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.67 4.8 6.13V21h-4v-4.94c0-1.18-.02-2.7-1.64-2.7-1.65 0-1.9 1.29-1.9 2.61V21h-3.9V9.75Z" />
  </svg>
);

export const YouTubeIcon = (props: IconProps) => (
  <svg {...base} fill="currentColor" {...props}>
    <path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1c.4-1.6.5-4.8.5-4.8s0-3.2-.5-4.8ZM9.75 15.02V8.98L15.5 12l-5.75 3.02Z" />
  </svg>
);

export const socialLinks = [
  { label: 'Facebook', href: 'https://facebook.com', icon: FacebookIcon },
  { label: 'X (Twitter)', href: 'https://x.com', icon: XIcon },
  { label: 'Instagram', href: 'https://instagram.com', icon: InstagramIcon },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: LinkedInIcon },
  { label: 'YouTube', href: 'https://youtube.com', icon: YouTubeIcon },
];
