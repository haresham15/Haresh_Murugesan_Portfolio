import React from 'react';

interface GridCrosshairProps {
  className?: string;
  active?: boolean;
  size?: number;
}

export const GridCrosshair: React.FC<GridCrosshairProps> = ({
  className = '',
  active = false,
  size = 9,
}) => {
  const strokeColor = active ? '#FF6B2B' : '#F4EFE6';
  const strokeOpacity = active ? 0.9 : 0.35;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 9 9"
      fill="none"
      className={`pointer-events-none select-none shrink-0 ${className}`}
      aria-hidden="true"
    >
      <line x1="4.5" y1="0" x2="4.5" y2="9" stroke={strokeColor} strokeOpacity={strokeOpacity} strokeWidth="1" />
      <line x1="0" y1="4.5" x2="9" y2="4.5" stroke={strokeColor} strokeOpacity={strokeOpacity} strokeWidth="1" />
    </svg>
  );
};

export default GridCrosshair;

