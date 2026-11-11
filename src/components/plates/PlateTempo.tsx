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

  return (
    <div className="w-full h-full min-h-[460px] flex flex-col justify-between select-none">
      {/* Clean Underline Mode Tabs Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 mb-2 border-b border-[#2563EB]/20 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF2800] animate-pulse" />
          <span className="text-[#C8D2E0] font-semibold tracking-wider">
            AIR-GAPPED LOCAL-FIRST RING BUFFER &amp; STATE MACHINE
          </span>
        </div>

        {/* Clean Underline Tabs */}
        <div className="flex items-center gap-6 pt-2 sm:pt-0">
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
              className={`pb-1 transition-colors cursor-pointer text-xs font-mono tracking-wider ${
                activeTab === tab.id
                  ? 'text-[#F4F6F9] border-b-2 border-[#FF2800] font-semibold'
                  : 'text-[#7E8B9B] hover:text-[#C8D2E0] border-b-2 border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Stage Body */}
      <div className="relative flex-1 w-full min-h-[400px] flex items-center justify-center p-2">
        {/* TAB 1: Encrypted Ring Buffer */}
        {activeTab === 'buffer' && (
          <div className="relative w-full h-full min-h-[390px] flex flex-col justify-between py-2">
            {/* 12-Slot Orbital / Ring Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-auto">
              {slots.map((slot) => {
                const isHead = slot.id === headIndex;
                const isCrisis = slot.category === 'crisis';
                const isBurnout = slot.category === 'burnout';
                const isEmpty = slot.category === 'empty';

                return (
                  <div
                    key={slot.id}
                    className={`p-3 border-b transition-all duration-200 ${
                      isHead
                        ? 'border-[#FF2800] bg-[#FF2800]/5'
                        : isCrisis
                        ? 'border-[#FF2800]/60'
                        : isBurnout
                        ? 'border-[#2563EB]/60'
                        : isEmpty
                        ? 'border-[#2563EB]/15 opacity-40'
                        : 'border-[#C8D2E0]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                      <span className={isHead ? 'text-[#FF2800] font-bold' : 'text-[#7E8B9B]'}>
                        SLOT {slot.id < 10 ? `0${slot.id}` : slot.id} {isHead && '◀ HEAD'}
                      </span>
                      <span className="text-[#7E8B9B]">{slot.timestamp}</span>
                    </div>
                    <div className="text-xs font-mono text-[#F4F6F9] truncate font-medium">
                      {slot.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Injection Trigger Button */}
            <div className="flex items-center justify-between pt-3 border-t border-[#2563EB]/20 text-xs font-mono">
              <span className="text-[#7E8B9B]">LOCAL SQLITE PERSISTENCE: AES-256</span>
              <button
                type="button"
                onClick={handleSimulatePacket}
                disabled={isInjecting}
                className="px-4 py-2 bg-[#FF2800] hover:bg-[#FF4419] text-[#03050A] font-bold rounded-[2px] transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                <span>{isInjecting ? 'Processing Gate...' : 'Inject Incoming Task Packet'}</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Triage State Machine */}
        {activeTab === 'statemachine' && (
          <div className="w-full h-full flex flex-col justify-center space-y-6 text-xs font-mono py-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="pb-3 border-b border-[#FF2800]">
                <span className="text-[10px] text-[#FF2800]">STATE 01: INTERCEPT</span>
                <div className="text-sm font-bold text-[#F4F6F9] mt-1">Regex Circuit Breaker</div>
                <span className="text-[#FF2800] text-[11px]">0.20ms Deterministic Gate</span>
              </div>
              <div className="pb-3 border-b border-[#2563EB]">
                <span className="text-[10px] text-[#2563EB]">STATE 02: TRIAGE</span>
                <div className="text-sm font-bold text-[#F4F6F9] mt-1">Cognitive Delay Buffer</div>
                <span className="text-[#2563EB] text-[11px]">Zero-Impulse Cooldown</span>
              </div>
              <div className="pb-3 border-b border-[#C8D2E0]">
                <span className="text-[10px] text-[#C8D2E0]">STATE 03: PERSIST</span>
                <div className="text-sm font-bold text-[#F4F6F9] mt-1">Encrypted Ring Buffer</div>
                <span className="text-[#4CC38A] text-[11px]">100% Local Journal</span>
              </div>
            </div>

            <p className="text-sm font-sans text-[#7E8B9B] leading-relaxed max-w-xl">
              Deterministic finite state machine processes incoming notifications and communications through regex circuit breakers before presenting them to the user, preventing cognitive burnout during high-stress operational cycles.
            </p>
          </div>
        )}

        {/* TAB 3: Air-Gapped Privacy */}
        {activeTab === 'security' && (
          <div className="w-full h-full flex flex-col justify-center space-y-6 text-xs font-mono py-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="pb-3 border-b border-[#4CC38A]">
                <span className="text-[10px] text-[#4CC38A]">NETWORK EXFILTRATION</span>
                <div className="text-sm font-bold text-[#F4F6F9] mt-1">0.0 KB (Air-Gapped)</div>
                <span className="text-[#4CC38A] text-[11px]">Strict Zero-Telemetry</span>
              </div>
              <div className="pb-3 border-b border-[#2563EB]/30">
                <span className="text-[10px] text-[#7E8B9B]">LOCAL STORAGE</span>
                <div className="text-sm font-bold text-[#F4F6F9] mt-1">SQLite + IndexedDB</div>
                <span className="text-[#C8D2E0] text-[11px]">AES-256 Encrypted</span>
              </div>
              <div className="pb-3 border-b border-[#FF2800]">
                <span className="text-[10px] text-[#FF2800]">CRISIS RECALL</span>
                <div className="text-sm font-bold text-[#F4F6F9] mt-1">100% Recall Rate</div>
                <span className="text-[#FF2800] text-[11px]">Verified Invariant</span>
              </div>
            </div>

            <p className="text-sm font-sans text-[#7E8B9B] leading-relaxed max-w-xl">
              Engineered for absolute client data sovereignty. No analytical telemetry, user metrics, or message payloads ever leave the local machine boundary.
            </p>
          </div>
        )}
      </div>

      {/* Clean Bottom Status Line */}
      <div className="pt-3 border-t border-[#2563EB]/20 flex items-center justify-between text-[11px] font-mono text-[#7E8B9B]">
        <span>RUNTIME: Electron · React · SQLite · IndexedDB</span>
        <span className="text-[#4CC38A]">0.0 KB Exfiltration · 100% Local Persistence</span>
      </div>
    </div>
  );
};

export default PlateTempo;
