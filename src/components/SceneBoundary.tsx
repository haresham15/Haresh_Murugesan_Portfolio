import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  heightClass?: string;
  posterTitle?: string;
}

interface State {
  hasError: boolean;
  webGlSupported: boolean;
  contextLost: boolean;
}

export class SceneBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    webGlSupported: true,
    contextLost: false,
  };

  private canvasRef: HTMLCanvasElement | null = null;

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true, webGlSupported: false, contextLost: false };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('[SceneBoundary] Handled graphics exception:', error.message, errorInfo.componentStack);
  }

  public componentDidMount() {
    if (typeof window === 'undefined') return;

    // Detect WebGL support safely
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        this.setState({ webGlSupported: false });
      }
    } catch {
      this.setState({ webGlSupported: false });
    }

    // Attach global WebGL context loss listener
    window.addEventListener('webglcontextlost', this.handleContextLost, false);
  }

  public componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('webglcontextlost', this.handleContextLost, false);
    }
  }

  private handleContextLost = (event: Event) => {
    event.preventDefault();
    console.warn('[SceneBoundary] WebGL context lost. Reverting to static poster.');
    this.setState({ contextLost: true });
  };

  public render() {
    const { hasError, webGlSupported, contextLost } = this.state;
    const { children, fallback, heightClass = 'h-full w-full', posterTitle = 'Experimental Visual Assembly' } = this.props;

    if (hasError || !webGlSupported || contextLost) {
      if (fallback) return fallback;

      // Default dimension-matched static poster
      return (
        <div
          className={`${heightClass} flex flex-col items-center justify-center bg-surface border border-brand-blue/20 rounded-md p-6 text-center select-none relative overflow-hidden`}
          role="img"
          aria-label={posterTitle}
        >
          {/* Schematic SVG artwork matching the 3D Workbench */}
          <div className="w-full max-w-[280px] h-[180px] relative flex items-center justify-center">
            <svg viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              {/* Back structural plane */}
              <rect x="50" y="30" width="160" height="90" rx="4" fill="#0E1623" stroke="#4C8DFF" strokeWidth="1.5" strokeOpacity="0.4" />
              <line x1="50" y1="50" x2="210" y2="50" stroke="#4C8DFF" strokeWidth="1" strokeOpacity="0.2" />
              <line x1="80" y1="30" x2="80" y2="120" stroke="#4C8DFF" strokeWidth="1" strokeOpacity="0.2" />

              {/* Offset front structural plane */}
              <rect x="80" y="60" width="160" height="90" rx="4" fill="#102C4C" fillOpacity="0.9" stroke="#4C8DFF" strokeWidth="1.5" />
              
              {/* Structural markers */}
              <circle cx="110" cy="110" r="4" fill="#FF7A32" />
              <circle cx="160" cy="75" r="4" fill="#FF7A32" />
            </svg>
          </div>
          <p className="text-xs font-mono text-text-secondary mt-3">
            {posterTitle} — <span className="text-brand-orange">Static Schematic Mode</span>
          </p>
        </div>
      );
    }

    return children;
  }
}

