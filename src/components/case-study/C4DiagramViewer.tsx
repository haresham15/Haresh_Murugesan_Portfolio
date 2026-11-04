import React from 'react';
import { C4Diagram, C4DiagramNode, C4DiagramEdge } from '@/content/projects';

interface C4DiagramViewerProps {
  diagram: C4Diagram;
}

export const C4DiagramViewer: React.FC<C4DiagramViewerProps> = ({ diagram }) => {
  const getNodeColor = (type: C4DiagramNode['type']) => {
    switch (type) {
      case 'client':
        return { bg: 'bg-[#7DD3FC]/10', border: 'border-[#7DD3FC]/40', text: 'text-[#7DD3FC]', badge: 'bg-[#7DD3FC]/20 text-[#7DD3FC]' };
      case 'worker':
        return { bg: 'bg-[#D8B4FE]/10', border: 'border-[#D8B4FE]/40', text: 'text-[#D8B4FE]', badge: 'bg-[#D8B4FE]/20 text-[#D8B4FE]' };
      case 'api':
        return { bg: 'bg-[#34D399]/10', border: 'border-[#34D399]/40', text: 'text-[#34D399]', badge: 'bg-[#34D399]/20 text-[#34D399]' };
      case 'storage':
        return { bg: 'bg-[#FBBF24]/10', border: 'border-[#FBBF24]/40', text: 'text-[#FBBF24]', badge: 'bg-[#FBBF24]/20 text-[#FBBF24]' };
      case 'external':
        return { bg: 'bg-white/5', border: 'border-white/20', text: 'text-[#A6ADB8]', badge: 'bg-white/10 text-[#A6ADB8]' };
      default:
        return { bg: 'bg-white/5', border: 'border-white/10', text: 'text-white', badge: 'bg-white/10 text-white' };
    }
  };

  return (
    <div className="w-full rounded-2xl bg-[#0D1118] border border-white/10 p-5 sm:p-7 shadow-token-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-white/10 gap-2">
        <div>
          <h4 className="text-base sm:text-lg font-heading font-bold text-white tracking-tight">
            {diagram.title}
          </h4>
          <p className="text-xs font-sans text-[#A6ADB8] mt-0.5">
            {diagram.description}
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-[#A6ADB8]">
          <span className="w-2 h-2 rounded-full bg-[#7DD3FC]" />
          <span>C4 Level 2/3 Component Model</span>
        </div>
      </div>

      {/* Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {diagram.nodes.map((node) => {
          const colors = getNodeColor(node.type);
          return (
            <div
              key={node.id}
              className={`p-4 rounded-xl border ${colors.bg} ${colors.border} flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${colors.badge}`}>
                    {node.type}
                  </span>
                  <span className="text-[10px] font-mono text-[#A6ADB8]">{node.sublabel}</span>
                </div>
                <p className={`text-sm font-heading font-bold ${colors.text} mb-1`}>
                  {node.label}
                </p>
                <p className="text-xs font-sans text-[#A6ADB8] leading-relaxed">
                  {node.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edges / Dataflow Ledger */}
      {diagram.edges && diagram.edges.length > 0 && (
        <div className="pt-4 border-t border-white/5">
          <p className="text-[11px] font-mono uppercase tracking-widest text-[#A6ADB8]/70 mb-3">
            Inter-Component Protocol Boundaries
          </p>
          <div className="space-y-2">
            {diagram.edges.map((edge, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-xs font-mono gap-2"
              >
                <div className="flex items-center gap-2 text-[#E0E0E0]">
                  <span className="text-[#7DD3FC] font-semibold">{edge.from}</span>
                  <span className="text-[#A6ADB8]">→</span>
                  <span className="text-[#34D399] font-semibold">{edge.to}</span>
                  <span className="text-[#A6ADB8]/70 font-sans hidden md:inline">: {edge.label}</span>
                </div>
                {edge.protocol && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#A6ADB8] border border-white/10 self-start sm:self-auto">
                    {edge.protocol}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default C4DiagramViewer;

