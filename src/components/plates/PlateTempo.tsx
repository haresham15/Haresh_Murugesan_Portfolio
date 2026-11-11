import React, { useState } from 'react';

export type TempoTab = 'buffer' | 'statemachine' | 'security';

interface BufferSlot {
  id: number;
  label: string;
  category: 'crisis' | 'burnout' | 'normal' | 'empty';
  timestamp: string;
}

const INITIAL_SLOTS: BufferSlot[] = [
  { id: 0, label: 'PR Review Terseness Alert', category: 'burnout', timestamp: '14:22:01' },
  { id: 1, label: 'Client Delivery Email Draft', category: 'normal', timestamp: '14:22:03' },
  { id: 2, label: 'Acute Stress Intercept', category: 'crisis', timestamp: '14:22:05' },
  { id: 3, label: 'Sprint Planning Summary', category: 'normal', timestamp: '14:22:08' },
  { id: 4, label: 'Unread Feedback Freeze', category: 'burnout', timestamp: '14:22:11' },
  { id: 5, label: 'Empty Slot', category: 'empty', timestamp: '--:--:--' },
  { id: 6, label: 'Empty Slot', category: 'empty', timestamp: '--:--:--' },
  { id: 7, label: 'Empty Slot', category: 'empty', timestamp: '--:--:--' },
  { id: 8, label: 'Empty Slot', category: 'empty', timestamp: '--:--:--' },
  { id: 9, label: 'Empty Slot', category: 'empty', timestamp: '--:--:--' },
  { id: 10, label: 'Empty Slot', category: 'empty', timestamp: '--:--:--' },
  { id: 11, label: 'Empty Slot', category: 'empty', timestamp: '--:--:--' },
];

export const PlateTempo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TempoTab>('buffer');
  const [slots, setSlots] = useState<BufferSlot[]>(INITIAL_SLOTS);
  const [headIndex, setHeadIndex] = useState<number>(4);
  const [isInjecting, setIsInjecting] = useState<boolean>(false);
  const [simState, setSimState] = useState<number>(1); // 1: Intercept, 2: Triage, 3: Classify, 4: Persist, 5: Dispatch
  const [auditVerified, setAuditVerified] = useState<boolean>(true);

  const handleSimulatePacket = () => {
    setIsInjecting(true);
    const samplePackets: { label: string; category: 'crisis' | 'burnout' | 'normal' }[] = [
      { label: 'High Priority Production Slack Trigger', category: 'crisis' },
      { label: 'Weekly Status Report Draft', category: 'normal' },
      { label: 'Cognitive Fatigue Intercept', category: 'burnout' },
    ];

    let nextHead = headIndex;
    samplePackets.forEach((pkt, i) => {
      setTimeout(() => {
        nextHead = (nextHead + 1) % slots.length;
        setHeadIndex(nextHead);
        setSlots((prev) => {
          const updated = [...prev];
          const nowTime = new Date().toTimeString().slice(0, 8);
          updated[nextHead] = {
            id: nextHead,
            label: pkt.label,
            category: pkt.category,
            timestamp: nowTime,
          };
          return updated;
        });

        if (i === samplePackets.length - 1) {
          setIsInjecting(false);
        }
      }, (i + 1) * 260);
    });
  };

  const handleTriggerFSM = (targetState: number) => {
    setSimState(targetState);
  };

  return (
    <div className="w-full flex flex-col justify-between select-none">
      {/* ROW 1: HTML Controls (clean underline mode tabs, toggles) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#2563EB]/20 text-xs font-mono">
        {/* Left: Mode Underline Tabs */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {(
            [
              { id: 'buffer', label: 'Encrypted Ring Buffer' },
              { id: 'statemachine', label: 'Triage State Machine' },
              { id: 'security', label: 'Air-Gapped Privacy' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              aria-pressed={activeTab === tab.id}
              className={`min-h-[36px] flex items-center pb-1 transition-colors cursor-pointer text-xs font-mono tracking-wider ${
                activeTab === tab.id
                  ? 'text-[#F4F6F9] border-b-2 border-[#FF2800] font-semibold'
                  : 'text-[#7E8B9B] hover:text-[#C8D2E0] border-b-2 border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right: Contextual HTML Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {activeTab === 'buffer' && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleSimulatePacket}
                disabled={isInjecting}
                className="min-h-[32px] px-3 py-1 bg-[#FF2800] hover:bg-[#FF4419] text-[#03050A] font-bold rounded-[2px] transition-colors cursor-pointer text-[11px] disabled:opacity-50 flex items-center"
              >
                {isInjecting ? 'Injecting...' : '▶ Inject Packet'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSlots(INITIAL_SLOTS);
                  setHeadIndex(4);
                }}
                className="min-h-[32px] px-2.5 py-1 bg-[#0B1E40] hover:bg-[#153875] text-[#7E8B9B] hover:text-[#F4F6F9] rounded-[2px] transition-colors cursor-pointer text-[11px] flex items-center"
              >
                Reset
              </button>
            </div>
          )}

          {activeTab === 'statemachine' && (
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="text-[#7E8B9B] mr-1">Simulate:</span>
              <button
                type="button"
                onClick={() => handleTriggerFSM(1)}
                className="min-h-[32px] px-2.5 py-1 bg-[#FF2800] text-[#F4F6F9] rounded-[2px] cursor-pointer font-bold flex items-center"
              >
                Crisis Intercept
              </button>
              <button
                type="button"
                onClick={() => handleTriggerFSM(2)}
                className="min-h-[32px] px-2.5 py-1 bg-[#2563EB] text-[#F4F6F9] rounded-[2px] cursor-pointer flex items-center"
              >
                Triage Cooldown
              </button>
            </div>
          )}

          {activeTab === 'security' && (
            <button
              type="button"
              onClick={() => setAuditVerified(true)}
              className="min-h-[32px] px-2.5 py-1 bg-[#0B1E40] text-[#4CC38A] border border-[#4CC38A]/30 rounded-[2px] cursor-pointer text-[11px] font-bold flex items-center"
            >
              ✓ 0.0 KB Leak Audit Verified
            </button>
          )}
        </div>
      </div>

      {/* ROW 2: Flexible canvas/drawing container (min-height: 0, height ~460px on desktop) */}
      <div className="relative w-full min-h-0 h-[280px] sm:h-[360px] lg:h-[460px] flex items-center justify-center my-3 overflow-hidden bg-[#03050A]/80 border border-[#2563EB]/15">
        {/* TAB 1: 12-Slot Circular Orbital Ring Buffer SVG */}
        {activeTab === 'buffer' && (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-3 sm:p-4">
            <svg viewBox="0 0 540 320" className="w-full h-full max-h-[420px] overflow-visible">
              <defs>
                <radialGradient id="tempoCoreGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#03050A" stopOpacity="0.0" />
                </radialGradient>
              </defs>

              {/* Central Cryptographic AES-256 Vault Core */}
              <circle cx="270" cy="160" r="48" fill="url(#tempoCoreGlow)" stroke="#2563EB" strokeWidth="1.5" />
              <text x="270" y="154" fill="#F4F6F9" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                AES-256
              </text>
              <text x="270" y="170" fill="#7E8B9B" fontSize="8" fontFamily="monospace" textAnchor="middle">
                LOCAL VAULT
              </text>

              {/* 12 Concentric Orbital Ring Guidelines */}
              <circle cx="270" cy="160" r="115" fill="none" stroke="rgba(37, 99, 235, 0.2)" strokeWidth="1" strokeDasharray="3 3" />

              {/* 12 Slots arranged radially at 30° increments */}
              {slots.map((slot, i) => {
                const angle = (i * 30 - 90) * (Math.PI / 180);
                const radius = 115;
                const sx = 270 + radius * Math.cos(angle);
                const sy = 160 + radius * Math.sin(angle);
                const isHead = slot.id === headIndex;

                let strokeCol = 'rgba(200, 210, 224, 0.3)';
                let fillCol = '#060A12';
                if (slot.category === 'crisis') {
                  strokeCol = '#FF2800';
                  fillCol = isHead ? '#FF2800' : 'rgba(255, 40, 0, 0.25)';
                } else if (slot.category === 'burnout') {
                  strokeCol = '#2563EB';
                  fillCol = isHead ? '#2563EB' : 'rgba(37, 99, 235, 0.25)';
                } else if (slot.category === 'normal') {
                  strokeCol = '#C8D2E0';
                  fillCol = isHead ? '#C8D2E0' : 'rgba(200, 210, 224, 0.15)';
                } else {
                  strokeCol = 'rgba(37, 99, 235, 0.15)';
                  fillCol = '#03050A';
                }

                return (
                  <g key={slot.id}>
                    {/* Radial Connector from Center */}
                    <line x1="270" y1="160" x2={sx} y2={sy} stroke={isHead ? '#FF2800' : 'rgba(37, 99, 235, 0.15)'} strokeWidth={isHead ? 1.5 : 0.8} />

                    {/* Slot Orbital Node */}
                    {isHead && (
                      <circle cx={sx} cy={sy} r="18" fill="none" stroke="#FF2800" strokeWidth="1" className="animate-ping" />
                    )}
                    <circle
                      cx={sx}
                      cy={sy}
                      r={isHead ? 13 : 9}
                      fill={fillCol}
                      stroke={isHead ? '#FFFFFF' : strokeCol}
                      strokeWidth={isHead ? 2 : 1}
                    />
                    <text
                      x={sx}
                      y={sy + 3}
                      fill={isHead ? '#03050A' : '#F4F6F9'}
                      fontSize="8"
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {slot.id < 10 ? `0${slot.id}` : slot.id}
                    </text>
                  </g>
                );
              })}

              {/* Active HEAD Callout Box */}
              <g transform="translate(20, 255)">
                <rect width="500" height="45" fill="#03050A" stroke="#FF2800" strokeWidth="1" />
                <text x="15" y="18" fill="#FF2800" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  ACTIVE BUFFER HEAD: SLOT {headIndex < 10 ? `0${headIndex}` : headIndex} ◀
                </text>
                <text x="15" y="34" fill="#F4F6F9" fontSize="11" fontFamily="sans-serif">
                  Payload: &quot;{slots[headIndex]?.label}&quot; — Category: {slots[headIndex]?.category.toUpperCase()} ({slots[headIndex]?.timestamp})
                </text>
              </g>
            </svg>
          </div>
        )}

        {/* TAB 2: Triage State Machine FSM Architecture SVG */}
        {activeTab === 'statemachine' && (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-3 sm:p-4">
            <svg viewBox="0 0 600 320" className="w-full h-full max-h-[420px] overflow-visible">
              <text x="20" y="30" fill="#F4F6F9" fontSize="13" fontFamily="sans-serif" fontWeight="bold">
                DETERMINISTIC COGNITIVE TRIAGE FINITE STATE MACHINE (FSM)
              </text>
              <text x="20" y="46" fill="#7E8B9B" fontSize="9" fontFamily="monospace">
                0.20ms Regex Circuit Breaker Intercept &rarr; Zero-Impulse Cooldown &rarr; Encrypted Persistence
              </text>

              {/* Connecting Transition Splines */}
              <path d="M 100 140 L 220 140" stroke={simState >= 2 ? '#2563EB' : 'rgba(37, 99, 235, 0.25)'} strokeWidth="2" />
              <path d="M 220 140 L 340 140" stroke={simState >= 3 ? '#2563EB' : 'rgba(37, 99, 235, 0.25)'} strokeWidth="2" />
              <path d="M 340 140 L 460 140" stroke={simState >= 4 ? '#4CC38A' : 'rgba(37, 99, 235, 0.25)'} strokeWidth="2" />

              {/* State 1: Intercept */}
              <g transform="translate(50, 95)" onClick={() => setSimState(1)} className="cursor-pointer">
                <rect width="90" height="90" fill="#060A12" stroke={simState === 1 ? '#FF2800' : '#2563EB'} strokeWidth={simState === 1 ? 2 : 1} />
                <text x="45" y="24" fill="#FF2800" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">STATE 01</text>
                <text x="45" y="46" fill="#F4F6F9" fontSize="11" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">INTERCEPT</text>
                <text x="45" y="66" fill="#7E8B9B" fontSize="8" fontFamily="monospace" textAnchor="middle">0.20ms Regex</text>
              </g>

              {/* State 2: Triage */}
              <g transform="translate(175, 95)" onClick={() => setSimState(2)} className="cursor-pointer">
                <rect width="90" height="90" fill="#060A12" stroke={simState === 2 ? '#2563EB' : 'rgba(37, 99, 235, 0.3)'} strokeWidth={simState === 2 ? 2 : 1} />
                <text x="45" y="24" fill="#2563EB" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">STATE 02</text>
                <text x="45" y="46" fill="#F4F6F9" fontSize="11" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">TRIAGE</text>
                <text x="45" y="66" fill="#7E8B9B" fontSize="8" fontFamily="monospace" textAnchor="middle">Cooldown</text>
              </g>

              {/* State 3: Classify */}
              <g transform="translate(295, 95)" onClick={() => setSimState(3)} className="cursor-pointer">
                <rect width="90" height="90" fill="#060A12" stroke={simState === 3 ? '#FF4419' : 'rgba(37, 99, 235, 0.3)'} strokeWidth={simState === 3 ? 2 : 1} />
                <text x="45" y="24" fill="#FF4419" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">STATE 03</text>
                <text x="45" y="46" fill="#F4F6F9" fontSize="11" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">CLASSIFY</text>
                <text x="45" y="66" fill="#7E8B9B" fontSize="8" fontFamily="monospace" textAnchor="middle">100% Recall</text>
              </g>

              {/* State 4: Persist */}
              <g transform="translate(415, 95)" onClick={() => setSimState(4)} className="cursor-pointer">
                <rect width="90" height="90" fill="#0B1E40" stroke={simState === 4 ? '#4CC38A' : '#2563EB'} strokeWidth={simState === 4 ? 2 : 1} />
                <text x="45" y="24" fill="#4CC38A" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">STATE 04</text>
                <text x="45" y="46" fill="#F4F6F9" fontSize="11" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">PERSIST</text>
                <text x="45" y="66" fill="#4CC38A" fontSize="8" fontFamily="monospace" textAnchor="middle">SQLite AES</text>
              </g>

              {/* Description Footer */}
              <g transform="translate(50, 240)">
                <rect width="500" height="42" fill="#03050A" stroke="rgba(37, 99, 235, 0.25)" strokeWidth="1" />
                <text x="15" y="18" fill="#F4F6F9" fontSize="10" fontFamily="monospace">
                  ACTIVE RULE: {simState === 1 ? 'REGEX CIRCUIT BREAKER /urgent|critical|sev-1/i' : simState === 2 ? '15-MIN COGNITIVE ISOLATION BUFFER' : simState === 3 ? 'HEURISTIC CLASSIFICATION (CRISIS / BURNOUT)' : 'LOCAL AES-256 ENCRYPTED PERSISTENCE'}
                </text>
                <text x="15" y="32" fill="#7E8B9B" fontSize="9" fontFamily="monospace">
                  Guarantees 0.0 KB network transmission while retaining 100% incident auditability.
                </text>
              </g>
            </svg>
          </div>
        )}

        {/* TAB 3: Air-Gapped Privacy Architecture SVG */}
        {activeTab === 'security' && (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-3 sm:p-4">
            <svg viewBox="0 0 600 320" className="w-full h-full max-h-[420px] overflow-visible">
              <text x="20" y="30" fill="#F4F6F9" fontSize="13" fontFamily="sans-serif" fontWeight="bold">
                AIR-GAPPED APPLICATION RUNTIME &amp; CRYPTOGRAPHIC BOUNDARY
              </text>
              <text x="20" y="46" fill="#7E8B9B" fontSize="9" fontFamily="monospace">
                Hardware-Level Zero-Telemetry Guarantee | Verified 0.0 KB Egress Ports
              </text>

              {/* Host OS Boundary Frame */}
              <rect x="30" y="70" width="540" height="150" fill="#03050A" stroke="#4CC38A" strokeWidth="1.5" strokeDasharray="6 4" />
              <text x="45" y="90" fill="#4CC38A" fontSize="10" fontFamily="monospace" fontWeight="bold">
                [STRICT AIR-GAP ISOLATION PERIMETER]
              </text>

              {/* Blocked Ports */}
              <g transform="translate(45, 110)">
                <rect width="140" height="85" fill="#060A12" stroke="#FF2800" strokeWidth="1" />
                <text x="10" y="22" fill="#FF2800" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  ❌ PORT 443 HTTPS
                </text>
                <text x="10" y="42" fill="#7E8B9B" fontSize="9" fontFamily="monospace">Outbound Blocked</text>
                <text x="10" y="62" fill="#FF2800" fontSize="11" fontFamily="monospace" fontWeight="bold">0.0 KB Transmitted</text>
              </g>

              {/* Local Storage Core */}
              <g transform="translate(230, 110)">
                <rect width="140" height="85" fill="#0B1E40" stroke="#2563EB" strokeWidth="1.5" />
                <text x="10" y="22" fill="#2563EB" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  🔒 AES-256 VAULT
                </text>
                <text x="10" y="42" fill="#C8D2E0" fontSize="9" fontFamily="monospace">SQLite + WAL Mode</text>
                <text x="10" y="62" fill="#4CC38A" fontSize="10" fontFamily="monospace">100% Local Encrypted</text>
              </g>

              {/* Memory Sandbox */}
              <g transform="translate(415, 110)">
                <rect width="140" height="85" fill="#060A12" stroke="#C8D2E0" strokeWidth="1" />
                <text x="10" y="22" fill="#C8D2E0" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  🛡️ IPC SANDBOX
                </text>
                <text x="10" y="42" fill="#7E8B9B" fontSize="9" fontFamily="monospace">Electron Context</text>
                <text x="10" y="62" fill="#2563EB" fontSize="10" fontFamily="monospace">Node Integration: Off</text>
              </g>

              {/* Bottom Cryptographic Verification Banner */}
              <g transform="translate(30, 245)">
                <rect width="540" height="42" fill="#03050A" stroke="#4CC38A" strokeWidth="1" />
                <text x="15" y="18" fill="#4CC38A" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  ✓ AUDIT VERIFIED: ZERO TELEMETRY TRANSMISSION
                </text>
                <text x="15" y="32" fill="#7E8B9B" fontSize="9" fontFamily="monospace">
                  SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 (Empty Egress)
                </text>
              </g>
            </svg>
          </div>
        )}
      </div>

      {/* ROW 3: HTML Telemetry footer (outside drawing canvas; never overlaying or clipping artwork) */}
      <div className="pt-3 border-t border-[#2563EB]/20 w-full min-w-0 text-xs font-mono">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[#7E8B9B]">
          <div>
            <span className="text-[10px] block uppercase tracking-wider">Ring Buffer Head</span>
            <span className="text-sm font-bold text-[#FF2800]">Slot {headIndex < 10 ? `0${headIndex}` : headIndex} of 12</span>
          </div>

          <div>
            <span className="text-[10px] block uppercase tracking-wider">Network Exfiltration</span>
            <span className="text-sm font-bold text-[#4CC38A]">0.0 KB (Air-Gapped)</span>
          </div>

          <div>
            <span className="text-[10px] block uppercase tracking-wider">Local Persistence</span>
            <span className="text-sm font-bold text-[#F4F6F9]">AES-256 SQLite</span>
          </div>

          <div>
            <span className="text-[10px] block uppercase tracking-wider">Crisis Recall</span>
            <span className="text-sm font-bold text-[#2563EB]">100% Recall Rate</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlateTempo;
