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
