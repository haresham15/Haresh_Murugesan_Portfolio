import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';

import { allProjects, Project } from '@/content/projects';

// ---------------------------------------------------------------------------
// RABBIT-HOLE TAXONOMY CONTRACTS
// ---------------------------------------------------------------------------

export type CorePortalId = 'core-backend' | 'core-frontend';

export interface DomainModule {
  id: string;
  coreId: CorePortalId;
  label: string;
  tagline: string;
  accentColor: string;
  projectSlugs: string[];
}

export const DOMAIN_MODULES: DomainModule[] = [
  // Backend Core Domains
  {
    id: 'domain-cv-lidar',
    coreId: 'core-backend',
    label: 'Clinical Computer Vision & Imaging',
    tagline: '8.09ms Grad-CAM explainability, wound imaging, and allergy wheal pathology research',
    accentColor: '#FF2800',
    projectSlugs: ['healios', 'cv-allergy-wheal'],
  },
  {
    id: 'domain-search-nlp',
    coreId: 'core-backend',
    label: 'Hybrid Search & NLP Retrieval',
    tagline: '94.2% Hit@5 FAISS dense embeddings and hybrid BM25 pipelines',
    accentColor: '#FF4419',
    projectSlugs: ['tamiltrove', 'tutormatch'],
  },
  {
    id: 'domain-spatial-ml',
    coreId: 'core-backend',
    label: 'Spatial Econometrics & ML',
    tagline: '1st Place ASA DataFest 2026 transit analysis and classical AI search',
    accentColor: '#2563EB',
    projectSlugs: ['routerx-careline-hub', 'cs50-ai-projects'],
  },
  {
    id: 'domain-serverless-cloud',
    coreId: 'core-backend',
    label: 'Cloud & Autonomous Pipelines',
    tagline: 'Java custom collections, tree invariants, and formal contracts',
    accentColor: '#C8D2E0',
    projectSlugs: ['software-2-projects', 'software-1-projects'],
  },

  // Frontend Core Domains
  {
    id: 'domain-spatial-3d',
    coreId: 'core-frontend',
    label: '3D Spatial & Geospatial UI',
    tagline: 'Hardware-accelerated Deck.GL 3D urban market simulations',
    accentColor: '#2563EB',
    projectSlugs: ['nyc-housing-market-ai', 'philocracy', 'carstomer'],
  },
  {
    id: 'domain-telemetry-ui',
    coreId: 'core-frontend',
    label: 'Real-Time Telemetry & Simulators',
    tagline: '60 FPS dedicated Web Workers and off-main-thread physics',
    accentColor: '#FF2800',
    projectSlugs: ['apexis', 'tempo'],
  },
  {
    id: 'domain-media-streaming',
    coreId: 'core-frontend',
    label: 'Media, Brand & Productivity Platforms',
    tagline: 'Streaming platform, academic portal, DTCG design tokens, and static SSG',
    accentColor: '#C8D2E0',
    projectSlugs: ['syntinuum-podcast-website', 'murugesan-rajaram-lab', 'momwebsite', 'portfolio-website', 'anna-birthday'],
  },
];

const CORES: { id: CorePortalId; label: string; color: string }[] = [
  { id: 'core-backend', label: 'Backend, AI/ML & Compute Engines', color: '#FF2800' },
  { id: 'core-frontend', label: 'Frontend, Spatial UI & Interactive Systems', color: '#2563EB' },
];

export const SystemsCodeGraph: React.FC = () => {
  const [path, setPath] = useState<{ core: CorePortalId | null; domain: string | null; project: string | null }>({
    core: null,
    domain: null,
    project: null,
  });
  const [view, setView] = useState<'graph' | 'all'>('graph');
  const stageRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const shouldFocus = useRef(false);
  const [edges, setEdges] = useState<string[]>([]);

  const projectMap = useMemo(() => {
    const map = new Map<string, Project>();
    allProjects.forEach(project => {
      map.set(project.slug, project);
      project.aliases?.forEach(alias => map.set(alias, project));
    });
    return map;
  }, []);

  const core = CORES.find(item => item.id === path.core);
  const domain = DOMAIN_MODULES.find(item => item.id === path.domain);
  const project = path.project ? projectMap.get(path.project) : undefined;
  const domains = DOMAIN_MODULES.filter(item => item.coreId === path.core);
  const projects = domain?.projectSlugs.flatMap(slug => {
    const item = projectMap.get(slug);
    return item ? [item] : [];
  }) ?? [];

  const title = project
    ? project.title
    : domain
    ? domain.label
    : core
    ? core.label
    : `${allProjects.length} Engineered Systems`;

  const navigate = (next: typeof path) => {
    shouldFocus.current = true;
    setPath(next);
  };

  useEffect(() => {
    if (shouldFocus.current) {
      headingRef.current?.focus({ preventScroll: true });
      shouldFocus.current = false;
    }
  }, [path, view]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || view !== 'graph') return;
    // Edges use rendered anchors, so text wrapping and container resizing cannot cause drift.
    const measure = () => {
      const bounds = stage.getBoundingClientRect();
      const nodes = Array.from(stage.querySelectorAll<HTMLElement>('[data-graph-node]'));
      const next: string[] = [];
      nodes.forEach(node => {
        const parent = nodes.find(candidate => candidate.dataset.graphNode === node.dataset.parent);
        if (!parent) return;
        const a = parent.getBoundingClientRect();
        const b = node.getBoundingClientRect();
        const stacked = b.top >= a.bottom;
        const x1 = (stacked ? a.left + a.width / 2 : a.right) - bounds.left;
        const y1 = (stacked ? a.bottom : a.top + a.height / 2) - bounds.top;
        const x2 = (stacked ? b.left + b.width / 2 : b.left) - bounds.left;
        const y2 = (stacked ? b.top : b.top + b.height / 2) - bounds.top;
        next.push(stacked
          ? `M ${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2}`
          : `M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`);
      });
      setEdges(next);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    stage.querySelectorAll('[data-graph-node]').forEach(node => observer.observe(node));
    measure();
    return () => observer.disconnect();
  }, [path, view]);

  return (
    <section className="systems-graph" aria-label="Systems CodeGraph">
      <header className="graph-header">
        <div>
          <h2 className="font-serif text-3xl md:text-5xl">Systems CodeGraph</h2>
          <p>Explore the systems through their engineering domains.</p>
        </div>
        <div className="view-switch" aria-label="Archive view">
          <button
            type="button"
            aria-pressed={view === 'graph'}
            onClick={() => {
              shouldFocus.current = true;
              setView('graph');
            }}
          >
            Explore graph
          </button>
          <button
            type="button"
            aria-pressed={view === 'all'}
            onClick={() => {
              shouldFocus.current = true;
              setView('all');
            }}
          >
            All systems
          </button>
        </div>
      </header>

      <h3 ref={headingRef} tabIndex={-1} className="stage-heading font-serif text-2xl">
        {view === 'all' ? 'All engineered systems' : title}
      </h3>
      <p className="sr-only" role="status">{view === 'all' ? 'All systems' : title}</p>

      {view === 'all' ? (
        <div className="all-systems">
          {allProjects.map(item => (
            <article key={item.slug}>
              <h4 className="font-serif text-xl">
                <Link href={`/projects/${item.slug}`}>{item.title}</Link>
              </h4>
              <p>{item.year} · {item.category}</p>
              <p>{item.highlight}</p>
            </article>
          ))}
        </div>
      ) : (
        <div
          ref={stageRef}
          className={`graph-stage ${project ? 'with-dossier' : ''}`}
          data-depth={project ? 3 : domain ? 2 : core ? 1 : 0}
        >
          <svg className="graph-edges" aria-hidden="true">
            {edges.map((d, index) => (
              <path key={index} d={d} fill="none" stroke={core?.color ?? '#2563EB'} strokeWidth="1.5" opacity=".55" />
            ))}
          </svg>

          {/* Ancestry / Breadcrumb Rail (0–22% bounded desktop area) */}
          <nav className="parents" aria-label="Graph breadcrumb">
            <button
              type="button"
              className="graph-node"
              data-graph-node="origin"
              aria-current={!core ? 'step' : undefined}
              onClick={() => navigate({ core: null, domain: null, project: null })}
            >
              <span className="orb" />
              <strong>{allProjects.length} Engineered Systems</strong>
              <small>Return to origin</small>
            </button>
            {core && (
              <button
                type="button"
                className="graph-node"
                data-graph-node="core"
                data-parent="origin"
                aria-current={!domain ? 'step' : undefined}
                onClick={() => navigate({ core: core.id, domain: null, project: null })}
              >
                <span className="orb" style={{ borderColor: core.color }} />
                <strong>{core.label}</strong>
                <small>Browse domains</small>
              </button>
            )}
            {domain && (
              <button
                type="button"
                className="graph-node"
                data-graph-node="domain"
                data-parent="core"
                aria-current={!project ? 'step' : undefined}
                onClick={() => navigate({ core: path.core, domain: domain.id, project: null })}
              >
                <span className="orb" style={{ borderColor: domain.accentColor }} />
                <strong>{domain.label}</strong>
                <small>Browse projects</small>
              </button>
            )}
          </nav>

          {/* Active Nodes Cluster (22–60% bounded desktop area) */}
          <div
            key={project?.slug ?? domain?.id ?? core?.id ?? 'entry'}
            className="cluster"
            aria-label={project ? 'Selected project' : domain ? 'Projects' : core ? 'Domains' : 'Core portals'}
          >
            {!core &&
              CORES.map(item => (
                <button
                  type="button"
                  className="graph-node"
                  key={item.id}
                  data-graph-node={item.id}
                  data-parent="origin"
                  onClick={() => navigate({ core: item.id, domain: null, project: null })}
                >
                  <span className="orb" style={{ borderColor: item.color }} />
                  <strong>{item.label}</strong>
                  <small>
                    {DOMAIN_MODULES.filter(d => d.coreId === item.id).reduce((sum, d) => sum + d.projectSlugs.length, 0)} systems
                  </small>
                  <small>{DOMAIN_MODULES.filter(d => d.coreId === item.id).map(d => d.label).join(' · ')}</small>
                </button>
              ))}

            {core &&
              !domain &&
              domains.map(item => (
                <button
                  type="button"
                  className="graph-node"
                  key={item.id}
                  data-graph-node={item.id}
                  data-parent="core"
                  onClick={() => navigate({ core: path.core, domain: item.id, project: null })}
                >
                  <span className="orb" style={{ borderColor: item.accentColor }} />
                  <strong>{item.label}</strong>
                  <small>{item.tagline}</small>
                  <small>{item.projectSlugs.length} systems</small>
                </button>
              ))}

            {domain &&
              (project ? [project] : projects).map(item => (
                <button
                  type="button"
                  className="graph-node"
                  key={item.slug}
                  data-graph-node={item.slug}
                  data-parent="domain"
                  aria-pressed={project?.slug === item.slug}
                  onClick={() => navigate({ core: path.core, domain: path.domain, project: item.slug })}
                >
                  <span className="orb" />
                  <strong>{item.title}</strong>
                  <small>{item.year}</small>
                  <span className="benchmark">{item.highlight}</span>
                </button>
              ))}
          </div>

          {/* Dossier (60–96% bounded desktop area, max 480px) */}
          {project && (
            <aside
              className="dossier"
              aria-label={`${project.title} system dossier`}
              data-graph-node="dossier"
              data-parent={project.slug}
            >
              <p className="metadata">
                {domain ? `${domain.label} · ` : ''}
                {project.category} · {project.year}
              </p>
              <h4 className="font-serif text-3xl">{project.title}</h4>
              <p className="dossier-metric">{project.highlight}</p>
              <p className="narrative">{project.description}</p>
              <p className="stack">
                {project.stack
                  .split(/[,·]/)
                  .map(tech => tech.trim())
                  .filter(Boolean)
                  .join(' · ')}
              </p>
              <div className="dossier-actions">
                <Link href={`/projects/${project.slug}`} className="case-link">
                  Enter Full Case Study →
                </Link>
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    Source Repository ↗
                  </a>
                )}
                <button
                  type="button"
                  aria-label="Step Back"
                  onClick={() => navigate({ core: path.core, domain: path.domain, project: null })}
                >
                  <span aria-hidden="true">← </span>Step Back
                </button>
              </div>
            </aside>
          )}
        </div>
      )}

      <style jsx>{`
        .systems-graph {
          width: 100%;
          min-width: 0;
          color: #F4F6F9;
          padding: 2.5rem clamp(1rem, 3.5vw, 3.5rem);
        }
        .graph-header {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
        }
        .graph-header p,
        .dossier p {
          color: #C8D2E0;
          line-height: 1.7;
          margin-top: 1rem;
        }
        .view-switch {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        button {
          text-align: left;
          cursor: pointer;
        }
        button:focus-visible,
        .systems-graph :global(a:focus-visible) {
          outline: 2px solid #E6ECF5;
          outline-offset: 4px;
        }
        .view-switch button,
        .dossier-actions button {
          min-height: 44px;
          padding: 0.6rem 0.8rem;
          border-bottom: 1px solid #153875;
          color: #C8D2E0;
          transition: border-color 0.2s, color 0.2s;
        }
        .view-switch button:hover,
        .dossier-actions button:hover {
          color: #F4F6F9;
          border-color: #FF2800;
        }
        .view-switch button[aria-pressed='true'] {
          border-color: #FF2800;
          color: #F4F6F9;
          font-weight: 600;
        }
        .stage-heading {
          margin: 2rem 0;
          overflow-wrap: anywhere;
        }
        .stage-heading:focus {
          outline: none;
        }
        /* Desktop bounds: ancestry (0-22%), active nodes (22-60%), dossier (60-96%) */
        .graph-stage {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 22fr) minmax(0, 74fr);
          gap: 4%;
          align-items: center;
          min-height: 640px;
          height: auto;
        }
        .graph-stage.with-dossier {
          grid-template-columns: minmax(0, 22fr) minmax(0, 38fr) minmax(0, 36fr);
          gap: 2%;
        }
        .graph-edges {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        .parents,
        .cluster {
          position: relative;
          min-width: 0;
          display: grid;
          gap: 2rem;
          align-content: center;
        }
        .cluster {
          gap: 1.5rem;
          animation: arrive 0.35s ease-out;
        }
        .graph-node {
          position: relative;
          min-width: 0;
          width: 100%;
          min-height: 110px;
          padding: 1rem;
          border-bottom: 1px solid #153875;
          background: #03050A;
          overflow-wrap: anywhere;
          transition: border-color 0.2s, background-color 0.2s;
        }
        .graph-node:hover,
        .graph-node[aria-pressed='true'],
        .graph-node[aria-current='step'] {
          border-color: #FF2800;
          background: #060A12;
        }
        .graph-node strong {
          display: block;
          font-weight: 500;
          font-size: 1.05rem;
          line-height: 1.35;
        }
        .graph-node small {
          display: block;
          margin-top: 0.5rem;
          color: #C8D2E0;
          line-height: 1.5;
        }
        .orb {
          display: block;
          width: 20px;
          height: 20px;
          margin-bottom: 0.75rem;
          border: 2px solid #FF2800;
          border-radius: 50%;
          box-shadow: 0 0 16px #153875;
        }
        .benchmark {
          display: block;
          margin-top: 0.75rem;
          color: #C8D2E0;
          line-height: 1.5;
          font-family: monospace;
          font-size: 0.85rem;
        }
        .dossier {
          position: relative;
          min-width: 0;
          max-width: 480px;
          width: 100%;
          justify-self: center;
          overflow-wrap: anywhere;
          padding: 1.5rem 0;
          background: #03050A;
          animation: arrive 0.35s ease-out;
        }
        .dossier .metadata {
          color: #FF4419;
          font-size: 0.8rem;
          font-family: monospace;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .dossier h4 {
          margin-top: 0.5rem;
          line-height: 1.2;
        }
        .dossier .dossier-metric {
          font-size: 1.25rem;
          color: #F4F6F9;
          padding: 0.85rem 0;
          border-block: 1px solid #153875;
          font-family: monospace;
        }
        .dossier .narrative {
          font-size: 0.95rem;
          line-height: 1.7;
        }
        .stack {
          font-size: 0.8rem;
          color: #7E8B9B;
          font-family: monospace;
          margin-top: 1rem;
        }
        .dossier-actions {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }
        .dossier-actions :global(a) {
          display: block;
          min-height: 44px;
          padding: 0.8rem 1rem;
          font-size: 0.85rem;
          border: 1px solid rgba(24, 69, 139, 0.4);
          text-align: center;
          transition: background-color 0.2s, border-color 0.2s, color 0.2s;
        }
        .dossier-actions :global(a:hover) {
          border-color: #FF2800;
          color: #F4F6F9;
        }
        .dossier-actions :global(.case-link) {
          background: #FF2800;
          color: #F4F6F9;
          border-color: #FF2800;
          font-weight: 600;
        }
        .dossier-actions :global(.case-link:hover) {
          background: #FF4419;
          border-color: #FF4419;
        }
        .all-systems {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 2rem;
        }
        .all-systems article {
          min-width: 0;
          overflow-wrap: anywhere;
          padding: 1rem 0;
          border-bottom: 1px solid #153875;
        }
        .all-systems p {
          margin-top: 0.75rem;
          color: #C8D2E0;
        }
        @keyframes arrive {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        /* Below 1024px: stack breadcrumb, active node list, and dossier with normal document scrolling */
        @media (max-width: 1023px) {
          .graph-stage,
          .graph-stage.with-dossier {
            grid-template-columns: minmax(0, 1fr);
            gap: 2rem;
            min-height: 0;
          }
          .parents {
            gap: 0.75rem;
          }
          .parents .graph-node {
            min-height: 48px;
            padding: 0.75rem 1rem;
          }
          .parents .orb,
          .parents small,
          .graph-edges {
            display: none;
          }
          .dossier {
            max-width: 100%;
          }
          .all-systems {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 640px) {
          .all-systems {
            grid-template-columns: minmax(0, 1fr);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .cluster,
          .dossier {
            animation: none;
          }
          .graph-node {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
};

export default SystemsCodeGraph;
