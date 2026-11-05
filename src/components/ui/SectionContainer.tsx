import React from 'react';
import { GridCrosshair } from './EditorialPrimitives';

export type ContainerVariant = 'wide' | 'editorial' | 'reading' | 'full';
export type BackgroundMode = 'atmospheric' | 'clean' | 'technical';

export interface SectionContainerProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  as?: 'section' | 'div' | 'article' | 'header' | 'footer';
  variant?: ContainerVariant;
  bgMode?: BackgroundMode;
  bordered?: boolean;
  fiducials?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const SectionContainer = React.forwardRef<HTMLElement, SectionContainerProps>(
  (
    {
      id,
      as: Component = 'section',
      variant = 'editorial',
      bgMode = 'clean',
      bordered = false,
      fiducials = true,
      className = '',
      children,
      ...rest
    },
    ref
  ) => {
    const bgClasses: Record<BackgroundMode, string> = {
      atmospheric: 'bg-mode-atmospheric relative overflow-hidden',
      clean: 'bg-mode-clean relative',
      technical: 'bg-mode-technical relative',
    };

    const containerClasses: Record<ContainerVariant, string> = {
      wide: 'w-full max-w-[1520px] mx-auto px-6 sm:px-10 lg:px-16 relative',
      editorial: 'w-full max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-14 relative',
      reading: 'w-full max-w-[780px] mx-auto px-6 sm:px-8 relative',
      full: 'w-full mx-auto px-6 sm:px-8 relative',
    };

    const ElementTag = Component as any;

    return (
      <ElementTag
        id={id}
        ref={ref}
        className={`w-full ${bgClasses[bgMode]} ${
          bordered ? 'border-b border-[#F3EFE7]/[0.08]' : ''
        } ${className}`}
        {...rest}
      >
        <div className={containerClasses[variant]}>
          {fiducials && (
            <>
              <GridCrosshair className="absolute top-0 left-3 sm:left-6 opacity-30" />
              <GridCrosshair className="absolute top-0 right-3 sm:right-6 opacity-30" />
            </>
          )}
          {children}
        </div>
      </ElementTag>
    );
  }
);

SectionContainer.displayName = 'SectionContainer';

export default SectionContainer;
