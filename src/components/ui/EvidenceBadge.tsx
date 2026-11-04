import React, { useState } from 'react';
import { getEvidence } from '@/content/evidence';

interface EvidenceBadgeProps {
  evidenceId: string;
  fallbackValue?: string;
  fallbackLabel?: string;
}

export const EvidenceBadge: React.FC<EvidenceBadgeProps> = ({
  evidenceId,
  fallbackValue,
  fallbackLabel,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const record = getEvidence(evidenceId);

  const displayValue = record?.value || fallbackValue || 'Verified';
  const displayLabel = record?.metricLabel || fallbackLabel || 'Metric';

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#7DD3FC]/10 border border-[#7DD3FC]/30 text-xs font-mono text-[#7DD3FC] hover:bg-[#7DD3FC]/20 hover:border-[#7DD3FC]/50 transition-all text-left"
        aria-label={`Evidence metric: ${displayLabel} ${displayValue}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC]" />
        <span className="font-semibold">{displayValue}</span>
        <span className="text-[#A6ADB8]">({displayLabel})</span>
        <span className="text-[10px] text-[#7DD3FC]/70 underline decoration-dotted">Proof</span>
      </button>

      {/* Methodology Context Tooltip */}
      {showTooltip && record && (
        <div
          role="tooltip"
          className="absolute bottom-full left-0 mb-2 w-72 sm:w-80 p-3.5 rounded-xl bg-[#0D1118] border border-[#7DD3FC]/40 shadow-2xl z-50 text-xs font-sans text-[#E0E0E0] animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 font-mono text-[11px]">
            <span className="text-[#7DD3FC] font-semibold">{record.metricLabel}</span>
            <span className="text-[#A6ADB8]">Verified: {record.lastVerified}</span>
          </div>
          <p className="font-semibold text-white mb-1.5">{record.claim}</p>
          <p className="text-[#A6ADB8] leading-relaxed mb-2 text-[11px]">
            <strong className="text-[#E0E0E0]">Methodology:</strong> {record.methodology}
          </p>
          <p className="text-[#A6ADB8] leading-relaxed mb-1.5 text-[11px]">
            <strong className="text-[#E0E0E0]">Testbench:</strong> {record.hardwareOrEnv}
          </p>
          {record.limitations && (
            <p className="text-[#FBBF24]/90 text-[10px] leading-tight mt-1 border-t border-white/5 pt-1.5">
              <em>Bounds:</em> {record.limitations}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default EvidenceBadge;

