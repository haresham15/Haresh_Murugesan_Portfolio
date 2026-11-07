import React from 'react';

export type CarbonTextureType = 'forged' | 'woven' | 'hybrid' | 'light-composite';

export interface CarbonTextureOverlayProps {
  type?: CarbonTextureType;
  opacity?: number;
  className?: string;
  tint?: string;
}

export const CarbonTextureOverlay: React.FC<CarbonTextureOverlayProps> = ({
  type = 'forged',
  opacity = 0.18,
  className = '',
  tint,
}) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden z-0 ${className}`}
      aria-hidden="true"
      style={{ opacity }}
    >
      {/* 1. WOVEN CARBON FIBER (2x2 Precision Twill Weave) */}
      {(type === 'woven' || type === 'hybrid') && (
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(45deg, rgba(0, 0, 0, 0.4) 25%, transparent 25%),
              linear-gradient(-45deg, rgba(0, 0, 0, 0.4) 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, rgba(0, 0, 0, 0.4) 75%),
              linear-gradient(-45deg, transparent 75%, rgba(0, 0, 0, 0.4) 75%),
              linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
              linear-gradient(0deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
            `,
            backgroundSize: '12px 12px, 12px 12px, 12px 12px, 12px 12px, 24px 24px, 24px 24px',
            backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0px, 0 0, 0 0',
            mixBlendMode: 'overlay',
          }}
        />
      )}

      {/* 2. FORGED CARBON FIBER (Marbled Chopped-Fiber Composite Platelets) */}
      {(type === 'forged' || type === 'hybrid') && (
        <>
          {/* Base organic noise and facet platelets generated via high-density turbulence */}
          <svg className="absolute inset-0 w-full h-full opacity-60 mix-blend-color-dodge">
            <filter id="forged-platelet-filter" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.045 0.09"
                numOctaves="4"
                stitchTiles="stitch"
                result="noise"
              />
              <feColorMatrix
                type="matrix"
                values="
                  1.2  0.0  0.0  0.0  0.0
                  0.0  1.2  0.0  0.0  0.0
                  0.0  0.0  1.3  0.0  0.0
                  0.0  0.0  0.0  1.0  0.0"
                in="noise"
                result="coloredNoise"
              />
              <feDiffuseLighting
                in="coloredNoise"
                lightingColor="#FFFFFF"
                surfaceScale="1.8"
                diffuseConstant="0.8"
                result="light"
              >
                <feDistantLight azimuth="55" elevation="45" />
              </feDiffuseLighting>
              <feBlend mode="multiply" in="light" in2="noise" result="blend" />
            </filter>
            <rect width="100%" height="100%" filter="url(#forged-platelet-filter)" />
          </svg>

          {/* Anisotropic Shard Geometry Overlay (Chopped Carbon Flakes) */}
          <div
            className="absolute inset-0 w-full h-full opacity-40"
            style={{
              backgroundImage: `
                radial-gradient(ellipse at 20% 30%, rgba(255, 255, 255, 0.06) 0%, transparent 40%),
                radial-gradient(ellipse at 80% 70%, rgba(255, 255, 255, 0.05) 0%, transparent 45%),
                linear-gradient(135deg, rgba(0,0,0,0.4) 0%, transparent 50%),
                linear-gradient(225deg, rgba(255,255,255,0.03) 0%, transparent 50%)
              `,
              backgroundSize: '120px 120px, 160px 160px, 64px 64px, 80px 80px',
              mixBlendMode: 'soft-light',
            }}
          />
        </>
      )}

      {/* 3. LIGHT CERAMIC / MATRIX COMPOSITE (For Light Sections: Alabaster & Titanium-Ivory) */}
      {type === 'light-composite' && (
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(45deg, rgba(11, 11, 14, 0.025) 25%, transparent 25%),
              linear-gradient(-45deg, rgba(11, 11, 14, 0.025) 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, rgba(11, 11, 14, 0.025) 75%),
              linear-gradient(-45deg, transparent 75%, rgba(11, 11, 14, 0.025) 75%),
              radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.02) 1px, transparent 1px)
            `,
            backgroundSize: '10px 10px, 10px 10px, 10px 10px, 10px 10px, 20px 20px',
            backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px, 0 0',
            mixBlendMode: 'multiply',
          }}
        />
      )}

      {/* Optional Theme Color Tint Glow */}
      {tint && (
        <div
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 40%, ${tint} 0%, transparent 70%)`,
            mixBlendMode: 'screen',
            opacity: 0.25,
          }}
        />
      )}
    </div>
  );
};

export default CarbonTextureOverlay;
