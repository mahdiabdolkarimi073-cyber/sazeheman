import React from 'react';

type IconProps = {
  size?: number;
  color?: string;
  className?: string;
  stroke?: number;
};

const baseProps = (size: number, color: string, stroke: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: color,
  strokeWidth: stroke,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

export const IconInfoCircle = ({ size = 24, color = 'currentColor', stroke = 2, className }: IconProps) => (
  <svg {...baseProps(size, color, stroke)} className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
    <path d="M12 9h.01" />
    <path d="M11 12h1v4h1" />
  </svg>
);

export const IconCheckCircle = ({ size = 24, color = 'currentColor', stroke = 2, className }: IconProps) => (
  <svg {...baseProps(size, color, stroke)} className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
    <path d="M9 12l2 2l4 -4" />
  </svg>
);

export const IconXCircle = ({ size = 24, color = 'currentColor', stroke = 2, className }: IconProps) => (
  <svg {...baseProps(size, color, stroke)} className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
    <path d="M15 9l-6 6" />
    <path d="M9 9l6 6" />
  </svg>
);

export const IconClock = ({ size = 24, color = 'currentColor', stroke = 2, className }: IconProps) => (
  <svg {...baseProps(size, color, stroke)} className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
    <path d="M12 7v5l3 3" />
  </svg>
);

export const IconArrowRight = ({ size = 24, color = 'currentColor', stroke = 2, className }: IconProps) => (
  <svg {...baseProps(size, color, stroke)} className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12l14 0" />
    <path d="M13 18l6 -6" />
    <path d="M13 6l6 6" />
  </svg>
);

export const IconPlus = ({ size = 24, color = 'currentColor', stroke = 2, className }: IconProps) => (
  <svg {...baseProps(size, color, stroke)} className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5l0 14" />
    <path d="M5 12l14 0" />
  </svg>
);

export const IconUsers = ({ size = 24, color = 'currentColor', stroke = 2, className }: IconProps) => (
  <svg {...baseProps(size, color, stroke)} className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
    <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
  </svg>
);

export const IconBuilding = ({ size = 24, color = 'currentColor', stroke = 2, className }: IconProps) => (
  <svg {...baseProps(size, color, stroke)} className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M3 21h18" />
    <path d="M5 21V7l8 -4v18" />
    <path d="M19 21V11l-6 -4" />
    <path d="M9 9v.01" />
    <path d="M9 12v.01" />
    <path d="M9 15v.01" />
    <path d="M9 18v.01" />
  </svg>
);

export const IconHardHat = ({ size = 24, color = 'currentColor', stroke = 2, className }: IconProps) => (
  <svg {...baseProps(size, color, stroke)} className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M3 18a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v3h-18z" />
    <path d="M10 17v-5a2 2 0 1 1 4 0v5" />
    <path d="M2 18a6 6 0 0 1 20 0" />
  </svg>
);

export const IconDashboard = ({ size = 24, color = 'currentColor', stroke = 2, className }: IconProps) => (
  <svg {...baseProps(size, color, stroke)} className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M5 4h4v16h-4z" />
    <path d="M15 4h4v16h-4z" />
    <path d="M5 4h14v4h-14z" />
  </svg>
);

export const IconChevronLeft = ({ size = 24, color = 'currentColor', stroke = 2, className }: IconProps) => (
  <svg {...baseProps(size, color, stroke)} className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M15 6l-6 6l6 6" />
  </svg>
);

export const IconSearch = ({ size = 24, color = 'currentColor', stroke = 2, className }: IconProps) => (
  <svg {...baseProps(size, color, stroke)} className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3 -4.3" />
  </svg>
);

export const IconEye = ({ size = 24, color = 'currentColor', stroke = 2, className }: IconProps) => (
  <svg {...baseProps(size, color, stroke)} className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
    <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
  </svg>
);

export const IconShoppingBag = ({ size = 24, color = 'currentColor', stroke = 2, className }: IconProps) => (
  <svg {...baseProps(size, color, stroke)} className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M6.331 8h11.338a2 2 0 0 1 1.99 1.78l.834 8a2 2 0 0 1 -1.99 2.22h-13.006a2 2 0 0 1 -1.99 -2.22l.834 -8a2 2 0 0 1 1.99 -1.78z" />
    <path d="M9 11v-5a3 3 0 0 1 6 0v5" />
  </svg>
);

export const IconGavel = ({ size = 24, color = 'currentColor', stroke = 2, className }: IconProps) => (
  <svg {...baseProps(size, color, stroke)} className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M13 10l7.383 7.418a2.091 2.091 0 0 1 0 2.957a2.091 2.091 0 0 1 -2.954 0l-7.418 -7.383" />
    <path d="M9 7l-4 4l6 6l4 -4l-6 -6" />
    <path d="M3 21h18" />
  </svg>
);

export const IconMegaphone = ({ size = 24, color = 'currentColor', stroke = 2, className }: IconProps) => (
  <svg {...baseProps(size, color, stroke)} className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M3 11l18 -5v12l-18 -5z" />
    <path d="M7 12v5a2 2 0 0 0 2 2h1v-4" />
  </svg>
);

export const IconTicket = ({ size = 24, color = 'currentColor', stroke = 2, className }: IconProps) => (
  <svg {...baseProps(size, color, stroke)} className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M3 9a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v2a2 2 0 0 0 0 4v2a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-2a2 2 0 0 0 0 -4z" />
    <path d="M9 8v8" />
  </svg>
);

export const IconCreditCard = ({ size = 24, color = 'currentColor', stroke = 2, className }: IconProps) => (
  <svg {...baseProps(size, color, stroke)} className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 10h18" />
    <path d="M7 15h4" />
  </svg>
);

export const IconLogout = ({ size = 24, color = 'currentColor', stroke = 2, className }: IconProps) => (
  <svg {...baseProps(size, color, stroke)} className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
    <path d="M19 12h-12" />
    <path d="M15 8l4 4l-4 4" />
  </svg>
);

export const IconMenu = ({ size = 24, color = 'currentColor', stroke = 2, className }: IconProps) => (
  <svg {...baseProps(size, color, stroke)} className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6h16" />
    <path d="M4 12h16" />
    <path d="M4 18h16" />
  </svg>
);

export const IconX = ({ size = 24, color = 'currentColor', stroke = 2, className }: IconProps) => (
  <svg {...baseProps(size, color, stroke)} className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6l-12 12" />
    <path d="M6 6l12 12" />
  </svg>
);
