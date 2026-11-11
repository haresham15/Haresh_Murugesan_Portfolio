import React, { useRef, useState, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { buildTrackPath, unwrapTrackAngle, progressAtY, type TrackPoint } from './verticalTrackGeometry';
import { useMotionPreference } from '../MotionPreference';

export interface ExperienceRole {
  id: string;
  index: number;
  year: string;
  period: string;
  role: string;
  company: string;
  teamOrDivision?: string;
  leadSummary: string;
  bullets: string[];
  skillsDemonstrated: string[];
  verifiedOutcome?: string;
  side: 'left' | 'right';
  apexX: number;
  apexY: number;
  t: number;
}

export const EXPERIENCE_ROLES: ExperienceRole[] = [
  {
    id: 'cas',
    index: 0,
    year: '2026',
    period: 'Summer 2026 (May – Aug 2026)',
    role: 'Software & AI Development Intern (ACE Team)',
    company: 'Chemical Abstracts Service (CAS)',
    teamOrDivision: 'Data Analytics & Insights Division',
    leadSummary:
      'Architected serverless AWS architectures, Model Context Protocol (MCP) tooling integrations, and agentic LLM retrieval pipelines across high-throughput scientific datasets.',
    bullets: [
      'Architected serverless AWS microservices (S3, DynamoDB, Lambda) with sub-second retrieval latency.',
      'Implemented agentic workflow integrations and MCP tooling across 12 distinct internal enterprise workflows.',
      'Authored C4 system architecture specifications and standardized CI/CD pipelines enforcing strict schema validation.',
    ],
    skillsDemonstrated: ['AWS Lambda', 'DynamoDB', 'MCP Tooling', 'Agentic Workflows', 'Python', 'TypeScript', 'C4 Architecture'],
    verifiedOutcome: '12 serverless agentic workflows processing scientific metadata with sub-second retrieval.',
    side: 'left',
    apexX: 880,
    apexY: 220,
    t: 0.12,
  },
  {
    id: 'osu-research',
    index: 1,
    year: '2026',
    period: 'Aug 2026 – Present',
    role: 'Undergraduate AI & Machine Learning Researcher',
    company: 'The Ohio State University (Digital Pathology)',
    teamOrDivision: 'Digital Pathology & Clinical Diagnostics Lab',
    leadSummary:
      'Developing deep learning computer vision architectures applied to gigapixel Whole Slide Images (WSI) for automated histological tissue segmentation and explainable boundary analysis.',
    bullets: [
      'Developed deep learning computer vision segmentation pipelines reducing boundary artifacts across clinical image benchmarks.',
      'Implemented custom evaluation scripts calculating Dice coefficient and intersection-over-union (IoU) metrics against board-certified pathologist annotations.',
      'Translating computational saliency maps into explainable decision-support tools for clinical workflows.',
    ],
    skillsDemonstrated: ['Computer Vision', 'PyTorch', 'TensorFlow', 'OpenCV', 'Digital Pathology', 'Explainable AI (Grad-CAM)'],
    verifiedOutcome: 'Automated tissue feature extraction pipelines with cross-validated benchmark evaluations.',
    side: 'right',
    apexX: 460,
    apexY: 540,
    t: 0.33,
  },
  {
    id: 'honda-99p',
    index: 2,
    year: '2026',
    period: 'Feb 2026 – Present',
    role: 'Innovation Analyst',
    company: 'Center for Innovation Strategies / Honda 99P Labs',
    teamOrDivision: 'Honda 99P Labs Connected Mobility Data Accelerator',
    leadSummary:
      'Synthesized mobility telemetry and spatial datasets across 1,000+ vehicle trip models to uncover urban driving energy efficiency patterns and battery degradation trends.',
    bullets: [
      'Built and evaluated 1,000+ data models and spatial visualizations across connected-vehicle telemetry datasets in the 99P Labs ecosystem.',
      'Constructed geospatial data pipelines and interactive dashboards translating complex telemetry into clear strategic recommendations.',
      'Presented technical data architecture and predictive modeling findings directly to Honda Research Institute engineering leadership.',
    ],
    skillsDemonstrated: ['Connected Vehicle Telemetry', 'Spatial Analytics', 'Python', 'Pandas', 'Geospatial Visualization'],
    verifiedOutcome: '1,000+ telemetry models developed; strategic findings presented to Honda Research leadership.',
    side: 'left',
    apexX: 920,
    apexY: 880,
    t: 0.55,
  },
  {
    id: 'philocracy',
    index: 3,
    year: '2025–2026',
    period: 'Dec 2025 – Present',
    role: 'Co-CEO',
    company: 'Philocracy',
    teamOrDivision: '501(c)(3) Social Enterprise & Structured Deliberation',
    leadSummary:
      'Directing engineering architecture for structured deliberation argument-tree platforms while leading fiscal strategy and operations for a philanthropic social enterprise.',
    bullets: [
      'Directed engineering architecture for a structured debate platform utilizing nested argument-tree data schemas in TypeScript with zero circular dependencies.',
      'Co-leading non-profit operations, production sourcing, and community service initiatives.',
      'Reinvesting 100% of net proceeds into community outreach while maintaining lean inventory operations.',
    ],
    skillsDemonstrated: ['Next.js', 'React', 'TypeScript', 'Recursive Tree Schemas', 'Fiscal Strategy', 'Operations Management'],
    verifiedOutcome: 'Engineered nested argument-tree deliberation engine and directed product roadmap.',
    side: 'right',
    apexX: 440,
    apexY: 1220,
    t: 0.77,
  },
  {
    id: 'syntinuum',
    index: 4,
    year: '2025–2026',
    period: 'Dec 2025 – Present',
    role: 'Founder & Podcast Host / Lead Architect',
    company: 'Syntinuum & VECTOR',
    teamOrDivision: 'Frontier Intelligence Technical Journalism',
    leadSummary:
      'Hosting technology founders, AI directors, and researchers exploring system architecture, scaling dilemmas, and technical tradeoffs across 100K+ impressions.',
    bullets: [
      'Conducted long-form interviews with engineering founders, research scientists, and technology executives across healthcare, aerospace, and software.',
      'Grew listenership to over 100K+ combined cross-platform impressions across Spotify, Apple Podcasts, and YouTube.',
      'Engineered automated outreach pipelines and a custom audio-streaming web platform with continuous playback.',
    ],
    skillsDemonstrated: ['Technical Journalism', 'Audio Engineering', 'React', 'Next.js', 'System Architecture'],
    verifiedOutcome: '10+ technical founder dialogues produced; 100K+ impressions generated.',
    side: 'left',
    apexX: 860,
    apexY: 1540,
    t: 0.94,
  },
];

export const VerticalGrandPrixTrack: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const apexRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const pathRef = useRef<SVGPathElement>(null);
  const carRef = useRef<SVGGElement>(null);
  const progressRef = useRef({ t: 0 });
  const angleRef = useRef(90);
  const activeRef = useRef(0);
  const stopsRef = useRef<number[]>([]);
  const lengthRef = useRef(0);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [geometry, setGeometry] = useState<{ width: number; height: number; points: TrackPoint[]; d: string } | null>(null);
  const { isReduced } = useMotionPreference();

  const applyCarTransform = useCallback(() => {
    const path = pathRef.current;
    const car = carRef.current;
    const total = lengthRef.current;
    if (!path || !car || !total) return;

    const t = progressRef.current.t;
    const clampedT = Math.max(0, Math.min(1, t));
    const distance = clampedT * total;
    const point = path.getPointAtLength(distance);

    let rawAngle: number;
    if (t < 0 || t > 1) {
      // Off track bounds (top entry or bottom exit): car travels vertically downwards
      rawAngle = 90;
    } else {
      const behind = path.getPointAtLength(Math.max(0, distance - 2));
      const ahead = path.getPointAtLength(Math.min(total, distance + 2));
      const dx = ahead.x - behind.x;
      const dy = ahead.y - behind.y;
      rawAngle = Math.atan2(dy, dx) * 180 / Math.PI;
    }

    angleRef.current = unwrapTrackAngle(angleRef.current, rawAngle);
    const y = point.y + (t < 0 ? t * total : t > 1 ? (t - 1) * total : 0);
    const x = point.x;

    car.setAttribute('transform', `translate(${x}, ${y}) rotate(${angleRef.current})`);
    car.dataset.progress = String(t);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const validAnchors = apexRefs.current.filter((a): a is HTMLButtonElement => a !== null);
      if (validAnchors.length !== EXPERIENCE_ROLES.length) return;

      const points = validAnchors.map((anchor) => {
        const box = anchor.getBoundingClientRect();
        return {
          x: box.left + box.width / 2 - rect.left,
          y: box.top + box.height / 2 - rect.top,
        };
      });

      const entryX = rect.width >= 900 ? rect.width / 2 : points[0].x;
      const d = buildTrackPath(points, entryX, rect.height);

      setGeometry((previous) =>
        previous?.d === d && previous.width === rect.width && previous.height === rect.height
          ? previous
          : { width: rect.width, height: rect.height, points, d }
      );
    };

    const observer = new ResizeObserver(measure);
    observer.observe(container);
    Array.from(container.querySelectorAll('[data-experience-row]')).forEach((row) => observer.observe(row));

    window.addEventListener('resize', measure);
    const rafId = requestAnimationFrame(measure);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', measure);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const path = pathRef.current;
    if (!path || !geometry) return;

    timelineRef.current?.kill();
    timelineRef.current = null;
    lengthRef.current = path.getTotalLength();
    stopsRef.current = geometry.points.map((point) => progressAtY(path, lengthRef.current, point.y));
    progressRef.current.t = stopsRef.current[activeRef.current] ?? 0;
    applyCarTransform();
  }, [geometry, applyCarTransform]);

  useEffect(() => {
    if (isReduced && stopsRef.current.length) {
      timelineRef.current?.kill();
      timelineRef.current = null;
      progressRef.current.t = stopsRef.current[activeRef.current] ?? 0;
      applyCarTransform();
    }
    return () => {
      timelineRef.current?.kill();
    };
  }, [isReduced, applyCarTransform]);

  const navigateToRole = (index: number) => {
    if (index === activeRef.current && timelineRef.current?.isActive()) return;
    const target = stopsRef.current[index];
    if (target === undefined) return;

    // Rapid clicks: cancel stale timeline immediately to target latest selection cleanly
    timelineRef.current?.kill();
    timelineRef.current = null;

    const fromIndex = activeRef.current;
    activeRef.current = index;
    setActiveIndex(index);

    // Reduced motion: select immediately without continuous animation
    if (isReduced) {
      progressRef.current.t = target;
      applyCarTransform();
      return;
    }

    // Forward-only rule:
    // Moving upward (targetIndex < fromIndex): never reverse.
    // Also if target < current t, moving directly would reverse backward, so wrap forward!
    const wrap = index < fromIndex || target < progressRef.current.t;

    const timeline = gsap.timeline({
      onUpdate: applyCarTransform,
      onComplete: () => {
        timelineRef.current = null;
      },
    });
    timelineRef.current = timeline;

    if (wrap) {
      // Accelerate downward off bottom exit (t -> 1.06 in ~400ms)
      timeline.to(progressRef.current, {
        t: 1.06,
        duration: 0.4,
        ease: 'power2.in',
      });
      // Wrap to top (t = -0.06)
      timeline.set(progressRef.current, { t: -0.06 });
      // Dive into target apex in ~500ms
      timeline.to(progressRef.current, {
        t: target,
        duration: 0.5,
        ease: 'power2.out',
      });
    } else {
      // Moving downward (targetIndex > fromIndex): move forward over ~700ms
      timeline.to(progressRef.current, {
        t: target,
        duration: 0.7,
        ease: 'power2.inOut',
      });
    }
  };

  return (
    <div
      ref={containerRef}
      data-experience-track
      className="experience-track relative w-full max-w-[1380px] mx-auto py-16"
    >
      <svg
        viewBox={geometry ? `0 0 ${geometry.width} ${geometry.height}` : undefined}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        aria-hidden="true"
        style={{ visibility: geometry ? 'visible' : 'hidden', overflow: 'hidden' }}
      >
        <defs>
          {/* High-intensity forward headlight projection gradient */}
          <linearGradient id="car-headlight-glow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F4F6F9" stopOpacity="0.85" />
            <stop offset="35%" stopColor="#2563EB" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Track Layer 1: 64px Glow */}
        <path
          d={geometry?.d}
          fill="none"
          stroke="rgba(11, 30, 64, 0.6)"
          strokeWidth="64"
          strokeLinecap="round"
        />
        {/* Track Layer 2: 52px Barrier */}
        <path
          d={geometry?.d}
          fill="none"
          stroke="rgba(200, 210, 224, 0.22)"
          strokeWidth="52"
          strokeLinecap="round"
        />
        {/* Track Layer 3: 46px Asphalt */}
        <path
          d={geometry?.d}
          fill="none"
          stroke="#04070E"
          strokeWidth="46"
          strokeLinecap="round"
        />
        {/* Track Layer 4: 3px Cobalt Racing Line */}
        <path
          ref={pathRef}
          data-experience-path
          d={geometry?.d}
          fill="none"
          stroke="#2563EB"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* FIA Curbs: Red-Orange and High-Luster Silver alternating rumble strips */}
        {geometry?.points.map((point, index) => {
          const isDesktop = geometry.width >= 900;
          const offset = isDesktop ? (index % 2 === 0 ? 24 : -24) : (index % 2 === 0 ? 20 : -20);
          const curbX = point.x + offset;
          const curb = `M ${curbX} ${point.y - 28} L ${curbX} ${point.y + 28}`;
          return (
            <g key={EXPERIENCE_ROLES[index].id}>
              <path d={curb} stroke="#FF2800" strokeWidth="5" strokeLinecap="round" />
              <path d={curb} stroke="#E6ECF5" strokeWidth="5" strokeDasharray="6 6" strokeLinecap="round" />
            </g>
          );
        })}

        {/* High-Performance 76x36px Prototype Car with Double-Helix Canopy, Headlights, & Twin Slipstream Trails */}
        <g ref={carRef} data-experience-car style={{ willChange: 'transform' }}>
          {/* Twin Rear Red-Orange Exhaust Slipstream Trails */}
          <line x1="-38" y1="-10" x2="-82" y2="-10" stroke="#FF2800" strokeWidth="2.5" opacity="0.85" strokeLinecap="round" />
          <line x1="-38" y1="10" x2="-82" y2="10" stroke="#FF2800" strokeWidth="2.5" opacity="0.85" strokeLinecap="round" />
          <line x1="-38" y1="-10" x2="-62" y2="-10" stroke="#FF4419" strokeWidth="1" opacity="0.9" />
          <line x1="-38" y1="10" x2="-62" y2="10" stroke="#FF4419" strokeWidth="1" opacity="0.9" />

          {/* Machined Metallic Carbon Chassis (76px x 36px) */}
          <rect
            x="-38"
            y="-18"
            width="76"
            height="36"
            rx="6"
            fill="#060A12"
            stroke="#C8D2E0"
            strokeWidth="1.5"
          />

          {/* Aerodynamic Sidepods & Venturi Diffusers */}
          <path d="M -22 -18 L 14 -18 L 10 -14 L -22 -14 Z" fill="#0B1E40" opacity="0.8" />
          <path d="M -22 18 L 14 18 L 10 14 L -22 14 Z" fill="#0B1E40" opacity="0.8" />

          {/* Front Aero Splitter */}
          <polygon points="34,-18 42,-14 42,14 34,18" fill="#153875" stroke="#C8D2E0" strokeWidth="1" />

          {/* Rear Wing Endplates */}
          <rect x="-38" y="-20" width="6" height="40" rx="1.5" fill="#FF2800" stroke="#FF4419" strokeWidth="0.5" />

          {/* Twin High-Intensity Projector Headlights */}
          <circle cx="36" cy="-11" r="2.5" fill="#F4F6F9" stroke="#2563EB" strokeWidth="1" />
          <circle cx="36" cy="11" r="2.5" fill="#F4F6F9" stroke="#2563EB" strokeWidth="1" />
          {/* Forward Light Cones */}
          <polygon points="38,-12 62,-18 62,-4 38,-10" fill="url(#car-headlight-glow)" opacity="0.45" />
          <polygon points="38,10 62,4 62,18 38,12" fill="url(#car-headlight-glow)" opacity="0.45" />

          {/* Exposed #FF2800 Double-Helix Cockpit Canopy */}
          <ellipse cx="4" cy="0" rx="20" ry="9" fill="#03050A" stroke="#FF2800" strokeWidth="1.5" />
          {/* Strand A (Red-Orange) */}
          <path
            d="M -14 0 Q -9 -6 -4 0 T 6 0 T 16 0"
            fill="none"
            stroke="#FF2800"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          {/* Strand B (Metallic Silver) */}
          <path
            d="M -14 0 Q -9 6 -4 0 T 6 0 T 16 0"
            fill="none"
            stroke="#C8D2E0"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          {/* Base-Pair Rungs */}
          <line x1="-11" y1="-4" x2="-11" y2="4" stroke="#FF4419" strokeWidth="1.2" />
          <line x1="-6" y1="-3" x2="-6" y2="3" stroke="#2563EB" strokeWidth="1.2" />
          <line x1="-1" y1="-5" x2="-1" y2="5" stroke="#FF2800" strokeWidth="1.2" />
          <line x1="4" y1="-3" x2="4" y2="3" stroke="#C8D2E0" strokeWidth="1.2" />
          <line x1="9" y1="-5" x2="9" y2="5" stroke="#FF4419" strokeWidth="1.2" />
          <line x1="14" y1="-3" x2="14" y2="3" stroke="#2563EB" strokeWidth="1.2" />
        </g>
      </svg>

      <div className="relative z-20">
        {EXPERIENCE_ROLES.map((role, index) => {
          const active = activeIndex === index;
          return (
            <div
              key={role.id}
              data-experience-row
              className={`experience-row ${index % 2 === 0 ? 'role-left' : 'role-right'}`}
            >
              <button
                ref={(node) => {
                  apexRefs.current[index] = node;
                }}
                type="button"
                data-experience-apex
                aria-label={`Navigate to ${role.company}`}
                aria-pressed={active}
                onClick={() => navigateToRole(index)}
                className="experience-apex"
                style={{ borderColor: active ? '#FF2800' : '#2563EB' }}
              >
                <span className="sr-only">{index + 1}</span>
                <span
                  className="block w-2.5 h-2.5 rounded-full transition-colors duration-200"
                  style={{ background: active ? '#FF2800' : '#C8D2E0' }}
                />
              </button>

              <article className="experience-copy min-w-0">
                <button
                  type="button"
                  className="experience-heading w-full"
                  onClick={() => navigateToRole(index)}
                  aria-expanded={active}
                  aria-controls={`experience-detail-${role.id}`}
                >
                  <span className="block font-serif text-5xl text-[#7E8B9B] mb-3">0{index + 1}</span>
                  <span className="block text-xs font-mono text-[#FF2800] mb-2">{role.period}</span>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif leading-tight text-[#F4F6F9]">
                    {role.company}
                  </h3>
                  <span className="block text-sm font-sans text-[#C8D2E0] mt-2 font-medium">{role.role}</span>
                </button>
                <p className="text-sm sm:text-base text-[#7E8B9B] leading-relaxed mt-3">{role.leadSummary}</p>
                <div
                  id={`experience-detail-${role.id}`}
                  className="mt-4 pt-4 border-t border-[#18458B]/30 text-left"
                >
                  <ul className={`space-y-2 text-xs sm:text-sm text-[#C8D2E0] leading-relaxed list-disc ${
                    index % 2 === 0 ? 'lg:list-none lg:pl-0 pl-4' : 'pl-4'
                  }`}>
                    {role.bullets.map((bullet) => (
                      <li key={bullet} className={index % 2 === 0 ? 'lg:text-right' : 'text-left'}>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  {role.verifiedOutcome && (
                    <div className={`mt-3 pt-2 text-xs font-mono text-[#FF2800] font-semibold ${
                      index % 2 === 0 ? 'lg:text-right' : 'text-left'
                    }`}>
                      <span className="text-[#7E8B9B]">Outcome: </span>
                      {role.verifiedOutcome}
                    </div>
                  )}
                  <p className={`pt-2.5 text-xs font-mono text-[#7E8B9B] ${
                    index % 2 === 0 ? 'lg:text-right' : 'text-left'
                  }`}>
                    {role.skillsDemonstrated.join(' · ')}
                  </p>
                </div>
              </article>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .experience-track {
          container-type: inline-size;
        }
        .experience-row {
          display: grid;
          grid-template-columns: 44px minmax(0, 1fr);
          align-items: flex-start;
          min-height: 220px;
          padding: 24px 0;
          transition: background-color 0.25s ease;
        }
        .experience-apex {
          grid-column: 1;
          grid-row: 1;
          justify-self: center;
          margin-top: 6px;
          display: grid;
          place-items: center;
          width: 40px;
          height: 40px;
          min-width: 40px;
          min-height: 40px;
          border: 1px solid;
          border-radius: 50%;
          background: #03050A;
          cursor: pointer;
          transition: border-color 0.2s ease, transform 0.2s ease;
        }
        .experience-copy {
          grid-column: 2;
          grid-row: 1;
          padding-left: 14px;
          overflow-wrap: anywhere;
        }
        .experience-heading {
          text-align: left;
          background: transparent;
          border: none;
          padding: 0;
          cursor: pointer;
        }
        .experience-apex:focus-visible,
        .experience-heading:focus-visible {
          outline: 2px solid #E6ECF5;
          outline-offset: 4px;
        }
        @container (min-width: 600px) {
          .experience-row {
            grid-template-columns: 60px minmax(0, 1fr);
            padding: 32px 0;
          }
          .experience-apex {
            width: 44px;
            height: 44px;
            min-width: 44px;
            min-height: 44px;
            margin-top: 8px;
          }
          .experience-copy {
            padding-left: 20px;
          }
        }
        @container (min-width: 900px) {
          .experience-row {
            grid-template-columns: minmax(0, 5fr) minmax(180px, 2fr) minmax(0, 5fr);
            align-items: center;
            min-height: 280px;
            padding: 40px 0;
          }
          .experience-apex {
            grid-column: 2;
            margin-top: 0;
          }
          .role-left .experience-apex {
            transform: translateX(24px);
          }
          .role-right .experience-apex {
            transform: translateX(-24px);
          }
          .role-left .experience-copy {
            grid-column: 1;
            padding: 0 48px 0 0;
            text-align: right;
          }
          .role-right .experience-copy {
            grid-column: 3;
            padding: 0 0 0 48px;
            text-align: left;
          }
          .role-left .experience-heading {
            text-align: right;
          }
        }
      `}</style>
    </div>
  );
};

export default VerticalGrandPrixTrack;
