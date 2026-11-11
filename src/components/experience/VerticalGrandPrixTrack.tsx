import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';
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
  t: number; // approximate normalized t along spline
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
    company: 'The Ohio State University',
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
    company: 'Center for Innovation Strategies at OSU',
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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const carRef = useRef<SVGGElement | null>(null);
  const racingLineRef = useRef<SVGPathElement | null>(null);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [pathLength, setPathLength] = useState<number>(0);

  const { isReduced } = useMotionPreference();
  const progressRef = useRef<{ t: number }>({ t: 0.12 });
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const prevIndexRef = useRef<number>(0);

  // SVG Spline geometry: 1440 x 1750 coordinate system
  const trackPathD = useMemo(() => {
    return 'M 720 0 C 730 70, 850 130, 880 220 C 920 330, 640 440, 460 540 C 310 650, 830 760, 920 880 C 1010 1010, 560 1100, 440 1220 C 330 1340, 780 1430, 860 1540 C 910 1620, 810 1680, 720 1750';
  }, []);

  // Compute transform (x, y, angle) along the spline
  const computeCarTransform = useCallback(
    (t: number) => {
      const path = pathRef.current;
      if (!path) return { x: 880, y: 190, angle: 45 };

      const total = pathLength || path.getTotalLength() || 2000;
      if (total <= 0) return { x: 880, y: 190, angle: 45 };

      // Off bottom
      if (t > 1) {
        const pt = path.getPointAtLength(total);
        const excess = (t - 1) * total;
        return { x: pt.x, y: pt.y + excess, angle: 90 };
      }
      // Off top
      if (t < 0) {
        const pt = path.getPointAtLength(0);
        const deficit = t * total;
        return { x: pt.x, y: pt.y + deficit, angle: 90 };
      }

      const s = Math.max(0, Math.min(total, t * total));
      const pt = path.getPointAtLength(s);

      // Tangent angle
      const delta = 4.0;
      const s1 = Math.max(0, s - delta);
      const s2 = Math.min(total, s + delta);
      const p1 = path.getPointAtLength(s1);
      const p2 = path.getPointAtLength(s2);

      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

      return { x: pt.x, y: pt.y, angle };
    },
    [pathLength]
  );

  const applyCarTransform = useCallback(
    (t: number) => {
      if (!carRef.current) return;
      const tf = computeCarTransform(t);
      carRef.current.setAttribute(
        'transform',
        `translate(${tf.x.toFixed(2)}, ${tf.y.toFixed(2)}) rotate(${tf.angle.toFixed(2)})`
      );

      // Racing line glow trailing wake
      if (racingLineRef.current && pathLength > 0) {
        racingLineRef.current.setAttribute('stroke-dashoffset', `${(-t * 2200).toFixed(1)}`);
      }
    },
    [computeCarTransform, pathLength]
  );

  // Measure path length on mount
  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      setPathLength(len);
      applyCarTransform(EXPERIENCE_ROLES[0].t);
    }
  }, [applyCarTransform]);

  // Forward-Only Kinematics Controller
  const navigateToRole = useCallback(
    (targetIndex: number) => {
      setActiveIndex(targetIndex);

      if (isReduced) {
        const targetT = EXPERIENCE_ROLES[targetIndex].t;
        progressRef.current.t = targetT;
        applyCarTransform(targetT);
        prevIndexRef.current = targetIndex;
        return;
      }

      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }

      const fromIndex = prevIndexRef.current;
      prevIndexRef.current = targetIndex;
      const targetT = EXPERIENCE_ROLES[targetIndex].t;

      // 1. FORWARD PROGRESSION (Moving Downwards)
      if (targetIndex >= fromIndex) {
        const duration = 0.65 + (targetIndex - fromIndex) * 0.12;
        const tl = gsap.timeline({
          onComplete: () => {
            progressRef.current.t = targetT;
            applyCarTransform(targetT);
            timelineRef.current = null;
          },
        });

        tl.to(progressRef.current, {
          t: targetT,
          duration,
          ease: 'power2.inOut',
          onUpdate: () => {
            applyCarTransform(progressRef.current.t);
          },
        });

        timelineRef.current = tl;
        return;
      }

      // 2. NON-REVERSING WRAP-AROUND FORWARD LOOP (Moving Upwards)
      // Never drive in reverse!
      // Phase A: Blast downward off bottom exit (t -> 1.06) in 420ms
      // Phase B: Instant wrap to top entry straight (t = -0.06)
      // Phase C: Dive down into selected upper apex (-0.06 -> targetT) in 520ms
      const tl = gsap.timeline({
        onComplete: () => {
          progressRef.current.t = targetT;
          applyCarTransform(targetT);
          timelineRef.current = null;
        },
      });

      tl.to(progressRef.current, {
        t: 1.06,
        duration: 0.42,
        ease: 'power2.in',
        onUpdate: () => {
          applyCarTransform(progressRef.current.t);
        },
      });

      tl.set(progressRef.current, {
        t: -0.06,
        onComplete: () => {
          applyCarTransform(-0.06);
        },
      });

      tl.to(progressRef.current, {
        t: targetT,
        duration: 0.52,
        ease: 'power3.out',
        onUpdate: () => {
          applyCarTransform(progressRef.current.t);
        },
      });

      timelineRef.current = tl;
    },
    [isReduced, applyCarTransform]
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[1440px] mx-auto select-none py-12"
      style={{ minHeight: '1750px' }}
    >
      {/* =====================================================================
          GRAND 4-PASS OPEN-CANVAS SVG MOTORSPORT CIRCUIT
          ===================================================================== */}
      <svg
        viewBox="0 0 1440 1750"
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          {/* Active racing line gradient */}
          <linearGradient id="v-racing-line-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.1" />
            <stop offset="40%" stopColor="#FF2800" stopOpacity="1" />
            <stop offset="70%" stopColor="#FF4419" stopOpacity="1" />
            <stop offset="100%" stopColor="#C8D2E0" stopOpacity="0.4" />
          </linearGradient>

          {/* Headlight beam radial gradient */}
          <radialGradient id="headlight-beam" cx="50%" cy="0%" r="90%">
            <stop offset="0%" stopColor="rgba(200, 210, 224, 0.45)" />
            <stop offset="50%" stopColor="rgba(37, 99, 235, 0.2)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* 1. Track Bed Outer Barrier Walls (74px wide dark cobalt) */}
        <path
          d={trackPathD}
          fill="none"
          stroke="rgba(11, 30, 64, 0.75)"
          strokeWidth="74"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 2. Main 68px Dark Obsidian Asphalt Track Surface (#050912) */}
        <path
          d={trackPathD}
          fill="none"
          stroke="#050912"
          strokeWidth="68"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 3. Metallic Silver Track Boundary Edge Lines (#7E8B9B, 1.5px) */}
        <path
          d={trackPathD}
          fill="none"
          stroke="rgba(126, 139, 155, 0.35)"
          strokeWidth="66"
          strokeDasharray="2 0"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={trackPathD}
          fill="none"
          stroke="#050912"
          strokeWidth="63"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 4. Alternating Reddish-Orange (#FF2800) & Metallic Silver (#E2E8F0) FIA Apex Curbs */}
        {EXPERIENCE_ROLES.map((role) => {
          const isRoleActive = activeIndex === role.index;
          const isRoleHovered = hoveredIndex === role.index;
          const isHigh = isRoleActive || isRoleHovered;

          // Curbs hugging the inside of each apex
          const offsetDist = role.side === 'left' ? 34 : -34;
          const curbD = `M ${role.apexX + offsetDist - 25} ${role.apexY - 35} Q ${role.apexX + offsetDist} ${role.apexY} ${role.apexX + offsetDist - 25} ${role.apexY + 35}`;

          return (
            <g key={`curb-${role.id}`}>
              <path
                d={curbD}
                fill="none"
                stroke={isHigh ? '#FF2800' : '#18458B'}
                strokeWidth="10"
                strokeLinecap="round"
                className="transition-colors duration-300"
              />
              <path
                d={curbD}
                fill="none"
                stroke={isHigh ? '#F4F6F9' : '#7E8B9B'}
                strokeWidth="10"
                strokeDasharray="10 8"
                strokeLinecap="round"
              />
            </g>
          );
        })}

        {/* 5. 3px Continuous Ideal Racing Line + Trailing Telemetry Wake */}
        <path
          ref={pathRef}
          d={trackPathD}
          fill="none"
          stroke="rgba(37, 99, 235, 0.25)"
          strokeWidth="3"
          strokeDasharray="10 6"
        />
        <path
          ref={racingLineRef}
          d={trackPathD}
          fill="none"
          stroke="url(#v-racing-line-grad)"
          strokeWidth="3.5"
          strokeDasharray="320 1800"
          strokeDashoffset="0"
          opacity="0.95"
        />

        {/* 6. Precision Apex Ring Reticles */}
        {EXPERIENCE_ROLES.map((role) => {
          const isRoleActive = activeIndex === role.index;
          return (
            <g key={`reticle-${role.id}`}>
              {isRoleActive && (
                <circle
                  cx={role.apexX}
                  cy={role.apexY}
                  r="26"
                  fill="none"
                  stroke="#FF2800"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  className="animate-spin-slow origin-center"
                  style={{ transformOrigin: `${role.apexX}px ${role.apexY}px` }}
                />
              )}
              <circle
                cx={role.apexX}
                cy={role.apexY}
                r="10"
                fill="#03050A"
                stroke={isRoleActive ? '#FF2800' : '#2563EB'}
                strokeWidth="2"
              />
              <circle
                cx={role.apexX}
                cy={role.apexY}
                r="4.5"
                fill={isRoleActive ? '#FF2800' : '#C8D2E0'}
              />
            </g>
          );
        })}

        {/* =====================================================================
            GRAND-SCALE DNA-AERO PROTOTYPE CAR (76px x 36px)
            ===================================================================== */}
        <g ref={carRef} style={{ willChange: 'transform' }}>
          {/* Forward Headlight Cones */}
          <polygon
            points="0,-16 -120,-90 -80,-110 0,-18"
            fill="url(#headlight-beam)"
            opacity="0.75"
          />
          <polygon
            points="0,16 -120,90 -80,110 0,18"
            fill="url(#headlight-beam)"
            opacity="0.75"
          />

          {/* Twin Rear Red-Orange Exhaust Slipstream Trails */}
          <line x1="-36" y1="-9" x2="-80" y2="-9" stroke="#FF2800" strokeWidth="2.5" opacity="0.85" />
          <line x1="-36" y1="9" x2="-80" y2="9" stroke="#FF2800" strokeWidth="2.5" opacity="0.85" />

          {/* Machined Metallic Silver Carbon Chassis (76px x 36px) */}
          <rect
            x="-38"
            y="-18"
            width="76"
            height="36"
            rx="8"
            fill="#060A12"
            stroke="#C8D2E0"
            strokeWidth="1.5"
          />
          {/* Front Aero Wing Splitter */}
          <polygon points="34,-18 42,-14 42,14 34,18" fill="#18458B" stroke="#C8D2E0" strokeWidth="1" />
          {/* Rear Wing Endplates */}
          <rect x="-38" y="-20" width="8" height="40" rx="1.5" fill="#FF2800" />

          {/* Glowing Reddish-Orange DNA-Helix Cockpit Canopy */}
          <ellipse cx="6" cy="0" rx="18" ry="8" fill="#03050A" stroke="#FF2800" strokeWidth="1.5" />
          {/* DNA Helix Rungs inside Canopy */}
          <line x1="-4" y1="-5" x2="-4" y2="5" stroke="#FF2800" strokeWidth="1.2" />
          <line x1="2" y1="-6" x2="2" y2="6" stroke="#C8D2E0" strokeWidth="1.2" />
          <line x1="8" y1="-5" x2="8" y2="5" stroke="#2563EB" strokeWidth="1.2" />
          <line x1="14" y1="-4" x2="14" y2="4" stroke="#FF4419" strokeWidth="1.2" />
        </g>
      </svg>

      {/* =====================================================================
          UNBOXED EDITORIAL TYPOGRAPHY AT EACH APEX (Alternating Left / Right)
          ===================================================================== */}
      <div className="relative z-20 space-y-44 sm:space-y-48 pt-6">
        {EXPERIENCE_ROLES.map((role) => {
          const isRoleActive = activeIndex === role.index;
          const isRoleHovered = hoveredIndex === role.index;
          const isHighlighted = isRoleActive || isRoleHovered;

          // Position matching the apex y coordinate
          return (
            <div
              key={role.id}
              className={`w-full flex ${role.side === 'left' ? 'justify-start' : 'justify-end'} px-4 sm:px-8 lg:px-12`}
              style={{ minHeight: '220px' }}
            >
              <div
                className={`max-w-xl transition-all duration-300 cursor-pointer ${
                  role.side === 'left' ? 'text-left' : 'text-right'
                }`}
                onClick={() => navigateToRole(role.index)}
                onMouseEnter={() => setHoveredIndex(role.index)}
                onMouseLeave={() => setHoveredIndex(null)}
                role="button"
                tabIndex={0}
                aria-label={`Inspect Role: ${role.company}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigateToRole(role.index);
                  }
                }}
              >
                {/* Index Numeral + Timeframe Row */}
                <div
                  className={`flex items-center gap-4 text-xs font-mono mb-2 ${
                    role.side === 'left' ? 'justify-start' : 'justify-end'
                  }`}
                >
                  <span className="font-serif text-5xl sm:text-6xl text-[#7E8B9B] font-light leading-none">
                    0{role.index + 1}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[#FF2800] font-semibold tracking-wider uppercase text-[11px]">
                      {role.period}
                    </span>
                    <span className="text-[#7E8B9B] text-[11px]">
                      {role.year} · Verified Sector
                    </span>
                  </div>
                </div>

                {/* Organization Name (32px–40px Alabaster Serif #F4F6F9) */}
                <h3
                  className={`text-2xl sm:text-3xl lg:text-4xl font-serif leading-tight tracking-tight transition-colors duration-200 ${
                    isHighlighted ? 'text-[#F4F6F9]' : 'text-[#C8D2E0]'
                  }`}
                >
                  {role.company}
                </h3>

                {/* Role Title (14px Monospace in #FF2800 & #C8D2E0) */}
                <div className="text-sm font-mono text-[#FF2800] mt-1.5 font-medium">
                  {role.role}
                </div>

                {/* Lead Summary */}
                <p className="text-sm sm:text-base font-sans text-[#7E8B9B] leading-relaxed mt-3 max-w-lg">
                  {role.leadSummary}
                </p>

                {/* Smoothly Expanded Impact Points when Active */}
                {isRoleActive && (
                  <div
                    className={`mt-5 pt-4 border-t border-[#18458B]/30 space-y-2.5 transition-all duration-300 animate-fadeIn ${
                      role.side === 'left' ? 'text-left' : 'text-left'
                    }`}
                  >
                    <div className="text-[10px] font-mono text-[#2563EB] uppercase tracking-wider">
                      MEASURABLE ENGINEERING OUTCOMES:
                    </div>
                    <ul className="space-y-1.5 text-xs font-sans text-[#C8D2E0] leading-relaxed">
                      {role.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[#FF2800] mt-0.5 shrink-0">▸</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Stack Specification (Middle-dot separated) */}
                    <div className="pt-2 text-xs font-mono text-[#C8D2E0]/90 tracking-wide">
                      {role.skillsDemonstrated.join(' · ')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VerticalGrandPrixTrack;
