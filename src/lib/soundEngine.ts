/**
 * Procedural Web Audio Sound Engine (Zero external assets).
 * Synthesizes a crisp, subtle 3ms mechanical impulse/tick using native AudioContext.
 * Muted by default; user opt-in via header toggle.
 */

type SoundListener = (enabled: boolean) => void;

class SoundEngine {
  private audioCtx: AudioContext | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private enabled: boolean = false;
  private listeners: Set<SoundListener> = new Set();
  private lastTickTime: number = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('haresh-sound-enabled');
        this.enabled = stored === 'true';
      } catch {
        this.enabled = false;
      }
    }
  }

  private initContext() {
    if (this.audioCtx) return;
    if (typeof window === 'undefined') return;

    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return;

      this.audioCtx = new AudioCtxClass();

      // Pre-synthesize an ultra-short 3ms noise buffer for zero runtime allocation
      const sampleRate = this.audioCtx.sampleRate;
      const bufferSize = Math.max(1, Math.floor(sampleRate * 0.004)); // ~3.5ms
      this.noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, sampleRate);
      const output = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // High-density metallic noise with rapid linear fade
        output[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }
    } catch {
      // AudioContext unavailable or blocked
      this.audioCtx = null;
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('haresh-sound-enabled', String(val));
      } catch {
        // localStorage restricted
      }
    }
    if (val) {
      this.initContext();
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
      this.playMechanicalTick();
    }
    this.listeners.forEach((l) => l(this.enabled));
  }

  public toggle(): boolean {
    this.setEnabled(!this.enabled);
    return this.enabled;
  }

  public subscribe(listener: SoundListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Play an ultra-short 3ms mechanical tick with a high-pass acoustic profile.
   * Throttled to at most once per 28ms to prevent audio spam on high-speed gestures.
   */
  public playMechanicalTick(pitchVariance = 1.0) {
    if (!this.enabled) return;

    const now = performance.now();
    if (now - this.lastTickTime < 28) return;
    this.lastTickTime = now;

    this.initContext();
    if (!this.audioCtx || !this.noiseBuffer) return;

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
      return;
    }

    try {
      const ctx = this.audioCtx;
      const t = ctx.currentTime;

      const source = ctx.createBufferSource();
      source.buffer = this.noiseBuffer;
      source.playbackRate.value = 0.95 + Math.random() * 0.1 * pitchVariance;

      // High-pass filter gives it that crisp metallic tactile click
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(2800, t);

      // Micro exponential decay envelope (3ms) with gentle max gain (0.04)
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.04, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.0035);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      source.start(t);
      source.stop(t + 0.004);
    } catch {
      // Audio execution failed gracefully
    }
  }
}

export const soundEngine = new SoundEngine();
