import React, { useState } from 'react';
import Link from 'next/link';
import { usePortfolioStore } from '@/store/usePortfolioStore';
import { analytics } from '@/lib/analytics';

interface GraphSkillNode {
  id: string;
  label: string;
  category: 'ai' | 'systems' | 'frontend' | 'cloud';
  x: number;
  y: number;
  projects: { title: string; slug?: string; href: string }[];
}

const GRAPH_SKILLS: GraphSkillNode[] = [
  {
    id: 'pytorch',
    label: 'PyTorch & XAI',
    category: 'ai',
    x: 70,
    y: 80,
    projects: [
      { title: 'Healios V2 (Grad-CAM)', slug: 'healios', href: '/projects/healios' },
      { title: 'OSU Digital Pathology Research', href: '/#experience' },
    ],
  },
  {
    id: 'fastapi',
    label: 'FastAPI & Python',
    category: 'systems',
    x: 180,
    y: 50,
    projects: [
      { title: 'Healios V2 Backend', slug: 'healios', href: '/projects/healios' },
      { title: 'NYC Housing Market Engine', slug: 'nyc-housing-market-ai', href: '/projects/nyc-housing-market-ai' },
    ],
  },
  {
    id: 'webworkers',
    label: 'Web Workers & Sim',
    category: 'systems',
    x: 290,
    y: 90,
    projects: [
      { title: 'Apexis (simulator.worker.ts)', slug: 'apexis', href: '/projects/apexis' },
    ],
  },
  {
    id: 'pgvector',
    label: 'PostgreSQL & pgvector',
    category: 'ai',
    x: 90,
    y: 190,
    projects: [
      { title: 'Tempo RSD Emotional Buffer', slug: 'tempo', href: '/projects/tempo' },
    ],
  },
  {
    id: 'nextjs',
    label: 'Next.js & TypeScript',
    category: 'frontend',
    x: 200,
    y: 150,
    projects: [
      { title: 'hareshmurugesan.com', slug: 'portfolio-website', href: '/system' },
      { title: 'Apexis Intelligence Hub', slug: 'apexis', href: '/projects/apexis' },
      { title: 'Healios V2 Client', slug: 'healios', href: '/projects/healios' },
    ],
  },
  {
    id: 'aws',
    label: 'AWS (S3, Dynamo, Lambda)',
    category: 'cloud',
    x: 300,
    y: 190,
    projects: [
      { title: 'Chemical Abstracts Service (CAS)', href: '/#experience' },
    ],
  },
  {
    id: 'spatial',
    label: 'R & Spatial OSRM',
    category: 'cloud',
    x: 190,
    y: 230,
    projects: [
      { title: 'RouteRx (Careline) DataFest 1st Place', slug: 'routerx-careline', href: '/projects/routerx-careline' },
    ],
  },
];

export const SkillGraphDemo: React.FC = () => {
  const { mode } = usePortfolioStore();
  const [selectedSkillId, setSelectedSkillId] = useState<string>('pytorch');

  const isRecruiter = mode === 'recruiter';
  const activeNode = GRAPH_SKILLS.find((s) => s.id === selectedSkillId) || GRAPH_SKILLS[0];

  const handleSelect = (id: string) => {
    setSelectedSkillId(id);
    analytics.track('demo_interaction', 'skill_graph_node_select', { id });
  };

  const getCategoryColor = (cat: GraphSkillNode['category']) => {
    switch (cat) {
      case 'ai':
        return '#D8B4FE';
      case 'systems':
        return '#7DD3FC';
      case 'frontend':
        return '#5EEAD4';
      case 'cloud':
        return '#34D399';
      default:
        return '#E0E0E0';
    }
  };

  return (
    <div className="w-full rounded-3xl bg-[#0D1118] border border-white/10 p-5 sm:p-7 shadow-token-card flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-white/10 gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D8B4FE]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#D8B4FE] font-semibold">
              Cross-Disciplinary Graph
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-heading font-bold text-white tracking-tight">
            Interactive Capability Force-Graph
          </h3>
        </div>

        <span className="text-xs font-mono text-[#A6ADB8]">
          Click nodes to inspect proof codebases
        </span>
      </div>

      {/* RECRUITER / MOBILE COMPACT CHIPS VIEW */}
      {isRecruiter ? (
        <div className="space-y-4">
          <p className="text-xs font-mono text-[#7DD3FC]">
            Recruiter Mode Active: Force-Graph flattened to instant scannable capability ledger.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {GRAPH_SKILLS.map((skill) => (
              <div key={skill.id} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                <p className="text-xs font-bold text-white mb-1.5">{skill.label}</p>
                <div className="space-y-1 text-[11px] font-mono">
                  {skill.projects.map((p, idx) => (
                    <Link key={idx} href={p.href} className="text-[#7DD3FC] hover:underline block truncate">
                      → {p.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* INTERACTIVE 2D SVG FORCE GRAPH */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center mb-4">
          
          <div className="lg:col-span-8 relative w-full aspect-[16/11] rounded-2xl bg-[#050505] border border-white/10 p-4 overflow-hidden">
            <svg viewBox="0 0 380 270" className="w-full h-full" fill="none">
              
              {/* Background Cross-links connecting skills to the central hub */}
              {GRAPH_SKILLS.map((skill) => (
                <line
                  key={skill.id}
                  x1={200}
                  y1={150}
                  x2={skill.x}
                  y2={skill.y}
                  stroke={skill.id === selectedSkillId ? '#7DD3FC' : 'rgba(255,255,255,0.08)'}
                  strokeWidth={skill.id === selectedSkillId ? 2 : 1}
                  strokeDasharray={skill.id === selectedSkillId ? undefined : '3 3'}
                />
              ))}

              {/* Central Engineering Anchor */}
              <circle cx="200" cy="150" r="18" fill="#141A23" stroke="#7DD3FC" strokeWidth="2" />
              <text x="200" y="153" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontFamily="JetBrains Mono" fontWeight="bold">
                HM.CS
              </text>

              {/* Skill Nodes */}
              {GRAPH_SKILLS.map((skill) => {
                const isSelected = skill.id === selectedSkillId;
                const nodeColor = getCategoryColor(skill.category);

                return (
                  <g
                    key={skill.id}
                    transform={`translate(${skill.x}, ${skill.y})`}
                    className="cursor-pointer transition-transform"
                    onClick={() => handleSelect(skill.id)}
                  >
                    {isSelected && (
                      <circle r="16" stroke={nodeColor} strokeWidth="1.5" opacity="0.6" className="animate-ping" />
                    )}
                    <circle
                      r={isSelected ? 10 : 7}
                      fill="#050505"
                      stroke={nodeColor}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                    />
                    <text
                      x="0"
                      y={skill.y > 150 ? 22 : -14}
                      textAnchor="middle"
                      fill={isSelected ? '#FFFFFF' : '#A6ADB8'}
                      fontSize="9"
                      fontFamily="JetBrains Mono"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                    >
                      {skill.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="absolute bottom-3 left-3 text-[10px] font-mono text-[#A6ADB8] bg-[#050505]/80 px-2 py-1 rounded border border-white/5">
              Click node to trace evidence
            </div>
          </div>

          {/* Right: Active Skill Evidence Inspector (4 cols) */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-[#050505] border border-white/10 space-y-4">
            <div>
              <p className="text-[10px] font-mono uppercase text-[#7DD3FC] mb-1">Active Skill Node</p>
              <h4 className="text-lg font-heading font-bold text-white tracking-tight">
                {activeNode.label}
              </h4>
            </div>

            <div className="space-y-2 pt-3 border-t border-white/5">
              <p className="text-[11px] font-mono text-[#A6ADB8] uppercase">
                Demonstrated In {activeNode.projects.length} System{activeNode.projects.length > 1 ? 's' : ''}:
              </p>
              <div className="space-y-2">
                {activeNode.projects.map((proj, idx) => (
                  <Link
                    key={idx}
                    href={proj.href}
                    className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-[#7DD3FC]/40 transition-all flex items-center justify-between group block"
                  >
                    <span className="text-xs font-sans font-medium text-white group-hover:text-[#7DD3FC] transition-colors truncate">
                      {proj.title}
                    </span>
                    <span className="text-xs font-mono text-[#7DD3FC] shrink-0 ml-2">↗</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Footer */}
      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-[#A6ADB8]">
        <span>7 Primary Capability Verticals</span>
        <span className="text-[#34D399]">100% Grounded in Technical Codebases</span>
      </div>

    </div>
  );
};

export default SkillGraphDemo;
