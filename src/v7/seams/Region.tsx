import React from 'react';
import type { Material, SeamKind } from '../materials/field';

/** A section root on the home page. Declares its material for CarbonField and the text tokens. */
export const MaterialSection: React.FC<{
  material: Material;
  name: string;
  children: React.ReactNode;
}> = ({ material, name, children }) => (
  <div data-material-region="" data-material={material} data-section={name}>
    {children}
  </div>
);

/** 70vh of empty space that owns the transition between two sections. */
export const Seam: React.FC<{ kind: SeamKind; from: Material; to: Material }> = ({ kind, from, to }) => (
  <div aria-hidden="true" data-material-region="" data-seam={kind} data-from={from} data-to={to} />
);
