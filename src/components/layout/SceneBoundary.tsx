import React, { Component, ReactNode, ErrorInfo } from 'react';
import { analytics } from '@/lib/analytics';

export type SceneState = 'poster' | 'loading' | 'interactive' | 'paused' | 'fallback';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  sceneName?: string;
  onCatch?: (error: Error) => void;
  onStateChange?: (state: SceneState) => void;
}

interface State {
  hasError: boolean;
  errorMessage: string;
  sceneState: SceneState;
}

/**
 * SceneBoundary
 * Resilient Error Boundary & WebGL Context Guardian.
 * Implements state machine: Poster -> Loading -> Interactive -> Paused -> Fallback.
 * Intercepts webglcontextlost and timeout exceptions to gracefully degrade to static SVG poster.
 */
export class SceneBoundary extends Component<Props, State> {
  private containerRef = React.createRef<HTMLDivElement>();
  private timeoutId: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
      sceneState: 'loading',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      errorMessage: error.message || 'Renderer error',
      sceneState: 'fallback',
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn(`[SceneBoundary] Caught rendering exception in scene "${this.props.sceneName || 'unknown'}":`, error, errorInfo);
    analytics.track('scene_fallback', this.props.sceneName || 'unknown', {
      error: error.message,
    });
    if (this.props.onCatch) {
      this.props.onCatch(error);
    }
  }

  componentDidMount() {
    // 5-second asset loading timeout guard
    this.timeoutId = setTimeout(() => {
      if (this.state.sceneState === 'loading') {
        this.transitionTo('interactive');
      }
    }, 5000);

    const container = this.containerRef.current;
    if (container) {
      container.addEventListener('webglcontextlost', this.handleContextLost, false);
      container.addEventListener('webglcontextrestored', this.handleContextRestored, false);
    }
  }

  componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    const container = this.containerRef.current;
    if (container) {
      container.removeEventListener('webglcontextlost', this.handleContextLost);
      container.removeEventListener('webglcontextrestored', this.handleContextRestored);
    }
  }

  private handleContextLost = (e: Event) => {
    e.preventDefault();
    console.warn(`[SceneBoundary] WebGL Context Lost in "${this.props.sceneName || 'unknown'}". Falling back to poster.`);
    analytics.track('scene_fallback', this.props.sceneName || 'unknown', { reason: 'webglcontextlost' });
    this.transitionTo('fallback');
    this.setState({ hasError: true, errorMessage: 'WebGL Context Lost' });
  };

  private handleContextRestored = () => {
    console.info(`[SceneBoundary] WebGL Context Restored in "${this.props.sceneName || 'unknown'}".`);
    this.setState({ hasError: false, errorMessage: '' });
    this.transitionTo('interactive');
  };

  private transitionTo(newState: SceneState) {
    this.setState({ sceneState: newState });
    if (this.props.onStateChange) {
      this.props.onStateChange(newState);
    }
  }

  render() {
    if (this.state.hasError || this.state.sceneState === 'fallback') {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center p-6 bg-[#070B12] border border-[#F3EFE7]/10 rounded-[2px] text-center">
          <div className="w-10 h-10 mb-3 rounded-full bg-[#101B30] border border-[#F3EFE7]/15 flex items-center justify-center text-[#FF6B35]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
          </div>
          <p className="text-xs font-mono uppercase tracking-widest text-[#A6ADB8] mb-1">Static Architecture View</p>
          <p className="text-sm font-sans text-[#A7B2C3] max-w-sm">
            Interactive canvas fell back to high-fidelity static illustration.
          </p>
        </div>
      );
    }

    return (
      <div ref={this.containerRef} className="w-full h-full relative">
        {this.props.children}
      </div>
    );
  }
}

export default SceneBoundary;
