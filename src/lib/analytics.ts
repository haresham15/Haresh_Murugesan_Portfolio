/**
 * Privacy-First Telemetry & Analytics Dispatcher
 * Zero PII, zero cookies, zero external network beacons, zero GPU fingerprinting.
 * Used for local session telemetry, debugging, and audit events.
 */

export type PortfolioEventType =
  | 'project_open'
  | 'resume_click'
  | 'outbound_click'
  | 'contact_intent'
  | 'demo_interaction'
  | 'recruiter_mode_toggle'
  | 'scene_fallback'
  | 'tier_change'
  | 'hero_layer_select';

export interface PortfolioEvent {
  type: PortfolioEventType;
  target?: string;
  metadata?: Record<string, string | number | boolean>;
  timestamp: number;
}

class AnalyticsService {
  private events: PortfolioEvent[] = [];
  private listeners: ((event: PortfolioEvent) => void)[] = [];

  public track(type: PortfolioEventType, target?: string, metadata?: Record<string, string | number | boolean>): void {
    const event: PortfolioEvent = {
      type,
      target,
      metadata,
      timestamp: Date.now(),
    };

    this.events.push(event);

    // Limit in-memory buffer to 100 events
    if (this.events.length > 100) {
      this.events.shift();
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Telemetry] ${type}${target ? ` -> ${target}` : ''}`, metadata || '');
    }

    this.listeners.forEach((listener) => listener(event));
  }

  public subscribe(listener: (event: PortfolioEvent) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public getHistory(): readonly PortfolioEvent[] {
    return this.events;
  }
}

export const analytics = new AnalyticsService();
