import React from 'react';

export const AmbientBackdrop: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-canvas" aria-hidden="true">
      {/* Subtle Architectural Grid Texture */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(rgba(76, 141, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(76, 141, 255, 0.2) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />
    </div>
  );
};
