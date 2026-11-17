import type { NextRouter } from 'next/router';

/**
 * Progressive View Transitions API helper.
 * When supported by the browser and reduced-motion is not requested,
 * routes navigate inside document.startViewTransition for smooth cross-fades
 * and shared typography interpolation.
 */
export function navigateWithTransition(router: NextRouter, href: string, isReduced = false) {
  if (
    !isReduced &&
    typeof document !== 'undefined' &&
    'startViewTransition' in document &&
    typeof (document as unknown as { startViewTransition: (cb: () => Promise<boolean>) => void }).startViewTransition === 'function'
  ) {
    (document as unknown as { startViewTransition: (cb: () => Promise<boolean>) => void }).startViewTransition(() => {
      return router.push(href);
    });
  } else {
    router.push(href);
  }
}

/**
 * Returns deterministic CSS property for view-transition-name.
 */
export function viewTransitionStyle(name: string): React.CSSProperties {
  return {
    viewTransitionName: name.replace(/[^a-zA-Z0-9_-]/g, '-'),
  } as React.CSSProperties;
}
