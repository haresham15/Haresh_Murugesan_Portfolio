import React from 'react';

/**
 * Procedural 35mm Film Grain Overlay
 * Fixed, full-viewport SVG filter using feTurbulence to seamlessly bind
 * HTML typography and canvas viewports with cinematic analog texture.
 * Pointer-events-none ensures zero interaction interception.
 */
export const FilmGrain: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[80] select-none overflow-hidden opacity-[0.035] mix-blend-overlay"
    >
      <svg
        className="w-full h-full block"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <filter id="fractal-noise" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#fractal-noise)" />
      </svg>
    </div>
  );
};

export default FilmGrain;
