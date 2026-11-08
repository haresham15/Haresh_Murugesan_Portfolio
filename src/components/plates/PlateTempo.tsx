import React, { useState, useEffect } from 'react';

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
  const [burstActive, setBurstActive] = useState<boolean>(false);
  const [lastPacket, setLastPacket] = useState<string>('Unread Feedback Freeze');

  const simulateTaskBurst = () => {
    setBurstActive(true);
    const newPackets: { label: string; category: 'crisis' | 'burnout' | 'normal' }[] = [
      { label: 'Executive "Can We Talk?" Trigger', category: 'crisis' },
      { label: 'Refactoring Architecture RFC', category: 'normal' },
      { label: 'Impostor Syndrome Drift', category: 'burnout' },
      { label: 'Weekly Standup Agenda', category: 'normal' },
    ];

    let currentHead = headIndex;
    newPackets.forEach((pkt, idx) => {
      setTimeout(() => {
        currentHead = (currentHead + 1) % slots.length;
        setHeadIndex(currentHead);
        setLastPacket(pkt.label);
        setSlots((prev) => {
          const updated = [...prev];
          const nowStr = new Date().toTimeString().slice(0, 8);
          updated[currentHead] = {
            id: currentHead,
            label: pkt.label,
            category: pkt.category,
            timestamp: nowStr,
          };
          return updated;
        });

        if (idx === newPackets.length - 1) {
          setTimeout(() => setBurstActive(false), 400);
        }
      }, (idx + 1) * 220);
    });
  };

  return (
    <div className="w-full h-full min-h-[440px] flex flex-col justify-between select-none">
      {/* Top Controls Header */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#2563EB]/20 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" />
          <span className="text-[#2563EB] font-semibold tracking-wider">PLATE 04 · ENCRYPTED RING BUFFER &amp; STATE MACHINE</span>
        </div>

        {/* Mode Tabs */}
        <div className="flex items-center gap-1 bg-[#060A12]/80 p-1 rounded-[2px] border border-[#F4F6F9]/10">
          <button
            type="button"
            onClick={() => setActiveTab('buffer')}
            className={`px-2.5 py-1 rounded-[2px] transition-colors ${
              activeTab === 'buffer'
                ? 'bg-[#FF2800] text-[#070B12] font-semibold'
                : 'text-[#7E8B9B] hover:text-[#F4F6F9]'
            }`}
          >
            Ring Buffer
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('statemachine')}
            className={`px-2.5 py-1 rounded-[2px] transition-colors ${
              activeTab === 'statemachine'
                ? 'bg-[#FF2800] text-[#070B12] font-semibold'
                : 'text-[#7E8B9B] hover:text-[#F4F6F9]'
            }`}
          >
            Triage State Machine
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`px-2.5 py-1 rounded-[2px] transition-colors ${
              activeTab === 'security'
                ? 'bg-[#FF2800] text-[#070B12] font-semibold'
                : 'text-[#7E8B9B] hover:text-[#F4F6F9]'
            }`}
          >
            Air-Gap Security
          </button>
        </div>
      </div>

      {/* Main Interactive Stage Body */}
      <div className="relative flex-1 w-full flex items-center justify-center p-4">
        {/* TAB 1: 12-Slot Encrypted Ring Buffer */}
        {activeTab === 'buffer' && (
          <div className="w-full h-full flex flex-col justify-between space-y-4">
            {/* Top Ingestion Flow Visualizer */}
            <div className="flex items-center justify-between p-3 bg-[#060A12]/80 rounded-[2px] border border-[#F4F6F9]/10 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${burstActive ? 'bg-[#FF2800] animate-ping' : 'bg-[#4CC38A]'}`} />
                <span className="text-[#7E8B9B]">INGESTION HEAD:</span>
                <span className="text-[#C8D2E0] font-bold">SLOT #{headIndex}</span>
              </div>
              <div className="truncate max-w-[240px] text-[#2563EB]">{lastPacket}</div>
              <button
                type="button"
                onClick={simulateTaskBurst}
                disabled={burstActive}
                className="px-3 py-1 bg-[#FF2800] hover:bg-[#FF4419] text-[#070B12] font-bold rounded-[2px] cursor-pointer transition-colors"
              >
                {burstActive ? 'STREAMING...' : '⚡ Simulate Task Burst'}
              </button>
            </div>

            {/* Circular Ring Buffer Graphic Representation */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {slots.map((slot) => {
                const isHead = slot.id === headIndex;
                const isCrisis = slot.category === 'crisis';
                const isBurnout = slot.category === 'burnout';
                const isNormal = slot.category === 'normal';

                return (
                  <div
                    key={slot.id}
                    className={`p-2.5 rounded-[2px] border transition-all ${
                      isHead
                        ? 'border-[#FF2800] bg-[#FF2800]/10 shadow-[0_0_14px_rgba(255,107,53,0.3)]'
                        : isCrisis
                        ? 'border-[#F87171]/40 bg-[#F87171]/5'
                        : isBurnout
                        ? 'border-[#C8D2E0]/40 bg-[#C8D2E0]/5'
                        : isNormal
                        ? 'border-[#2563EB]/30 bg-[#2563EB]/5'
                        : 'border-white/5 bg-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                      <span className={isHead ? 'text-[#FF2800] font-bold' : 'text-[#7A889B]'}>
                        #{slot.id}
                      </span>
                      <span className="text-[#7A889B]">{slot.timestamp}</span>
                    </div>
                    <div className="text-[11px] font-sans font-medium text-[#F4F6F9] line-clamp-1">
                      {slot.label}
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[9px] font-mono">
                      <span
                        className={
                          isCrisis
                            ? 'text-[#F87171] font-bold'
                            : isBurnout
                            ? 'text-[#C8D2E0]'
                            : isNormal
                            ? 'text-[#2563EB]'
                            : 'text-[#7A889B]'
                        }
                      >
                        {slot.category.toUpperCase()}
                      </span>
                      {isHead && <span className="text-[#FF2800] animate-pulse">● HEAD</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: Triage State Machine */}
        {activeTab === 'statemachine' && (
          <div className="w-full h-full flex flex-col justify-center p-6 space-y-4 text-xs font-mono">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-[#060A12]/80 border border-[#F87171]/40 rounded-[2px]">
                <div className="text-[10px] text-[#F87171]">CIRCUIT BREAKER</div>
                <div className="text-base font-bold text-[#F4F6F9] mt-1">Regex Intercept</div>
                <div className="text-[10px] text-[#4CC38A] mt-0.5">0.20ms Deterministic Gate</div>
              </div>
              <div className="p-3 bg-[#060A12]/80 border border-[#C8D2E0]/40 rounded-[2px]">
                <div className="text-[10px] text-[#C8D2E0]">SEMANTIC REFRAME</div>
                <div className="text-base font-bold text-[#F4F6F9] mt-1">Local pgvector</div>
                <div className="text-[10px] text-[#4CC38A] mt-0.5">0.14ms Cosine Similarity</div>
              </div>
              <div className="p-3 bg-[#060A12]/80 border border-[#2563EB]/40 rounded-[2px]">
                <div className="text-[10px] text-[#2563EB]">ACTIVE-PASSIVE</div>
                <div className="text-base font-bold text-[#F4F6F9] mt-1">Dual-LLM Failover</div>
                <div className="text-[10px] text-[#4CC38A] mt-0.5">Primary → Fallback</div>
              </div>
            </div>

            <div className="p-4 bg-transparent border border-[#F4F6F9]/10 rounded-[2px] text-[#7E8B9B] leading-relaxed">
              Deterministic finite state machine (FSM) classifies incoming messages before display, routing high-arousal rejection sensitivity triggers into cognitive buffer delays without external telemetry.
            </div>
          </div>
        )}

        {/* TAB 3: Air-Gap Security */}
        {activeTab === 'security' && (
          <div className="w-full h-full flex flex-col justify-center p-6 space-y-4 text-xs font-mono">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-[#060A12]/80 border border-[#4CC38A]/30 rounded-[2px]">
                <span className="text-[#7E8B9B] text-[10px]">NETWORK EXFILTRATION</span>
                <div className="text-2xl font-bold text-[#4CC38A] mt-1">0.0 KB</div>
                <div className="text-[10px] text-[#7A889B] mt-1">Zero external tracking requests</div>
              </div>
              <div className="p-4 bg-[#060A12]/80 border border-[#2563EB]/30 rounded-[2px]">
                <span className="text-[#7E8B9B] text-[10px]">LOCAL STORAGE</span>
                <div className="text-2xl font-bold text-[#2563EB] mt-1">100% SQLite</div>
                <div className="text-[10px] text-[#7A889B] mt-1">AES-256 client-side encryption</div>
              </div>
            </div>

            <div className="p-4 bg-transparent border border-[#F4F6F9]/10 rounded-[2px] text-[#7E8B9B] leading-relaxed">
              Complete local execution model: all emotional history embeddings, message drafts, and cognitive models remain on-device with zero cloud telemetry.
            </div>
          </div>
        )}
      </div>

      {/* Bottom Status Footer */}
      <div className="pt-3 border-t border-[#2563EB]/20 flex items-center justify-between text-[11px] font-mono text-[#7A889B]">
        <span>ENCRYPTION: Local SQLite (AES-256)</span>
        <span className="text-[#4CC38A]">0.0 KB Exfiltration</span>
      </div>
    </div>
  );
};

export default PlateTempo;
